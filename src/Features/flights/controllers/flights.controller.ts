import { Request, Response } from "express";
import axios from "axios";
import {
  PassengerTypeEnum,
  CabinClassEnum,
  TripTypeEnum,
  FlightPreferenceEnum,
} from "../enums";
import { FlightSearchDTO, GOLSearchRequestDTO } from "../dto/flights.dto";

export class FlightsController {
  private static GOL_API_BASE_URL =
    process.env.GOL_API_BASE_URL || "https://golapi.golibe.com/json.php";
  private static GOL_CLIENT_ID = process.env.GOL_CLIENT_ID;
  private static GOL_PASSWORD = process.env.GOL_PASSWORD;
  private static GOL_PASSIVE_SESSION_ID = process.env.GOL_PASSIVE_SESSION_ID;

  // Helper method to create GOL API request structure
  private static createGolRequest(requestDetail: any) {
    return {
      GolApi: {
        PassiveSessionId: this.GOL_PASSIVE_SESSION_ID,
        Authorization: {
          Requestor: {
            ClientId: this.GOL_CLIENT_ID,
            Password: this.GOL_PASSWORD,
          },
        },
        Settings: {
          Localization: {
            Language: "en",
            Country: "CZ",
          },
        },
        RequestDetail: requestDetail,
      },
    };
  }

  // ===== FLIGHT DEALS ENDPOINTS =====

