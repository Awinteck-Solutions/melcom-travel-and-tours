import {Request, Response} from "express";
import axios from "axios";
import fs from "fs";
import UserCheckout from "../schema/userCheckout.schema";
import {CheckoutRequestDTO, CheckoutResponseDTO} from "../dto/userCheckout.dto";

export class UserCheckoutController {
  private static HUBTEL_API_BASE_URL = "https://payproxyapi.hubtel.com";
  private static HUBTEL_API_ID = process.env.HUBTEL_API_ID;
  private static HUBTEL_API_KEY = process.env.HUBTEL_API_KEY;
  private static MERCHANT_ACCOUNT_NUMBER =
    process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER;
  private static GOL_API_BASE_URL =
    process.env.GOL_API_BASE_URL || "https://golapi.golibe.com/json.php";
  private static GOL_CLIENT_ID = process.env.GOL_CLIENT_ID;
  private static GOL_PASSWORD = process.env.GOL_PASSWORD;
  private static GOL_PASSIVE_SESSION_ID = process.env.GOL_PASSIVE_SESSION_ID;

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
      console.log("checkoutData", checkoutData);
      // Validate required data
      if (
        !checkoutData.flight ||
        !checkoutData.Traveler ||
        checkoutData.Traveler.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Flight and traveler information are required",
        });
      }
      // Validate environment variables
      if (
        !this.HUBTEL_API_ID ||
        !this.HUBTEL_API_KEY ||
        !this.MERCHANT_ACCOUNT_NUMBER
      ) {
        console.error("Missing Hubtel environment variables");
        return res.status(500).json({
          success: false,
          message: "Payment gateway configuration error",
        });
      }
      // Generate unique booking reference
      const bookingReference = this.generateBookingReference();

      // Calculate total amount
      const totalAmount =
        checkoutData.flight.price * checkoutData.Traveler.length;

      // Create checkout record
      const checkout = new UserCheckout({
        bookingReference,
        flight: checkoutData.flight,
        travelers: checkoutData.Traveler,
        totalAmount,
        currency: checkoutData.flight.currency || "GHS",
        status: "PENDING",
        paymentStatus: "PENDING",
        userId,
        contactInfo: checkoutData.contactInfo,
      });

      await checkout.save();

      // Prepare Hubtel payment request
      const hubtelRequest = {
        totalAmount: 1, //totalAmount,
        description: `Flight Booking - ${checkoutData.flight.from} to ${checkoutData.flight.to}`,
        callbackUrl:
          "https://api.melcomtravels.com/api/checkout/payment/callback", //`${process.env.BASE_URL}/api/checkout/payment/callback`,
        returnUrl: `${process.env.FRONTEND_URL}/booking-confirmation/${checkout._id}`,
        merchantAccountNumber: this.MERCHANT_ACCOUNT_NUMBER,
        cancellationUrl: `${process.env.FRONTEND_URL}/booking/cancelled/${checkout._id}`,
        clientReference: bookingReference,
        payeeName: (checkout.contactInfo?.name || "").trim(),
        payeeMobileNumber: (checkout.contactInfo?.phone || "").trim(),
        payeeEmail: (checkout.contactInfo?.email || "").trim(),
      };

      // Create Basic Auth header for Hubtel
      const authString = Buffer.from(
        `${this.HUBTEL_API_ID}:${this.HUBTEL_API_KEY}`
      ).toString("base64");

      // Make request to Hubtel
      const hubtelResponse = await axios.post(
        `${this.HUBTEL_API_BASE_URL}/items/initiate`,
        hubtelRequest,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${authString}`,
          },
        }
      );

      if (hubtelResponse.data.status !== "Success") {
        return res.status(500).json({
          success: false,
          message: "Failed to create checkout",
          error: hubtelResponse.data.message,
        });
      }
      const {checkoutUrl, checkoutId, clientReference, checkoutDirectUrl} =
        hubtelResponse.data.data;

      checkout.checkoutId = checkoutId;
      checkout.notes = `Hubtel Payment Initiated - Checkout ID: ${checkoutId} - Client Reference: ${clientReference} - Checkout URL: ${checkoutUrl} - Checkout Direct URL: ${checkoutDirectUrl}`;
      await checkout.save();

      // Update checkout with payment reference
      // await UserCheckout.findByIdAndUpdate(checkout._id, {
      //   checkoutId,
      //   notes: `Hubtel Payment Initiated - Checkout ID: ${checkoutId}`,
      // });

      console.log("hubtelResponse.data.checkoutUrl", hubtelResponse.data.data);

      console.log(checkoutId, checkoutUrl, bookingReference);
      const response: CheckoutResponseDTO = {
        checkoutId,
        checkoutUrl,
        bookingReference,
        status: "PENDING",
        message:
          "Checkout created successfully. Redirect user to checkoutUrl for payment.",
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
          Description,
        },
      } = req.body;

      console.log("Hubtel Payment Callback received:", req.body);
      // Update checkout based on payment status
      let checkoutStatus = "PENDING";
      let paymentStatus = "PENDING";
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

      if (ResponseCode === "0000" && Status === "Success") {
        console.log(
          "EARLY-Payment callback confirmed and completed successfully"
        );
        // Create GOL API reservation
        try {
          const golReservationResponse = await this.createGOLReservation(
            checkout
          );

          // Update checkout with GOL reservation ID
          await UserCheckout.findByIdAndUpdate(checkout._id, {
            status: checkoutStatus,
            paymentStatus: paymentStatus,
            transactionId: req.body.Data?.SalesInvoiceId,
            golReservationResponse,
            notes: `Payment - ${ResponseText} Completed Successfully`,
          });

          return res.status(200).json({
            success: true,
            message: "Payment callback processed successfully",
          });
        } catch (golError) {
          console.error("GOL reservation error:", golError);
          return res.status(500).json({
            success: false,
            message: "Failed to create GOL reservation",
          });
        }
      }

      // Perform status check with Hubtel using ClientReference

      try {
        const hubtelStatusCheck = await this.checkHubtelTransactionStatus(
          ClientReference
        );
        console.log("Hubtel status check result:", hubtelStatusCheck);
        if (
          hubtelStatusCheck?.responseCode === "0000" &&
          hubtelStatusCheck?.data?.status === "Paid"
        ) {
          checkoutStatus = "CONFIRMED";
          paymentStatus = "PAID";

          // Create GOL API reservation
          try {
            const golReservationResponse = await this.createGOLReservation(
              checkout
            );

            // Update checkout with GOL reservation ID
            await UserCheckout.findByIdAndUpdate(checkout._id, {
              status: checkoutStatus,
              paymentStatus: paymentStatus,
              transactionId: hubtelStatusCheck?.transactionId,
              golReservationResponse,
              notes: `Payment - ${ResponseText} Completed Successfully`,
            });

            return res.status(200).json({
              success: true,
              message: "Payment callback processed successfully",
            });
          } catch (golError) {
            console.error("GOL reservation error:", golError);
            return res.status(500).json({
              success: false,
              message: "Failed to create GOL reservation",
            });
          }
        }
      } catch (statusError) {
        console.error("Hubtel status check error:", statusError);
        return res.status(500).json({
          success: false,
          message: "Failed to check Hubtel transaction status",
          error: statusError.message,
        });
        // Continue with callback data if status check fails
      }
    } catch (error) {
      console.error("Payment callback error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process payment callback",
        error: error.message,
      });
    }
  }

  // Handle Hubtel payment callback
  static async testGOlBooking(req: Request, res: Response) {
    try {
      const bookingReference = req.params.bookingReference;
      console.log("bookingReference", bookingReference);
      // Find checkout by client reference (booking reference)
      const checkout = await UserCheckout.findOne({
        bookingReference: bookingReference,
      });

      if (!checkout) {
        console.error("Checkout not found for callback:", bookingReference);
        return res.status(404).json({
          success: false,
          message: "Checkout not found",
        });
      }

      // Create GOL API reservation
      try {
        const golReservationResponse = await this.createGOLReservation(
          checkout
        );

        console.log("golReservationResponse", golReservationResponse);

        return res.status(200).json({
          success: true,
          message: "GOL booking created successfully",
          // data: golReservationResponse,
          checkout,
        });
      } catch (golError) {
        console.error("GOL reservation error:", golError);
        return res.status(500).json({
          success: false,
          message: "Failed to create GOL reservation",
        });
      }
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
  private static async checkHubtelTransactionStatus(
    clientReference: string
  ): Promise<any> {
    try {
      const authString = Buffer.from(
        `${this.HUBTEL_API_ID}:${this.HUBTEL_API_KEY}`
      ).toString("base64");

      // First, we need to get the transaction ID from the client reference
      // This might require a different endpoint or we might need to use the checkout ID
      // For now, let's try to get status using the client reference
      const statusResponse = await axios.get(
        `https://api-txnstatus.hubtel.com/transactions/${process.env.HUBTEL_MERCHANT_ACCOUNT_NUMBER}/status?clientReference=${clientReference}`,
        {
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Hubtel status check response:", statusResponse.data);
      return statusResponse.data;
    } catch (error) {
      console.error(
        "Hubtel status check error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Create GOL API reservation
  private static async createGOLReservation(checkout: any): Promise<string> {
    try {
      // Get selected price reference from checkout (assuming it's stored in flight.prices or flight.selectedPrice)
      const priceReference = checkout.flight?.bookingReference || "";
      console.log("createGOLReservation-priceReference", priceReference);
      const priceAmount = checkout.totalAmount || checkout.flight?.price || "0";

      // Parse phone number to extract country code and number
      const phone = checkout.contactInfo.phone || "";
      let phoneCountryCode = "+233";
      let phoneNumber = phone;

      // Try to extract country code (format: +233, +1, etc.)
      if (phone.startsWith("+")) {
        const match = phone.match(/^\+(\d{1,4})(.*)$/);
        if (match) {
          phoneCountryCode = `+${match[1]}`;
          phoneNumber = match[2].replace(/\D/g, ""); // Remove non-digits
        } else {
          phoneNumber = phone.replace(/^\+/, "").replace(/\D/g, "");
        }
      } else {
        // If no +, assume it's already formatted
        phoneNumber = phone.replace(/\D/g, "");
        // Default to Ghana (+233) if no country code
        if (!phoneNumber.startsWith("233") && phoneNumber.length > 9) {
          phoneCountryCode = "+233";
        }
      }

      // Build passenger parameters
      const passengerParameters = checkout.travelers.map(
        (traveler: any, index: number) => ({
          Code: "passenger",
          Index: index.toString(),
          AdditionalInfo: {
            Info: [
              {
                Code: "passengerType",
                $t: traveler.PassengerType || "ADT",
              },
            ],
          },
          ParameterGroup: {
            Code: "passengerPerson",
            ParameterElement:
              traveler.PassengerType === "INF"
                ? [
                    {Name: "passenger_title", $t: traveler.NamePrefix || "MR"},
                    {
                      Name: "passenger_firstname",
                      $t: traveler.GivenName || "",
                      Format: "ascii_alphabet",
                    },
                    {
                      Name: "passenger_lastname",
                      $t: traveler.Surname || "",
                      Format: "ascii_alphabet",
                    },
                    {
                      Name: "passenger_birth_date",
                      $t: traveler.BirthDate || "",
                      Format: "date",
                    },
                  ]
                : [
                    {Name: "passenger_title", $t: traveler.NamePrefix || "MR"},
                    {
                      Name: "passenger_firstname",
                      $t: traveler.GivenName || "",
                      Format: "ascii_alphabet",
                    },
                    {
                      Name: "passenger_lastname",
                      $t: traveler.Surname || "",
                      Format: "ascii_alphabet",
                    }
                  ],
          },
        })
      );

      // Build contact parameters
      const contactName = checkout.contactInfo.name.trim();

      const contactEmail = checkout.contactInfo.email.trim();

      // Prepare GOL API reservation request matching the curl structure
      const golRequest = {
        GolApi: {
          PassiveSessionId: this.GOL_PASSIVE_SESSION_ID,
          Authorization: {
            Requestor: {
              ClientId: this.GOL_CLIENT_ID,
              Password: this.GOL_PASSWORD,
            },
            // UserToken can be added here if available from session
          },
          Settings: {
            Localization: {
              Language: "en",
              Country: "CZ",
            },
          },
          RequestDetail: {
            BookReservationsRequest_3: {
              TicketingCombination: {
                TicketplaceOption: {
                  Id: "781",
                  Rate: "0",
                  RatedFor: "abs",
                  Price: "0",
                },
                PaymentformOption: {
                  Id: "2473",
                  Rate: "0",
                  RatedFor: "abs",
                  Price: "0",
                },
              },
              BookReservationsWithParameters: {
                BookReservationWithParameters: {
                  ExternalReservationId: checkout.bookingReference,
                  PricedReference: {
                    Price: priceAmount.toString(),
                    Reference: [
                      {
                        $t: priceReference,
                      },
                    ],
                  },
                  Parameters: {
                    ParameterGroup: [
                      // Passengers
                      {
                        Code: "passengers",
                        ParameterGroup:
                          passengerParameters.length > 1
                            ? passengerParameters
                            : passengerParameters[0],
                      },
                      // Contact
                      {
                        Code: "contact",
                        ParameterGroup: [
                          {
                            Code: "elements",
                            ParameterElement: {
                              Name: "contact_name",
                              $t: contactName,
                            },
                          },
                          {
                            Code: "telephone",
                            ParameterElement: [
                              {
                                Name: "contact_phone_country",
                                $t: phoneCountryCode,
                                Format: "country_calling_code",
                              },
                              {
                                Name: "contact_phone_number",
                                $t: phoneNumber,
                                Format: "number",
                              },
                            ],
                          },
                          {
                            Code: "elements",
                            ParameterElement: {
                              Name: "contact_email",
                              $t: contactEmail || "",
                              Format: "email",
                            },
                          },
                        ],
                      },
                      // Company/Billing (optional)
                      {
                        Code: "company",
                        ParameterGroup: {
                          Code: "billing",
                          ParameterElement: [
                            {Name: "company_billing_company", $t: ""},
                            {
                              Name: "company_billing_id",
                              $t: "",
                              Format: "alphanumeric",
                            },
                            {
                              Name: "company_billing_tax_id",
                              $t: "",
                              Format: "alphanumeric",
                            },
                            {Name: "company_billing_street", $t: ""},
                            {Name: "company_billing_city", $t: ""},
                            {Name: "company_billing_zipcode", $t: ""},
                            {
                              Name: "company_billing_country",
                              $t: checkout.currency === "GHS" ? "GH" : "CZ",
                            },
                          ],
                        },
                      },
                      // Other remarks
                      {
                        Code: "other",
                        ParameterElement: {
                          Name: "other_remark",
                          $t: checkout.notes || "",
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      };
      // store the golRequest in a file
      fs.writeFileSync("golRequest.json", JSON.stringify(golRequest, null, 2));
 
      console.log("THIS.GOL_API_BASE_URL", this.GOL_API_BASE_URL);
      // Make request to GOL API
      const golResponse = await axios.post(this.GOL_API_BASE_URL, golRequest, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
 
      // Extract reservation ID from response
      const golData = golResponse.data.GolApi.ResponseDetail;

      // console.log("golResponse3 updated", golData.SystemRequestError_1.Error);
      fs.writeFileSync("golResponse.json", JSON.stringify(golData, null, 2));
      if (golData?.BookReservationsResponse_3?.BookedReservations) {
        const reservation = golData?.BookedReservations?.BookedReservation[0];
        console.log("reservation", reservation);
        const reservationId = reservation?.ReservationId || null;
        return reservationId;
      } else if (
        golData?.BookReservationsError_3?.ErrorWithDetails?.ErrorMessage
      ) {
        console.log(
          "golData?.ErrorMessage",
          golData?.BookReservationsError_3?.ErrorWithDetails?.ErrorMessage
        );
        console.log(
          "golData?.ErrorDetails",
          golData?.BookReservationsError_3?.ErrorWithDetails?.ErrorDetails
        );
        throw new Error(
          golData?.BookReservationsError_3?.ErrorWithDetails?.ErrorMessage
        );
      } else if (golData?.BookReservationsError_3?.SystemRequestError_1) {
        console.log(
          "golData?.ErrorDetails",
          golData?.BookReservationsError_3?.SystemRequestError_1?.Error[0]
        );
        throw new Error(
          golData?.BookReservationsError_3?.SystemRequestError_1?.Error
        );
      } else {
        throw new Error("Failed internally and from GOL API response");
      }
    } catch (error) {
      console.error("GOL reservation creation error:", error);
      throw new Error(
        `GOL reservation failed: ${error.response?.data || error.message}`
      );
      return null;
    }
  }

  // Check payment status
  static async checkPaymentStatus(req: Request, res: Response) {
    try {
      const {checkoutId} = req.params;

      const checkout = await UserCheckout.findById(checkoutId);

      if (!checkout) {
        return res.status(404).json({
          success: false,
          message: "Checkout not found",
        });
      }

      // If payment is pending, check with Hubtel using ClientReference
      if (checkout.paymentStatus === "PENDING" && checkout.bookingReference) {
        try {
          const hubtelStatusCheck = await this.checkHubtelTransactionStatus(
            checkout.bookingReference
          );
          console.log("Manual status check result:", hubtelStatusCheck);

          // Update status based on Hubtel response
          if (
            hubtelStatusCheck?.responseCode === "0000" &&
            hubtelStatusCheck?.data?.status === "Paid"
          ) {
            // Create GOL API reservation
            try {
              const golReservationResponse = await this.createGOLReservation(
                checkout
              );

              // Update checkout with GOL reservation ID
              await UserCheckout.findByIdAndUpdate(checkout._id, {
                status: "CONFIRMED",
                paymentStatus: "PAID",
                transactionId: hubtelStatusCheck?.transactionId,
                golReservationResponse,
                notes: `Payment  Completed Successfully`,
              });

              return res.status(200).json({
                success: true,
                message: "Payment status updated successfully",
              });
            } catch (golError) {
              console.error("GOL reservation error:", golError);
              return res.status(500).json({
                success: false,
                message: "Failed to create GOL reservation",
              });
            }
          } else if (
            hubtelStatusCheck?.status === "Failed" ||
            hubtelStatusCheck?.status === "Cancelled"
          ) {
            await UserCheckout.findByIdAndUpdate(checkoutId, {
              status: "FAILED",
              paymentStatus: "FAILED",
              transactionId: hubtelStatusCheck.transactionId,
              notes: `Status updated via manual check - ${hubtelStatusCheck.status} - Transaction ID: ${hubtelStatusCheck.transactionId}`,
            });
          }
        } catch (hubtelError) {
          console.error("Hubtel status check error:", hubtelError.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment status retrieved successfully",
        data: checkout,
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
      const {page = 1, limit = 10} = req.query;
      const query = userId ? {userId} : {};

      const skip = (Number(page) - 1) * Number(limit);
      const total = await UserCheckout.countDocuments(query);

      const checkouts = await UserCheckout.find(query)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        message: "Checkouts retrieved successfully",
        data: checkouts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve checkouts",
        error: error.message,
      });
    }
  }

  // Get all checkouts for admin (admin only)
  static async getAllCheckoutsForAdmin(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        paymentStatus,
        startDate,
        endDate,
      } = req.query;
      const filter: any = {};

      if (status) filter.status = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;

      // Date range filtering
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          // Set to end of day for inclusive end date
          const endDateObj = new Date(endDate as string);
          endDateObj.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = endDateObj;
        }
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await UserCheckout.countDocuments(filter);

      const checkouts = await UserCheckout.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        message: "All checkouts retrieved successfully",
        data: checkouts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve checkouts",
        error: error.message,
      });
    }
  }

  // Get checkouts by user ID (admin only)
  static async getCheckoutsByUserId(req: Request, res: Response) {
    try {
      const {userId} = req.params;
      const {
        page = 1,
        limit = 10,
        status,
        paymentStatus,
        startDate,
        endDate,
      } = req.query;

      const filter: any = {userId};
      if (status) filter.status = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;

      // Date range filtering
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          // Set to end of day for inclusive end date
          const endDateObj = new Date(endDate as string);
          endDateObj.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = endDateObj;
        }
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await UserCheckout.countDocuments(filter);

      const checkouts = await UserCheckout.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        message: `Checkouts for user ${userId} retrieved successfully`,
        data: checkouts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve checkouts",
        error: error.message,
      });
    }
  }

  // Update checkout status (admin only)
  static async updateCheckoutStatus(req: Request, res: Response) {
    try {
      const {checkoutId} = req.params;
      const {status, paymentStatus, notes} = req.body;

      // Validate that at least one field is provided
      if (!status && !paymentStatus && !notes) {
        return res.status(400).json({
          success: false,
          message:
            "At least one field (status, paymentStatus, or notes) must be provided",
        });
      }

      // Validate status enum if provided
      const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "FAILED"];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }

      // Validate paymentStatus enum if provided
      const validPaymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
      if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(
            ", "
          )}`,
        });
      }

      // Build update payload
      const updatePayload: any = {};
      if (status) updatePayload.status = status;
      if (paymentStatus) updatePayload.paymentStatus = paymentStatus;
      if (notes !== undefined) {
        updatePayload.notes = notes;
      }

      // Find and update checkout
      const checkout = await UserCheckout.findByIdAndUpdate(
        checkoutId,
        updatePayload,
        {new: true}
      );

      if (!checkout) {
        return res.status(404).json({
          success: false,
          message: "Checkout not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Checkout status updated successfully",
        data: checkout,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update checkout status",
        error: error.message,
      });
    }
  }

  // Get checkout analytics (admin only)
  static async getCheckoutAnalytics(req: Request, res: Response) {
    try {
      const {startDate, endDate} = req.query;

      // Build date filter
      const dateFilter: any = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) {
          dateFilter.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          // Set to end of day for inclusive end date
          const endDateObj = new Date(endDate as string);
          endDateObj.setHours(23, 59, 59, 999);
          dateFilter.createdAt.$lte = endDateObj;
        }
      }

      // Total bookings
      const totalBookings = await UserCheckout.countDocuments(dateFilter);

      // Paid bookings (paymentStatus = 'PAID')
      const paidBookingsFilter = {...dateFilter, paymentStatus: "PAID"};
      const paidBookings = await UserCheckout.countDocuments(
        paidBookingsFilter
      );

      // Pending bookings (status = 'PENDING' OR paymentStatus = 'PENDING')
      const pendingBookingsFilter = {
        ...dateFilter,
        $or: [{status: "PENDING"}, {paymentStatus: "PENDING"}],
      };
      const pendingBookings = await UserCheckout.countDocuments(
        pendingBookingsFilter
      );

      // Revenue (sum of totalAmount where paymentStatus = 'PAID')
      const revenueResult = await UserCheckout.aggregate([
        {$match: paidBookingsFilter},
        {
          $group: {
            _id: "$currency",
            total: {$sum: "$totalAmount"},
          },
        },
      ]);

      // Calculate revenue by currency
      const revenue: any = {};
      revenueResult.forEach((item: any) => {
        revenue[item._id] = item.total;
      });

      // Get total revenue (sum all currencies)
      const totalRevenue = revenueResult.reduce(
        (sum: number, item: any) => sum + item.total,
        0
      );

      // Get default currency (most common currency or GHS)
      const defaultCurrency =
        revenueResult.length > 0 ? revenueResult[0]._id : "GHS";

      return res.status(200).json({
        success: true,
        message: "Checkout analytics retrieved successfully",
        data: {
          totalBookings,
          paidBookings,
          pendingBookings,
          revenue: {
            total: totalRevenue,
            byCurrency: revenue,
            currency: defaultCurrency,
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve checkout analytics",
        error: error.message,
      });
    }
  }
}
