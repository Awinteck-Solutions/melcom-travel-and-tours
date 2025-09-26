import { Request, Response } from "express";
import axios from "axios";

export class FlightsController {
  private static readonly apiUrl = `${process.env.GOL_API_BASE_URL}/json.php`;

  static async getFlightDeals(req: Request, res: Response) {
    const { category } = req.query; // Optional category filter
    
    const payload = {
      GolApi: {
        PassiveSessionId: "116417370",
        Authorization: {
          Requestor: {
            ClientId: process.env.GOL_API_CLIENT_ID,
            Password: process.env.GOL_API_PASSWORD,
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

    try {
      const response = await axios.post(FlightsController.apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const result = response.data;
      
      // Extract deals and build user-friendly response directly
      const deals = result?.GolApi?.ResponseDetail?.ListSpecialoffersResponse_1?.ListSpecialoffers?.SpecialofferItem || [];
      const airports = result?.GolApi?.CodeBook?.Airports?.Airport || [];
      const airlines = result?.GolApi?.CodeBook?.TransportCompanies?.TransportCompany || [];
      
      // Create airport lookup map
      const airportMap = airports.reduce((acc: any, airport: any) => {
        acc[airport.Code] = airport.$t;
        return acc;
      }, {});

      // Create airline lookup map
      const airlineMap = airlines.reduce((acc: any, airline: any) => {
        acc[airline.Code] = {
          name: airline.Name?.$t || airline.Code,
          logo: airline.LogoUrl?.$t
        };
        return acc;
      }, {});

      const formattedDeals = {
        total: deals.length,
        currency: "GHS",
        deals: deals.map((deal: any) => ({
          id: deal.SpecialOfferId,
          type: deal.Type,
          airline: {
            code: deal.MarketingAirline,
            ...airlineMap[deal.MarketingAirline]
          },
          route: {
            origin: {
              code: deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Origin,
              name: airportMap[deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Origin]
            },
            destination: {
              code: deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Destination,
              name: airportMap[deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Destination]
            }
          },
          price: {
            amount: parseFloat(deal.Price || '0'),
            currency: "GHS",
            formatted: `${deal.Price} GHS`
          },
          validity: {
            from: deal.ValidFrom,
            to: deal.ValidTo
          },
          description: deal.Description?.$t
        }))
      };

      return res.status(200).json({
        status: true,
        message: "Flight deals retrieved successfully",
        data: formattedDeals,
      });
    } catch (error: any) {
      return res.status(error.response?.status || 500).json({
        status: false,
        message: "Error fetching flight deals",
        error: error.response?.data || error.message,
      });
    }
  }

  // 🔹 Search destinations - Get airports and cities by search query
  static async searchDestinations(req: Request, res: Response) {
    const { query } = req.query; // e.g. /search-destinations?query=Los Angeles

    if (!query) {
      return res.status(400).json({
        status: false,
        message: "Query parameter is required",
      });
    }

    const payload = {
      GolApi: {
        PassiveSessionId: "116417370",
        Authorization: {
          Requestor: {
            ClientId: process.env.GOL_API_CLIENT_ID,
            Password: process.env.GOL_API_PASSWORD,
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
              $t: query,
              SearchType: "flight",
            },
          },
        },
      },
    };

    try {
      const response = await axios.post(FlightsController.apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const result = response.data;
      
      // Use the exact same approach that worked in the previous test
      const searchedItems = result?.GolApi?.ResponseDetail?.SearchDestinationsResponse_1?.SearchedAirports?.SearchedAirport || [];
      
      const formattedDestinations = {
        total: searchedItems.length,
        query: query,
        results: searchedItems.map((item: any) => ({
          type: item.Type,
          code: item.Code,
          name: item.Name?.$t || item.Code,
          city: item.City?.$t,
          country: item.Country?.$t
        }))
      };

      return res.status(200).json({
        status: true,
        message: `Search results for "${query}" retrieved successfully`,
        data: formattedDestinations,
      });
    } catch (error: any) {
      return res.status(error.response?.status || 500).json({
        status: false,
        message: "Error searching destinations",
        error: error.response?.data || error.message,
      });
    }
  }

  static async searchFlights(req: Request, res: Response) {
    const { origin, destination, date } = req.query;

    const payload = {
      GolApi: {
        PassiveSessionId: "116417370",
        Authorization: {
          Requestor: {
            ClientId: process.env.GOL_API_CLIENT_ID,
            Password: process.env.GOL_API_PASSWORD,
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
              FlightStep: [
                {
                  Origin: origin || "ACC",
                  Destination: destination || "LAX",
                  DepartureDateTime: date || "2025-10-26",
                },
              ],
            },
            SearchedPassengers: {
              SearchedPassenger: [{ Code: "ADT" }],
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

      const result = response.data;
      
      // Extract flight offers and build user-friendly response directly
      const flightOffers = result?.GolApi?.ResponseDetail?.SearchFlightsExtendedResponse_2?.FlightOffers?.FlightOffer || [];
      
      // Helper function to get airport name
      const getAirportName = (code: string): string => {
        const airportNames: { [key: string]: string } = {
          'ACC': 'Kotoka International Airport',
          'LAX': 'Los Angeles International Airport',
          'LHR': 'London Heathrow Airport',
          'LGW': 'London Gatwick Airport',
          'JFK': 'John F. Kennedy International Airport',
          'BRU': 'Brussels Airport',
          'FRA': 'Frankfurt Airport',
          'IAD': 'Washington Dulles International Airport',
          'ADD': 'Addis Ababa Bole International Airport',
          'CMN': 'Mohammed V International Airport',
          'LFW': 'Lomé-Tokoin Airport',
          'FCO': 'Leonardo da Vinci International Airport'
        };
        return airportNames[code] || code;
      };

      // Helper function to get airline name
      const getAirlineName = (code: string): string => {
        const airlineNames: { [key: string]: string } = {
          'BA': 'British Airways',
          'SN': 'Brussels Airlines',
          'ET': 'Ethiopian Airlines',
          'VS': 'Virgin Atlantic',
          'DL': 'Delta Air Lines',
          'AT': 'Royal Air Maroc',
          'UA': 'United Airlines',
          'AA': 'American Airlines',
          'AF': 'Air France',
          'LH': 'Lufthansa',
          'KP': 'ASKY Airlines'
        };
        return airlineNames[code] || code;
      };

      const formattedFlights = {
        total: flightOffers.length,
        currency: "GHS",
        searchCriteria: {
          origin: origin || "ACC",
          destination: destination || "LAX",
          date: date || "2025-10-26"
        },
        flights: flightOffers.map((offer: any) => {
          const firstStream = offer.FlightItinerary?.FlightStream?.[0];
          const firstOption = firstStream?.FlightOption?.[0];
          const segments = firstOption?.FlightSegments?.FlightSegment || [];
          const firstSegment = segments[0] || {};
          const lastSegment = segments[segments.length - 1] || {};
          const pricing = offer.PricingDetails?.PricingDetail?.[0];

          return {
            id: firstOption?.Key,
            route: {
              origin: {
                code: firstSegment.OriginAirport,
                name: getAirportName(firstSegment.OriginAirport),
                terminal: firstSegment.DepartureTerminal
              },
              destination: {
                code: lastSegment.DestinationAirport,
                name: getAirportName(lastSegment.DestinationAirport),
                terminal: lastSegment.ArrivalTerminal
              }
            },
            schedule: {
              departure: {
                dateTime: firstSegment.DepartureDateTime,
                timezone: firstSegment.DepartureTimezone
              },
              arrival: {
                dateTime: lastSegment.ArrivalDateTime,
                timezone: lastSegment.ArrivalTimezone
              },
              duration: firstOption?.JourneyDuration
            },
            price: {
              amount: parseFloat(pricing?.FlightPricing?.FlightPrice?.FullPrice || '0'),
              basePrice: parseFloat(pricing?.FlightPricing?.FlightPrice?.BasePrice || '0'),
              taxes: parseFloat(pricing?.FlightPricing?.FlightPrice?.OperatorFee || '0'),
              currency: "GHS",
              formatted: `${pricing?.FlightPricing?.FlightPrice?.FullPrice || '0'} GHS`
            },
            airline: {
              code: firstSegment.MarketingAirline,
              name: getAirlineName(firstSegment.MarketingAirline)
            },
            aircraft: firstSegment.PlaneType,
            cabinClass: firstSegment.CabinClass,
            stops: segments.length - 1,
            segments: segments.map((segment: any) => ({
              origin: {
                code: segment.OriginAirport,
                name: getAirportName(segment.OriginAirport),
                terminal: segment.DepartureTerminal
              },
              destination: {
                code: segment.DestinationAirport,
                name: getAirportName(segment.DestinationAirport),
                terminal: segment.ArrivalTerminal
              },
              departure: segment.DepartureDateTime,
              arrival: segment.ArrivalDateTime,
              duration: segment.JourneyDuration,
              flightNumber: segment.FlightNumber,
              airline: {
                code: segment.MarketingAirline,
                name: getAirlineName(segment.MarketingAirline)
              },
              aircraft: segment.PlaneType
            })),
            baggage: {
              included: pricing?.BaggageLimit?.Included === 'Yes',
              quantity: parseInt(pricing?.BaggageLimit?.Quantity || '0'),
              weight: pricing?.BaggageLimit?.Weight
            },
            flexibility: {
              changeable: pricing?.ChangeTicket?.Included !== 'No',
              changeFeeBefore: pricing?.ChangeTicket?.AmountBeforeDeparture,
              changeFeeAfter: pricing?.ChangeTicket?.AmountAfterDeparture,
              refundable: pricing?.CancelTicket?.Included === 'Yes'
            },
            brandName: offer.FlightCombinations?.FlightCombination?.[0]?.UniformBrandName,
            source: offer.Process
          };
        })
      };

      return res.status(200).json({
        status: true,
        message: "Flights retrieved successfully",
        data: formattedFlights,
      });
    } catch (error: any) {
      return res.status(error.response?.status || 500).json({
        status: false,
        message: "Error searching flights",
        error: error.response?.data || error.message,
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

  // POST /flight-bookings - Create new flight booking
  static async createFlightBooking(req: Request, res: Response) {
    try {
      // TODO: Implement flight booking creation
      return res.status(201).json({
        status: true,
        message: "Flight booking created successfully",
        data: { message: "Implementation pending" },
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "Error creating flight booking",
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
}
