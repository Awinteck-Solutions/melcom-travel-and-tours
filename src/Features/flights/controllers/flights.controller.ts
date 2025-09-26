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
  }

  // 🔹 Search destinations
  static async searchDestinations(req: Request, res: Response) {
    const { query } = req.query; // e.g. /flights/search?query=Los%20Angeles

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
              $t: query || "Los Angeles",
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
  }

  static async searchFlights(req: Request, res: Response) {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        status: false,
        message: "Origin, destination, and date are required",
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
          SearchFlightsExtendedRequest_2: {
            Journeys: {
              Journey: {
                Origin: origin,
                Destination: destination,
                DepartureDate: date,
              },
            },
            PassengerNationality: "GH",
            Passengers: {
              Passenger: {
                Code: "ADT",
                Quantity: "1",
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
