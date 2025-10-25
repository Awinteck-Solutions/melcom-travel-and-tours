import { Request, Response } from "express";
import axios from "axios";
import { Bookings } from "../../bookings/schema/bookings.schema";

export class PaymentsController {
  private static HUBTEL_API_BASE_URL = "https://payproxyapi.hubtel.com";
  private static HUBTEL_API_ID = process.env.HUBTEL_API_ID;
  private static HUBTEL_API_KEY = process.env.HUBTEL_API_KEY;
  private static MERCHANT_ACCOUNT_NUMBER = process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER;

  // Initialize payment for flight booking
  static async initiateFlightPayment(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { returnUrl, cancellationUrl } = req.body;

      console.log('bookingId', bookingId)

      // Find the booking
      const booking = await Bookings.findOne({
        _id: bookingId,
        userId:null,
        bookingType: "FLIGHT",
        status: "PENDING",
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Flight booking not found or already processed",
        });
      }

      booking.totalAmount = 100;
      booking.bookingReference = "FLIGHT-1234567890";
      booking.flightDetails.departureCity = "Accra";
      booking.flightDetails.arrivalCity = "London";
      booking.contactInfo.email = "awinsamp@yahoo.com";
      booking.contactInfo.phone = "+233547785025";
      booking.flightDetails.passengers.push({
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+233123456789"
      });


      // Prepare Hubtel payment request
      const hubtelRequest = {
        totalAmount: booking.totalAmount,
        description: `Flight Booking - ${booking.flightDetails.departureCity} to ${booking.flightDetails.arrivalCity}`,
        callbackUrl: `${process.env.BASE_URL}/api/payments/hubtel/callback`,
        returnUrl: returnUrl || `${process.env.FRONTEND_URL}/booking/success/${bookingId}`,
        merchantAccountNumber: this.MERCHANT_ACCOUNT_NUMBER,
        cancellationUrl: cancellationUrl || `${process.env.FRONTEND_URL}/booking/cancelled/${bookingId}`,
        clientReference: booking.bookingReference,
        payeeName: `${booking.flightDetails.passengers[0]?.firstName} ${booking.flightDetails.passengers[0]?.lastName}`,
        payeeMobileNumber: booking.contactInfo.phone,
        payeeEmail: booking.contactInfo.email,
      };

      // Create Basic Auth header
      const authString = Buffer.from(`${this.HUBTEL_API_ID}:${this.HUBTEL_API_KEY}`).toString('base64');
      // const authString = Buffer.from(`rmwpGvK:70e882d9cb4047d1921f8d2510fea434`).toString('base64');
      console.log('authString', authString)
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
        
        console.log('hubtelResponse', hubtelResponse)

      const { checkoutUrl, checkoutId, clientReference, checkoutDirectUrl } = hubtelResponse.data;

      // Update booking with payment reference
      await Bookings.findByIdAndUpdate(bookingId, {
        paymentReference: checkoutId,
        notes: `Hubtel Payment Initiated - Checkout ID: ${checkoutId}`,
      });

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        data: {
          bookingId,
          bookingReference: booking.bookingReference,
          payment: {
            checkoutUrl,
            checkoutId,
            clientReference,
            checkoutDirectUrl,
            amount: booking.totalAmount,
            currency: booking.currency,
          },
          instructions: {
            redirect: "Redirect user to checkoutUrl for payment",
            direct: "Use checkoutDirectUrl for inline payment",
          },
        },
      });

    } catch (error) {
      console.error("Payment initiation error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to initiate payment",
        error: error.response?.data || error.message,
      });
    }
  }

  // Hubtel payment callback handler
  static async hubtelCallback(req: Request, res: Response) {
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

      console.log("Hubtel Callback received:", req.body);

      // Find booking by client reference (booking reference)
      const booking = await Bookings.findOne({
        bookingReference: ClientReference,
        paymentReference: CheckoutId,
      });

      if (!booking) {
        console.error("Booking not found for callback:", ClientReference);
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      // Update booking based on payment status
      let bookingStatus = "PENDING";
      let paymentStatus = "PENDING";
      let confirmationDate = null;

      if (ResponseCode === "0000" && Status === "Success") {
        bookingStatus = "CONFIRMED";
        paymentStatus = "PAID";
        confirmationDate = new Date();
      } else if (Status === "Failed" || Status === "Cancelled") {
        bookingStatus = "FAILED";
        paymentStatus = "FAILED";
      }

      // Update booking
      await Bookings.findByIdAndUpdate(booking._id, {
        status: bookingStatus,
        paymentStatus: paymentStatus,
        confirmationDate,
        paymentReference: TransactionId || CheckoutId,
        notes: `Payment ${Status} - ${ResponseText} - Transaction ID: ${TransactionId}`,
      });

      // Send confirmation email if payment successful
      if (bookingStatus === "CONFIRMED") {
        // TODO: Send booking confirmation email
        console.log("Payment successful, sending confirmation email...");
      }

      return res.status(200).json({
        success: true,
        message: "Callback processed successfully",
        data: {
          bookingId: booking._id,
          bookingReference: booking.bookingReference,
          status: bookingStatus,
          paymentStatus: paymentStatus,
        },
      });

    } catch (error) {
      console.error("Hubtel callback error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process callback",
        error: error.message,
      });
    }
  }

  // Get payment status
  static async getPaymentStatus(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const userId = req["currentUser"]?.id;

      const booking = await Bookings.findOne({
        _id: bookingId,
        userId,
        bookingType: "FLIGHT",
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Payment status retrieved successfully",
        data: {
          bookingId: booking._id,
          bookingReference: booking.bookingReference,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paymentReference: booking.paymentReference,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          bookingDate: booking.bookingDate,
          confirmationDate: booking.confirmationDate,
        },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve payment status",
        error: error.message,
      });
    }
  }

  // Cancel payment/booking
  static async cancelPayment(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;
      const userId = req["currentUser"]?.id;

      const booking = await Bookings.findOne({
        _id: bookingId,
        userId,
        bookingType: "FLIGHT",
        status: { $in: ["PENDING", "CONFIRMED"] },
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or cannot be cancelled",
        });
      }

      // Update booking status
      await Bookings.findByIdAndUpdate(bookingId, {
        status: "CANCELLED",
        paymentStatus: booking.paymentStatus === "PAID" ? "REFUNDED" : "FAILED",
        cancellationDate: new Date(),
        cancellationReason: reason || "User requested cancellation",
        notes: `Booking cancelled - ${reason || "User request"}`,
      });

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: {
          bookingId: booking._id,
          bookingReference: booking.bookingReference,
          status: "CANCELLED",
          cancellationDate: new Date(),
        },
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to cancel booking",
        error: error.message,
      });
    }
  }

  // Verify payment with Hubtel (optional - for manual verification)
  static async verifyPayment(req: Request, res: Response) {
    try {
      const { checkoutId } = req.params;

      // Create Basic Auth header
      const authString = Buffer.from(`${this.HUBTEL_API_ID}:${this.HUBTEL_API_KEY}`).toString('base64');

      // Query Hubtel for payment status
      const hubtelResponse = await axios.get(
        `${this.HUBTEL_API_BASE_URL}/items/status/${checkoutId}`,
        {
          headers: {
            'Authorization': `Basic ${authString}`,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Payment verification completed",
        data: hubtelResponse.data,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment",
        error: error.response?.data || error.message,
      });
    }
  }
}
