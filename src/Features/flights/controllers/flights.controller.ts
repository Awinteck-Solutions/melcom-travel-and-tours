import { Request, Response } from "express";
import axios from "axios";
import {
  SearchFlightsRequestDto,
  SearchDestinationsRequestDto,
  FlightDealsRequestDto,
  MultiCityFlightRequestDto,
  FlightBookingRequestDto,
  FlexibleGolApiRequestDto,
  FlexibleFlightSearchDto,
} from "../dto/flights.dto";
import { FlightType } from "../enums/flights.enum";

export class FlightsController {
  private static readonly apiUrl = `${process.env.GOL_API_BASE_URL}/json.php`;

  // Helper method to create base GOL API structure with maximum flexibility
  private static createBaseGolApiPayload(
    language: string = "en",
    country: string = "CZ",
    currency: string = "GHS",
    passiveSessionId: string = "116417370"
  ): any {
    return {
      GolApi: {
        PassiveSessionId: passiveSessionId,
        Authorization: {
          Requestor: {
            ClientId: process.env.GOL_API_CLIENT_ID || "melcom.golibe.com",
            Password: process.env.GOL_API_PASSWORD || "jd532aeeA4bc",
          },
        },
        Settings: {
          Localization: {
            Language: language.toLowerCase(),
            Country: country.toUpperCase(),
            // Currency removed due to DTD validation error
          },
        },
      },
    };
  }

