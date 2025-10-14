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

      const golData = response.data.GolApi;
      const specialOffers = golData.ResponseDetail?.ListSpecialoffersResponse_1?.ListSpecialoffers?.SpecialofferItem || [];
      
      // Transform deals to user-friendly format
      const deals = specialOffers.map(offer => {
        const step = offer.SpecialOfferSteps?.SpecialOfferStep?.[0] || {};
        return {
          id: offer.SpecialOfferId,
          type: offer.Type,
          airline: {
            code: offer.MarketingAirline,
            name: golData.CodeBook?.TransportCompanies?.TransportCompany?.find(
              airline => airline.Code === offer.MarketingAirline
            )?.Name?.$t || offer.MarketingAirline,
            logo: golData.CodeBook?.TransportCompanies?.TransportCompany?.find(
              airline => airline.Code === offer.MarketingAirline
            )?.LogoUrl?.$t
          },
          route: {
            from: {
              code: step.Origin,
              name: golData.CodeBook?.Airports?.Airport?.find(
                airport => airport.Code === step.Origin
              )?.$t || step.Origin
            },
            to: {
              code: step.Destination,
              name: golData.CodeBook?.Airports?.Airport?.find(
                airport => airport.Code === step.Destination
              )?.$t || step.Destination
            }
          },
          price: {
            amount: offer.SummaryPrice?.FullPrice || "0",
            currency: golData.Settings?.Currency?.Code || "GHS",
            formatted: `${offer.SummaryPrice?.FullPrice || "0"} ${golData.Settings?.Currency?.Code || "GHS"}`
          },
          validPeriod: {
            from: step.DateRange?.DateFrom,
            to: step.DateRange?.DateTo
          },
          savings: "Special offer pricing" // Can be enhanced with actual savings calculation
        };
      });

      // Filter by category if provided
      let filteredDeals = deals;
      if (category && typeof category === 'string') {
        filteredDeals = deals.filter(deal => 
          deal.type.toLowerCase().includes(category.toLowerCase()) ||
          deal.airline.name.toLowerCase().includes(category.toLowerCase())
        );
      }

      return res.status(200).json({
        success: true,
        message: "Flight deals retrieved successfully",
        summary: {
          totalDeals: filteredDeals.length,
          currency: golData.Settings?.Currency?.Code || "GHS",
          filterApplied: category || null
        },
        deals: filteredDeals
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

      // Transform GOL API response to user-friendly format
      const golData = response.data.GolApi;
      const flightOffers = golData.ResponseDetail?.SearchFlightsExtendedResponse_2?.FlightOffers || [];
      
      // Format flight results
      const flights = [];
      
      flightOffers.forEach(offerGroup => {
        if (offerGroup.FlightOffer && Array.isArray(offerGroup.FlightOffer)) {
          offerGroup.FlightOffer.forEach(offer => {
            // Extract pricing information - simplified
            const pricingDetails = offer.PricingDetails?.PricingDetail || [];
            const bestPrice = pricingDetails.length > 0 ? pricingDetails[0] : null;
            
            // Extract flight segments - simplified
            const flightStreams = offer.FlightItinerary?.FlightStream || [];
            const segments = [];
            
            flightStreams.forEach(stream => {
              const options = stream.FlightOption || [];
              options.forEach(option => {
                const flightSegments = option.FlightSegments?.FlightSegment || [];
                flightSegments.forEach(segment => {
                  segments.push({
                    flightNumber: segment.FlightNumber,
                    airline: {
                      code: segment.MarketingAirline,
                      name: golData.CodeBook?.TransportCompanies?.TransportCompany?.find(
                        airline => airline.Code === segment.MarketingAirline
                      )?.Name?.$t || segment.MarketingAirline
                    },
                    aircraft: segment.PlaneType,
                    departure: {
                      airport: segment.OriginAirport,
                      time: segment.DepartureDateTime,
                      terminal: segment.DepartureTerminal
                    },
                    arrival: {
                      airport: segment.DestinationAirport,
                      time: segment.ArrivalDateTime,
                      terminal: segment.ArrivalTerminal
                    },
                    duration: segment.JourneyDuration,
                    cabinClass: segment.CabinClass
                  });
                });
              });
            });

            // Only add flights with valid pricing
            if (bestPrice) {
              flights.push({
                price: {
                  total: bestPrice.FlightPricing?.FlightPrice?.FullPrice || "0",
                  perPassenger: bestPrice.FlightPricing?.FlightPrice?.DisplayPricePerPassenger || "0",
                  currency: golData.Settings?.Currency?.Code || "GHS"
                },
                segments: segments,
                bookingReference: bestPrice.Key,
                airline: segments[0]?.airline?.name || "Unknown"
              });
            }
          });
        }
      });

      // Get airport information for context
      const airports = golData.CodeBook?.Airports?.Airport || [];
      const airlines = golData.CodeBook?.TransportCompanies?.TransportCompany || [];

      return res.status(200).json({
        success: true,
        message: `${flightType} flight search completed successfully`,
        searchInfo: {
          searchType: flightType,
          route: flightType === "multicity" 
            ? `${origin} → ${destinations}` 
            : `${origin} → ${destination}`,
          departureDate,
          returnDate,
          passengers
        },
        results: {
          totalFlights: flights.length,
          currency: golData.Settings?.Currency?.Code || "GHS",
          flights: flights
        }
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

      const golData = response.data.GolApi;
      
      // Get the airport data from CodeBook
      const airportData = golData.CodeBook?.Airports?.Airport || [];
      
      // Get the search results
      const searchedAirports = golData.ResponseDetail?.SearchDestinationsResponse_1?.SearchedAirports?.SearchedAirport || [];
      
      // Transform airports to user-friendly format
      const airports = [];
      
      searchedAirports.forEach(searchResult => {
        // Find the corresponding airport details from CodeBook
        const airportDetails = airportData.find(airport => airport.Code === searchResult.Destination);
        
        if (airportDetails && searchResult.ShowCode === "true") {
          airports.push({
            code: airportDetails.Code,
            name: airportDetails.$t,
            country: {
              code: airportDetails.Country,
              name: airportDetails.Country // Could be enhanced with full country names
            },
            state: airportDetails.State || null,
            category: airportDetails.Category?.toLowerCase() || "airport",
            parent: airportDetails.Parent || null
          });
        }
      });

      return res.status(200).json({
        success: true,
        message: "Airports retrieved successfully",
        searchInfo: {
          query: searchTerm,
          totalResults: airports.length
        },
        airports: airports
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