  // Get flight deals with optional category filter
  static async getFlightDeals(req: Request, res: Response) {
    try {
      const { category } = req.query;

      // Use the exact GOL API structure for flight deals
      const golRequest = {
        GolApi: {
          PassiveSessionId: this.GOL_PASSIVE_SESSION_ID,
          Authorization: {
            Requestor: {
              ClientId: this.GOL_CLIENT_ID,
              Password: this.GOL_PASSWORD,
            },
          },
          Settings: {
            Localization: {
              Language: "en",
              Country: "CZ",
            },
          },
          RequestDetail: {
            ListSpecialoffersRequest_1: {
              SpecialofferTypes: {
                SpecialofferType: {
                  Code: "flight",
                },
              },
            },
          },
        },
      };

      const response = await axios.post(this.GOL_API_BASE_URL, golRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      let deals = response.data;

      // Filter by category if provided
      if (
        category &&
        deals?.GolApi?.ResponseDetail?.ListSpecialoffersResponse_1
          ?.Specialoffers
      ) {
        // Apply category filter logic here based on GOL API response structure
      }

      return res.status(200).json({
        success: true,
        message: "Flight deals retrieved successfully",
        data: deals,
        filters: { category },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve flight deals",
        error: error.response?.data || error.message,
      });
    }
  }

  // Get flight deal by ID
  static async getFlightDealById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      return res.status(501).json({
        success: false,
        message: `Get flight deal by ID: ${id} - logic to be implemented`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "System error",
        error: error.message,
      });
    }
  }

  // Get flight deals categories
  static async getFlightDealsCategories(req: Request, res: Response) {
    try {
      // Return predefined categories based on GOL API capabilities
      const categories = [
        {
          code: "domestic",
          name: "Domestic Flights",
          description: "Flights within the country",
        },
        {
          code: "international",
          name: "International Flights",
          description: "Flights to international destinations",
        },
        {
          code: "weekend",
          name: "Weekend Getaways",
          description: "Short weekend trips",
        },
        {
          code: "holiday",
          name: "Holiday Packages",
          description: "Special holiday destinations",
        },
        {
          code: "business",
          name: "Business Travel",
          description: "Business class and premium deals",
        },
      ];

      return res.status(200).json({
        success: true,
        message: "Flight deals categories retrieved successfully",
        data: { categories },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "System error",
        error: error.message,
      });
    }
  }

  // ===== FLIGHT SEARCH ENDPOINTS =====

  // Search flights - handles one-way, return, and multi-city
  static async searchFlights(req: Request, res: Response) {
    try {
      // Get parameters from request body for POST requests or query for GET requests
      const params = req.method === "POST" ? req.body : req.query;

      const {
        origin,
        destination,
        departureDate,
        returnDate,
        passengers = "ADT",
        type = "one-way",
        tripType, // Alternative name for type
        // Multi-city parameters
        destinations, // comma-separated: "HSH,ACC,LHR"
        departureDates, // comma-separated: "2025-10-31,2025-11-29,2025-12-15"
      } = params;

      // Handle tripType parameter (used in body) vs type (used in query)
      const flightType = tripType || type;

      // Build flight steps based on search type
      let flightSteps = [];

      if (flightType === "multi-city" || flightType === "multicity") {
        // Multi-city flight validation
        if (!origin || !destinations || !departureDates) {
          return res.status(400).json({
            success: false,
            message:
              "For multi-city flights: origin, destinations, and departureDates are required",
          });
        }

        const destinationArray = destinations.toString().split(",");
        const dateArray = departureDates.toString().split(",");

        if (destinationArray.length !== dateArray.length) {
          return res.status(400).json({
            success: false,
            message:
              "Number of destinations must match number of departure dates",
          });
        }

        // First leg: Origin with "+" to first destination
        flightSteps.push({
          Origin: origin + "+",
          Destination: destinationArray[0],
          DepartureDateTime: dateArray[0],
        });

        // Subsequent legs: Previous destination (no "+") to next destination
        for (let i = 1; i < destinationArray.length; i++) {
          flightSteps.push({
            Origin: destinationArray[i - 1], // Previous destination, no "+"
            Destination: destinationArray[i],
            DepartureDateTime: dateArray[i],
          });
        }
      } else {
        // One-way and Return flights validation
        if (!origin || !destination || !departureDate) {
          return res.status(400).json({
            success: false,
            message: "Origin, destination, and departure date are required",
          });
        }

        // One-way flight (default)
        flightSteps.push({
          Origin: origin,
          Destination: destination,
          DepartureDateTime: departureDate,
        });

        // Return flight - add return leg if returnDate is provided
        if (
          (flightType === "return" || flightType === "round-trip") &&
          returnDate
        ) {
          flightSteps.push({
            Origin: destination,
            Destination: origin,
            DepartureDateTime: returnDate,
          });
        }
      }

      // Build passenger array - can be extended for multiple passenger types
      const searchedPassengers = [{ Code: passengers }];

      // Use the exact GOL API structure for flight search
      const golRequest = {
        GolApi: {
          PassiveSessionId: this.GOL_PASSIVE_SESSION_ID,
          Authorization: {
            Requestor: {
              ClientId: this.GOL_CLIENT_ID,
              Password: this.GOL_PASSWORD,
            },
          },
          Settings: {
            Localization: {
              Language: "en",
              Country: "CZ",
            },
          },
          RequestDetail: {
            SearchFlightsExtendedRequest_2: {
              FlightSteps: {
                FlightStep: flightSteps,
              },
              SearchedPassengers: {
                SearchedPassenger: searchedPassengers,
              },
              FlightPreferences: {
                IncludeCombinedFlights: {},
              },
            },
          },
        },
      };

      const response = await axios.post(this.GOL_API_BASE_URL, golRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.status(200).json({
        success: true,
        message: `${flightType} flight search completed successfully`,
        data: response.data,
        search_params: {
          type: flightType,
          origin,
          destination,
          departureDate,
          returnDate,
          destinations,
          departureDates,
          passengers,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to search flights",
        error: error.response?.data || error.message,
      });
    }
  }

  // ===== BOOKING ENDPOINTS =====

  // Create a new flight booking
  static async createFlightBooking(req: Request, res: Response) {
    try {
      return res.status(501).json({
        success: false,
        message: "Create flight booking endpoint - logic to be implemented",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "System error",
        error: error.message,
      });
    }
  }

  // Get flight booking by ID
  static async getFlightBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      return res.status(501).json({
        success: false,
        message: `Get flight booking by ID: ${id} - logic to be implemented`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "System error",
        error: error.message,
      });
    }
  }

  // ===== UTILITY ENDPOINTS =====

  // Get airports/destinations
  static async getAirports(req: Request, res: Response) {
    try {
      const { search, country } = req.query;
      const searchTerm = search || country;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: "Search term or country is required",
        });
      }

      // Use the exact GOL API structure for searching destinations
      const golRequest = {
        GolApi: {
          PassiveSessionId: this.GOL_PASSIVE_SESSION_ID,
          Authorization: {
            Requestor: {
              ClientId: this.GOL_CLIENT_ID,
              Password: this.GOL_PASSWORD,
            },
          },
          Settings: {
            Localization: {
              Language: "en",
              Country: "CZ",
            },
          },
          RequestDetail: {
            SearchDestinationsRequest_1: {
              SearchPattern: {
                $t: searchTerm,
                SearchType: "flight",
              },
            },
          },
        },
      };

      const response = await axios.post(this.GOL_API_BASE_URL, golRequest, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Airports retrieved successfully",
        data: response.data,
        search_term: searchTerm,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve airports",
        error: error.response?.data || error.message,
      });
    }
  }
}