  // POST /flexible-search - Generic flexible search endpoint that accepts any GOL API request structure
  static async flexibleSearch(req: Request, res: Response) {
    try {
      const {
        language = "en",
        country = "GH",
        currency = "GHS",
        passiveSessionId,
        requestDetail,
        searchType = "destinations", // destinations, flights, deals, etc.
      } = req.body;

      const payload = this.createBaseGolApiPayload(
        language,
        country,
        currency,
        passiveSessionId
      );

      // Allow complete flexibility in request structure
      if (requestDetail) {
        payload.GolApi.RequestDetail = requestDetail;
      } else {
        // Default behavior based on search type
        switch (searchType) {
          case "destinations":
            payload.GolApi.RequestDetail = {
              SearchDestinationsRequest_1: {
                SearchPattern: {
                  $t: req.body.query || "Accra",
                  SearchType: "flight",
                },
              },
            };
            break;
          case "flights":
            payload.GolApi.RequestDetail = {
              SearchFlightsRequest_1: {
                Travelers: req.body.travelers || [
                  { Code: "ADT", Quantity: "1" },
                ],
                TripType: req.body.tripType || "ONEWAY",
                TripRequests: req.body.tripRequests || [],
                CabinType: req.body.cabinType || "ECO",
              },
            };
            break;
          case "deals":
            payload.GolApi.RequestDetail = {
              ListSpecialoffersRequest_1: {
                SpecialofferTypes: {
                  SpecialofferType: {
                    Code: req.body.offerType || "flight",
                  },
                },
                MaxResults: req.body.maxResults || 50,
              },
            };
            break;
          default:
            return res.status(400).json({
              status: false,
              message:
                "Invalid search type. Use 'destinations', 'flights', or 'deals', or provide custom requestDetail.",
            });
        }
      }

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: `${
            searchType.charAt(0).toUpperCase() + searchType.slice(1)
          } search completed successfully`,
          data: response.data,
          requestPayload: payload, // Include the payload for debugging/transparency
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: `Error performing ${searchType} search`,
          error: error.response?.data || error.message,
          requestPayload: payload, // Include the payload for debugging
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing flexible search request",
        error: error.message,
      });
    }
  }

  // POST /search-destinations-exact - Uses your exact payload structure for destination search
  static async searchDestinationsExact(req: Request, res: Response) {
    try {
      const {
        query = "Los Angel",
        language = "en",
        country = "CZ",
        searchType = "flight",
        passiveSessionId = "116417370",
        clientId = "melcom.golibe.com",
        password = "jd532aeeA4bc",
      } = req.body;

      // Your exact payload structure
      const payload = {
        GolApi: {
          PassiveSessionId: passiveSessionId,
          Authorization: {
            Requestor: {
              ClientId: clientId,
              Password: password,
            },
          },
          Settings: {
            Localization: {
              Language: language,
              Country: country,
            },
          },
          RequestDetail: {
            SearchDestinationsRequest_1: {
              SearchPattern: {
                $t: query,
                SearchType: searchType,
              },
            },
          },
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Destinations search completed successfully",
          data: response.data,
          requestPayload: payload,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching destinations",
          error: error.response?.data || error.message,
          requestPayload: payload,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing destination search request",
        error: error.message,
      });
    }
  }

  // POST /search-flights-oneway - Uses your exact structure for one-way flight search
  static async searchFlightsOneWay(req: Request, res: Response) {
    try {
      const {
        origin,
        destination,
        departureDate,
        travelers = [{ Code: "ADT", Quantity: "1" }],
        cabinType = "ECO",
        language = "en",
        country = "CZ",
        currency = "GHS",
        passiveSessionId = "116417370",
        clientId = "melcom.golibe.com",
        password = "jd532aeeA4bc",
      } = req.body;

      const payload = {
        GolApi: {
          PassiveSessionId: passiveSessionId,
          Authorization: {
            Requestor: {
              ClientId: clientId,
              Password: password,
            },
          },
          Settings: {
            Localization: {
              Language: language,
              Country: country,
            },
          },
          RequestDetail: {
            SearchFlightsExtendedRequest_2: {
              FlightSteps: {
                FlightStep: [
                  {
                    Origin: origin,
                    Destination: destination,
                    DepartureDateTime: departureDate,
                  },
                ],
              },
              SearchedPassengers: {
                SearchedPassenger: travelers.map((traveler) => ({
                  Code: traveler.Code,
                })),
              },
              FlightPreferences: {
                IncludeCombinedFlights: {},
              },
            },
          },
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "One-way flight search completed successfully",
          data: response.data,
          requestPayload: payload,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching one-way flights",
          error: error.response?.data || error.message,
          requestPayload: payload,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing one-way flight search request",
        error: error.message,
      });
    }
  }

  // POST /search-flights-roundtrip - Uses your exact structure for round-trip flight search
  static async searchFlightsRoundTrip(req: Request, res: Response) {
    try {
      const {
        origin,
        destination,
        departureDate,
        returnDate,
        travelers = [{ Code: "ADT", Quantity: "1" }],
        cabinType = "ECO",
        language = "en",
        country = "CZ",
        currency = "GHS",
        passiveSessionId = "116417370",
        clientId = "melcom.golibe.com",
        password = "jd532aeeA4bc",
      } = req.body;

      const payload = {
        GolApi: {
          PassiveSessionId: passiveSessionId,
          Authorization: {
            Requestor: {
              ClientId: clientId,
              Password: password,
            },
          },
          Settings: {
            Localization: {
              Language: language,
              Country: country,
            },
          },
          RequestDetail: {
            SearchFlightsExtendedRequest_2: {
              FlightSteps: {
                FlightStep: [
                  {
                    Origin: origin,
                    Destination: destination,
                    DepartureDateTime: departureDate,
                  },
                  {
                    Origin: destination,
                    Destination: origin,
                    DepartureDateTime: returnDate,
                  },
                ],
              },
              SearchedPassengers: {
                SearchedPassenger: travelers.map((traveler) => ({
                  Code: traveler.Code,
                })),
              },
              FlightPreferences: {
                IncludeCombinedFlights: {},
              },
            },
          },
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Round-trip flight search completed successfully",
          data: response.data,
          requestPayload: payload,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching round-trip flights",
          error: error.response?.data || error.message,
          requestPayload: payload,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing round-trip flight search request",
        error: error.message,
      });
    }
  }

  // POST /search-flights-multicity - Multi-city flight search
  static async searchFlightsMultiCity(req: Request, res: Response) {
    try {
      const {
        tripRequests, // Array of {Origin, Destination, DepartDate}
        travelers = [{ Code: "ADT", Quantity: "1" }],
        cabinType = "ECO",
        language = "en",
        country = "CZ",
        currency = "GHS",
        passiveSessionId = "116417370",
        clientId = "melcom.golibe.com",
        password = "jd532aeeA4bc",
      } = req.body;

      if (!tripRequests || tripRequests.length < 2) {
        return res.status(400).json({
          status: false,
          message: "Multi-city search requires at least 2 trip requests",
        });
      }

      const payload = {
        GolApi: {
          PassiveSessionId: passiveSessionId,
          Authorization: {
            Requestor: {
              ClientId: clientId,
              Password: password,
            },
          },
          Settings: {
            Localization: {
              Language: language,
              Country: country,
            },
          },
          RequestDetail: {
            SearchFlightsRequest_1: {
              FlightSteps: {
                FlightStep: tripRequests,
              },
              SearchedPassengers: {
                SearchedPassenger: travelers.map((traveler) => ({
                  Code: traveler.Code,
                  Quantity: traveler.Quantity,
                })),
              },
              FlightPreferences: {
                FlightClass: { $t: cabinType },
              },
            },
          },
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Multi-city flight search completed successfully",
          data: response.data,
          requestPayload: payload,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching multi-city flights",
          error: error.response?.data || error.message,
          requestPayload: payload,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing multi-city flight search request",
        error: error.message,
      });
    }
  }

  // GET /flight-deals - Get flight deals with flexible parameters
  static async getFlightDeals(req: Request, res: Response) {
    try {
      // Create DTO from query parameters with defaults
      const dealsRequest = new FlightDealsRequestDto({
        category: req.query.category,
        language: req.query.language,
        country: req.query.country,
        currency: req.query.currency,
        limit: req.query.limit,
      });

      const payload = this.createBaseGolApiPayload(
        dealsRequest.language,
        dealsRequest.country,
        dealsRequest.currency
      );

      payload.GolApi.RequestDetail = {
        ListSpecialoffersRequest_1: {
          SpecialofferTypes: {
            SpecialofferType: {
              Code: dealsRequest.category || "flight",
            },
          },
          // MaxResults removed due to DTD validation error
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Flight deals retrieved successfully",
          data: response.data,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error fetching flight deals",
          error: error.response?.data || error.message,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing flight deals request",
        error: error.message,
      });
    }
  }

  // 🔹 Search destinations with flexible parameters
  static async searchDestinations(req: Request, res: Response) {
    try {
      // Create DTO from query parameters with defaults
      const searchRequest = new SearchDestinationsRequestDto({
        query: req.query.query,
        searchType: req.query.searchType,
        language: req.query.language,
        country: req.query.country,
      });

      const payload = this.createBaseGolApiPayload(
        searchRequest.language,
        searchRequest.country
      );

      payload.GolApi.RequestDetail = {
        SearchDestinationsRequest_1: {
          SearchPattern: {
            $t: searchRequest.query,
            SearchType: searchRequest.searchType,
          },
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Destinations retrieved successfully",
          data: response.data,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching destinations",
          error: error.response?.data || error.message,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing destination search request",
        error: error.message,
      });
    }
  }

  // POST /search-flights - Search for flights with flexible options
  static async searchFlights(req: Request, res: Response) {
    try {
      const searchRequest = new SearchFlightsRequestDto(req.body);

      // Transform passenger info from DTO to GOL API format
      const travelers = searchRequest.passengers.map((passenger) => ({
        Code: passenger.type,
        Quantity: passenger.count.toString(),
      }));

      // GOL API payload structure
      const payload = this.createBaseGolApiPayload(
        searchRequest.language,
        searchRequest.country,
        searchRequest.currency
      );

      const tripRequests = [
        {
          Origin: searchRequest.origin,
          Destination: searchRequest.destination,
          DepartDate: searchRequest.departureDate,
        },
      ];

      // Add return date for round trip flights
      if (
        searchRequest.flightType === FlightType.RETURN &&
        searchRequest.returnDate
      ) {
        tripRequests.push({
          Origin: searchRequest.destination,
          Destination: searchRequest.origin,
          DepartDate: searchRequest.returnDate,
        });
      }

      payload.GolApi.RequestDetail = {
        SearchFlightsRequest_1: {
          FlightSteps: {
            FlightStep: tripRequests,
          },
          SearchedPassengers: {
            SearchedPassenger: travelers.map((traveler) => ({
              Code: traveler.Code,
              Quantity: traveler.Quantity,
            })),
          },
          FlightPreferences: {
            FlightClass: { $t: searchRequest.cabinClass },
          },
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Flights retrieved successfully",
          data: response.data,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching flights",
          error: error.response?.data || error.message,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing flight search request",
        error: error.message,
      });
    }
  }

  // GET /flight-deals/:id - Get single flight deal by ID
  static async getFlightDealById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Implement GOL API call for specific flight deal
      return res.status(200).json({
        status: true,
        message: "Flight deal retrieved successfully",
        data: { id, message: "Implementation pending" },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error fetching flight deal",
        error: error.message,
      });
    }
  }

  // GET /flight-deals-categories - Get flight deal categories
  static async getFlightDealsCategories(req: Request, res: Response) {
    try {
      // TODO: Implement GOL API call for flight categories
      return res.status(200).json({
        status: true,
        message: "Flight deal categories retrieved successfully",
        data: { message: "Implementation pending" },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error fetching flight deal categories",
        error: error.message,
      });
    }
  }

  // GET /flight-bookings - Get all flight bookings
  static async getFlightBookings(req: Request, res: Response) {
    try {
      // TODO: Implement flight bookings retrieval
      return res.status(200).json({
        status: true,
        message: "Flight bookings retrieved successfully",
        data: { message: "Implementation pending" },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error fetching flight bookings",
        error: error.message,
      });
    }
  }

  // POST /flight-bookings - Create new flight booking with flexible passenger info
  static async createFlightBooking(req: Request, res: Response) {
    try {
      const bookingRequest = new FlightBookingRequestDto(req.body);

      // Transform passengers to GOL API format
      const travelers = bookingRequest.passengers.map((passenger) => ({
        Code: passenger.type,
        PassengerType: passenger.type,
        Title: passenger.title,
        FirstName: passenger.firstName,
        LastName: passenger.lastName,
        DateOfBirth: passenger.dateOfBirth,
        Nationality: passenger.nationality,
        PassportNumber: passenger.passportNumber,
        PassportExpiry: passenger.passportExpiry,
        Email: passenger.email,
        Phone: passenger.phone,
      }));

      const payload = this.createBaseGolApiPayload(
        "en",
        "GH",
        bookingRequest.currency
      );

      payload.GolApi.RequestDetail = {
        CreateBookingRequest_1: {
          FlightOfferId: bookingRequest.flightOfferId,
          FlightType: bookingRequest.flightType.toUpperCase(),
          Travelers: travelers,
          ContactInformation: {
            Email: bookingRequest.contactEmail,
            Phone: bookingRequest.contactPhone,
          },
          SpecialRequests: bookingRequest.specialRequests,
        },
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(201).json({
          status: true,
          message: "Flight booking created successfully",
          data: response.data,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error creating flight booking",
          error: error.response?.data || error.message,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing flight booking request",
        error: error.message,
      });
    }
  }

  // GET /flight-bookings/:id - Get single flight booking by ID
  static async getFlightBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // TODO: Implement flight booking retrieval by ID
      return res.status(200).json({
        status: true,
        message: "Flight booking retrieved successfully",
        data: { id, message: "Implementation pending" },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error fetching flight booking",
        error: error.message,
      });
    }
  }

  // POST /search-multicity-flights - Search for multi-city flights with flexible passenger info
  static async searchMultiCityFlights(req: Request, res: Response) {
    try {
      const multiCityRequest = new MultiCityFlightRequestDto(req.body);

      // Transform passenger info from DTO to GOL API format with proper code mapping
      const transformPassengerType = (type: string): string => {
        const typeMap: { [key: string]: string } = {
          adults: "ADT",
          adult: "ADT",
          children: "CHD",
          child: "CHD",
          infants: "INF",
          infant: "INF",
          youth: "YTH",
          senior: "YCD",
        };
        return typeMap[type.toLowerCase()] || type.toUpperCase();
      };

      const travelers = multiCityRequest.passengers.map((passenger) => ({
        Code: transformPassengerType(passenger.type),
        Quantity: passenger.count.toString(),
      }));

      // Create flight steps array for multi-city journey using exact working structure
      const flightSteps = multiCityRequest.journeys.map((journey) => ({
        Origin: journey.origin,
        Destination: journey.destination,
        DepartureDateTime: journey.departureDate,
      }));

      // Create searched passengers array with simplified structure
      const searchedPassengers = travelers.map((traveler) => ({
        Code: traveler.Code,
      }));

      // GOL API payload structure for multi-city using exact working structure
      const payload = this.createBaseGolApiPayload(
        multiCityRequest.language,
        multiCityRequest.country,
        multiCityRequest.currency
      );

      payload.GolApi.RequestDetail = {
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
      };

      try {
        const response = await axios.post(FlightsController.apiUrl, payload, {
          headers: { "Content-Type": "application/json" },
        });

        return res.status(200).json({
          status: true,
          message: "Multi-city flights retrieved successfully",
          data: response.data,
        });
      } catch (error: any) {
        return res.status(error.response?.status || 500).json({
          status: false,
          message: "Error searching multi-city flights",
          error: error.response?.data || error.message,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error processing multi-city flight search request",
        error: error.message,
      });
    }
  }
}
