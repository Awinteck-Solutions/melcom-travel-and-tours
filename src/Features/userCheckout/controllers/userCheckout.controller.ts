import { Request, Response } from "express";
import axios from "axios";
import UserCheckout from "../schema/userCheckout.schema";
import { CheckoutRequestDTO, CheckoutResponseDTO } from "../dto/userCheckout.dto";

export class UserCheckoutController {
  private static HUBTEL_API_BASE_URL = "https://payproxyapi.hubtel.com";
  private static HUBTEL_API_ID = process.env.HUBTEL_API_ID;
  private static HUBTEL_API_KEY = process.env.HUBTEL_API_KEY;
  private static MERCHANT_ACCOUNT_NUMBER = process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER;
  private static GOL_API_BASE_URL = "https://golapi.golibe.com";

  // Generate unique booking reference
  private static generateBookingReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MT${timestamp}${random}`;
  }

  // Create checkout and initiate payment
  static async createCheckout(req: Request, res: Response) {
    try {
      const checkoutData: CheckoutRequestDTO = req.body;
      const userId = req["currentUser"]?.id || "guest";

      // Validate required data
      if (!checkoutData.flight || !checkoutData.Traveler || checkoutData.Traveler.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Flight and traveler information are required",
        });
      }

      // Generate unique booking reference
      const bookingReference = this.generateBookingReference();

      // Calculate total amount
      const totalAmount = checkoutData.flight.price * checkoutData.Traveler.length;

      // Create checkout record
      const checkout = new UserCheckout({
        bookingReference,
        flight: checkoutData.flight,
        travelers: checkoutData.Traveler,
        totalAmount,
        currency: checkoutData.flight.currency || 'GHS',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        userId,
        contactInfo: {
          email: checkoutData.Traveler[0]?.email || 'user@example.com',
          phone: checkoutData.Traveler[0]?.phone || '+233123456789',
          name: `${checkoutData.Traveler[0]?.NamePrefix} ${checkoutData.Traveler[0]?.GivenName} ${checkoutData.Traveler[0]?.Surname}`
        }
      });

      await checkout.save();

      // Prepare Hubtel payment request
      const hubtelRequest = {
        totalAmount: totalAmount,
        description: `Flight Booking - ${checkoutData.flight.from} to ${checkoutData.flight.to}`,
        callbackUrl: `${process.env.BASE_URL}/api/checkout/payment/callback`,
        returnUrl: `${process.env.FRONTEND_URL}/booking/success/${checkout._id}`,
        merchantAccountNumber: this.MERCHANT_ACCOUNT_NUMBER,
        cancellationUrl: `${process.env.FRONTEND_URL}/booking/cancelled/${checkout._id}`,
        clientReference: bookingReference,
        payeeName: `${checkoutData.Traveler[0]?.NamePrefix} ${checkoutData.Traveler[0]?.GivenName} ${checkoutData.Traveler[0]?.Surname}`,
        payeeMobileNumber: checkout.contactInfo.phone,
        payeeEmail: checkout.contactInfo.email,
      };

      // Create Basic Auth header for Hubtel
      const authString = Buffer.from(`${this.HUBTEL_API_ID}:${this.HUBTEL_API_KEY}`).toString('base64');

      // Make request to Hubtel
      const hubtelResponse = await axios.post(
        `${this.HUBTEL_API_BASE_URL}/items/initiate`,
        hubtelRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authString}`,
          },
        }
      );

      if (hubtelResponse.data.status !== 'Success') {
        return res.status(500).json({
          success: false,
          message: "Failed to create checkout",
          error: hubtelResponse.data.message,
        });
      }
      const { checkoutUrl, checkoutId, clientReference, checkoutDirectUrl } = hubtelResponse.data.data;

      checkout.checkoutId = checkoutId; 
      await checkout.save();

      // Update checkout with payment reference
      await UserCheckout.findByIdAndUpdate(checkout._id, {
        checkoutId,
        notes: `Hubtel Payment Initiated - Checkout ID: ${checkoutId}`,
      });

      console.log('hubtelResponse.data.checkoutUrl', hubtelResponse.data.data)

      console.log( checkoutId,
        checkoutUrl,
        bookingReference,)
      const response: CheckoutResponseDTO = {
        checkoutId,
        checkoutUrl,
        bookingReference,
        status: 'PENDING',
        message: 'Checkout created successfully. Redirect user to checkoutUrl for payment.'
      };

      return res.status(200).json({
        success: true,
        message: "Checkout created successfully",
        data: response,
        instructions: {
          redirect: "Redirect user to checkoutUrl for payment",
          direct: "Use checkoutDirectUrl for inline payment",
        },
      });

    } catch (error) {
      console.error("Checkout creation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create checkout",
        error: error.response?.data || error.message,
      });
    }
  }

  // Handle Hubtel payment callback
  static async paymentCallback(req: Request, res: Response) {
    try {
      const { 
        ResponseCode, 
        ResponseText, 
        Data: { 
          CheckoutId, 
          ClientReference, 
          Amount, 
          Status, 
          TransactionId,
          Description 
        } 
      } = req.body;

      console.log("Hubtel Payment Callback received:", req.body);

      // Find checkout by client reference (booking reference)
      const checkout = await UserCheckout.findOne({
        bookingReference: ClientReference,
        checkoutId: CheckoutId,
      });

      if (!checkout) {
        console.error("Checkout not found for callback:", ClientReference);
        return res.status(404).json({
          success: false,
          message: "Checkout not found",
        });
      }

      // Perform status check with Hubtel using ClientReference
      let hubtelStatusCheck = null;
      try {
        hubtelStatusCheck = await this.checkHubtelTransactionStatus(ClientReference);
        console.log("Hubtel status check result:", hubtelStatusCheck);
      } catch (statusError) {
        console.error("Hubtel status check error:", statusError);
        // Continue with callback data if status check fails
      }

      // Use Hubtel status check result if available, otherwise use callback data
      const finalStatus = hubtelStatusCheck?.status || Status;
      const finalTransactionId = hubtelStatusCheck?.transactionId || TransactionId;
      const finalResponseCode = hubtelStatusCheck?.responseCode || ResponseCode;

      // Update checkout based on payment status
      let checkoutStatus = "PENDING";
      let paymentStatus = "PENDING";

      if (finalResponseCode === "0000" && finalStatus === "Success") {
        checkoutStatus = "CONFIRMED";
        paymentStatus = "PAID";
        
        // Create GOL API reservation
        try {
          const golReservationId = await this.createGOLReservation(checkout);
          
          // Update checkout with GOL reservation ID
          await UserCheckout.findByIdAndUpdate(checkout._id, {
            status: checkoutStatus,
            paymentStatus: paymentStatus,
            transactionId: finalTransactionId,
            golReservationId,
            notes: `Payment ${finalStatus} - ${ResponseText} - Transaction ID: ${finalTransactionId} - GOL Reservation: ${golReservationId} - Status Check: ${hubtelStatusCheck ? 'Verified' : 'Callback Only'}`,
          });
        } catch (golError) {
          console.error("GOL reservation error:", golError);
          // Update with payment success but note GOL reservation failure
          await UserCheckout.findByIdAndUpdate(checkout._id, {
            status: "CONFIRMED",
            paymentStatus: "PAID",
            transactionId: finalTransactionId,
            notes: `Payment ${finalStatus} - ${ResponseText} - Transaction ID: ${finalTransactionId} - GOL Reservation Failed: ${golError.message} - Status Check: ${hubtelStatusCheck ? 'Verified' : 'Callback Only'}`,
          });
        }
      } else if (finalStatus === "Failed" || finalStatus === "Cancelled") {
        checkoutStatus = "FAILED";
        paymentStatus = "FAILED";
        
        await UserCheckout.findByIdAndUpdate(checkout._id, {
          status: checkoutStatus,
          paymentStatus: paymentStatus,
          transactionId: finalTransactionId,
          notes: `Payment ${finalStatus} - ${ResponseText} - Transaction ID: ${finalTransactionId} - Status Check: ${hubtelStatusCheck ? 'Verified' : 'Callback Only'}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment callback processed successfully",
        data: {
          checkoutId: checkout._id,
          bookingReference: checkout.bookingReference,
          status: checkoutStatus,
          paymentStatus: paymentStatus,
          hubtelStatusCheck: hubtelStatusCheck ? 'Verified' : 'Callback Only',
        },
      });

    } catch (error) {
      console.error("Payment callback error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process payment callback",
        error: error.message,
      });
    }
  }

  // Check Hubtel transaction status using ClientReference
  private static async checkHubtelTransactionStatus(clientReference: string): Promise<any> {
    try {
      const authString = Buffer.from(`${this.HUBTEL_API_ID}:${this.HUBTEL_API_KEY}`).toString('base64');
      
      // First, we need to get the transaction ID from the client reference
      // This might require a different endpoint or we might need to use the checkout ID
      // For now, let's try to get status using the client reference
      const statusResponse = await axios.get(
        `https://api-txnstatus.hubtel.com/transactions/${process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER}/status?clientReference=${clientReference}`,
        {
          headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Hubtel status check response:", statusResponse.data);
      return statusResponse.data;

    } catch (error) {
      console.error("Hubtel status check error:", error.response?.data || error.message);
      throw error;
    }
  }

  // Create GOL API reservation
  private static async createGOLReservation(checkout: any): Promise<string> {
    try {
      // Prepare GOL API reservation request
      const golRequest = {
        passengers: checkout.travelers.map((traveler: any) => ({
          type: traveler.PassengerType,
          firstName: traveler.GivenName,
          lastName: traveler.Surname,
          dateOfBirth: traveler.BirthDate,
          gender: traveler.Gender,
          passport: traveler.Passport,
          loyaltyProgram: traveler.LoyaltyProgram
        })),
        segments: checkout.flight.segments.map((segment: any) => ({
          flightNumber: segment.flightNumber,
          departure: {
            airport: segment.departure.airport,
            date: segment.departure.time,
            terminal: segment.departure.terminal
          },
          arrival: {
            airport: segment.arrival.airport,
            date: segment.arrival.time,
            terminal: segment.arrival.terminal
          },
          cabinClass: segment.cabinClass
        })),
        contactInfo: {
          email: checkout.contactInfo.email,
          phone: checkout.contactInfo.phone,
          name: checkout.contactInfo.name
        },
        bookingReference: checkout.bookingReference
      };

      // Make request to GOL API
      const golResponse = await axios.post(
        `${this.GOL_API_BASE_URL}/api/reservations`,
        golRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GOL_API_TOKEN}`,
          },
        }
      );

      return golResponse.data.reservationId || golResponse.data.id;

    } catch (error) {
      console.error("GOL reservation creation error:", error);
      throw new Error(`GOL reservation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Check payment status
  static async checkPaymentStatus(req: Request, res: Response) {
    try {
      const { checkoutId } = req.params;

      const checkout = await UserCheckout.findById(checkoutId);

      if (!checkout) {
        return res.status(404).json({
          success: false,
          message: "Checkout not found",
        });
      }

      // If payment is pending, check with Hubtel using ClientReference
      if (checkout.paymentStatus === 'PENDING' && checkout.bookingReference) {
        try {
          const hubtelStatusCheck = await this.checkHubtelTransactionStatus(checkout.bookingReference);
          console.log("Manual status check result:", hubtelStatusCheck);

          // Update status based on Hubtel response
          if (hubtelStatusCheck?.status === 'Success' && hubtelStatusCheck?.responseCode === '0000') {
            await UserCheckout.findByIdAndUpdate(checkoutId, {
              status: 'CONFIRMED',
              paymentStatus: 'PAID',
              transactionId: hubtelStatusCheck.transactionId,
              notes: `Status updated via manual check - Transaction ID: ${hubtelStatusCheck.transactionId}`,
            });
          } else if (hubtelStatusCheck?.status === 'Failed' || hubtelStatusCheck?.status === 'Cancelled') {
            await UserCheckout.findByIdAndUpdate(checkoutId, {
              status: 'FAILED',
              paymentStatus: 'FAILED',
              transactionId: hubtelStatusCheck.transactionId,
              notes: `Status updated via manual check - ${hubtelStatusCheck.status} - Transaction ID: ${hubtelStatusCheck.transactionId}`,
            });
          }
        } catch (hubtelError) {
          console.error("Hubtel status check error:", hubtelError);
        }
      }

      // Return updated checkout
      const updatedCheckout = await UserCheckout.findById(checkoutId);

      return res.status(200).json({
        success: true,
        message: "Payment status retrieved successfully",
        data: {
          checkoutId: updatedCheckout._id,
          bookingReference: updatedCheckout.bookingReference,
          status: updatedCheckout.status,
          paymentStatus: updatedCheckout.paymentStatus,
          transactionId: updatedCheckout.transactionId,
          golReservationId: updatedCheckout.golReservationId,
          totalAmount: updatedCheckout.totalAmount,
          currency: updatedCheckout.currency,
          createdAt: updatedCheckout.createdAt,
          updatedAt: updatedCheckout.updatedAt,
        },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to check payment status",
        error: error.message,
      });
    }
  }

  // Get all checkouts (for admin or user)
  static async getAllCheckouts(req: Request, res: Response) {
    try {
      const userId = req["currentUser"]?.id;
      const query = userId ? { userId } : {};

      const checkouts = await UserCheckout.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Checkouts retrieved successfully",
        data: checkouts,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve checkouts",
        error: error.message,
      });
    }
  }
}