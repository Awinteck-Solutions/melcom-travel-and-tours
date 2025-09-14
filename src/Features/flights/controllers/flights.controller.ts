import { Request, Response } from "express";
import Flights, {
  FlightSearch,
  FlightOffer,
  FlightReservation,
  Passenger,
} from "../schema/flights.schema";
import {
  FlightSearchDTO,
  FlightBookingDTO,
  PassengerDTO,
  ReservationDTO,
} from "../dto/flights.dto";

export class FlightsController {
  static async data(req: Request, res: Response) {
    try {
      let response = await Flights.find();

      return res.status(200).json({
        success: true,
        message: "Flights successful response",
        response,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "System error",
      });
    }
  }

  static async searchFlights(req: Request, res: Response) {
    try {
      const searchData = new FlightSearchDTO(req.body);

      // Generate unique search ID
      const searchId = `search_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // TODO: Integrate with GOL API SearchFlightsRequest_1
      // For now, we'll create a mock response structure
      const mockResults = []; // This will be populated from GOL API response

      const flightSearch = new FlightSearch({
        searchId,
        searchParams: {
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: new Date(searchData.departureDate),
          returnDate: searchData.returnDate
            ? new Date(searchData.returnDate)
            : undefined,
          passengers: {
            adults: searchData.adults,
            children: searchData.children,
            infants: searchData.infants,
          },
          cabin: searchData.cabin,
          tripType: searchData.tripType,
        },
        results: mockResults,
        userId: req.user?.id,
      });

      await flightSearch.save();

      return res.status(200).json({
        success: true,
        message: "Flight search completed successfully",
        searchId,
        results: mockResults,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Flight search failed",
      });
    }
  }

  static async getSearchResults(req: Request, res: Response) {
    try {
      const { searchId } = req.params;

      const flightSearch = await FlightSearch.findOne({ searchId });

      if (!flightSearch) {
        return res.status(404).json({
          success: false,
          message: "Search results not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Search results retrieved successfully",
        response: flightSearch,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve search results",
      });
    }
  }

  static async bookFlight(req: Request, res: Response) {
    try {
      const bookingData = new FlightBookingDTO(req.body);

      // Generate reservation code
      const reservationCode = `RES_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      // TODO: Integrate with GOL API BookReservationsRequest_1
      // Validate offer exists and is still valid
      const flightOffer = await FlightOffer.findOne({
        offerId: bookingData.offerId,
      });

      if (!flightOffer) {
        return res.status(404).json({
          success: false,
          message: "Flight offer not found or expired",
        });
      }

      const reservation = new FlightReservation({
        reservationCode,
        status: "PENDING",
        flightOffer,
        passengers: bookingData.passengers,
        contactInfo: {
          email: bookingData.contactEmail,
          phone: bookingData.contactPhone,
          address: bookingData.contactAddress,
        },
        createdBy: req.user?.id,
      });

      await reservation.save();

      return res.status(201).json({
        success: true,
        message: "Flight booking created successfully",
        reservationCode,
        response: new ReservationDTO(reservation),
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Flight booking failed",
      });
    }
  }

  static async getReservations(req: Request, res: Response) {
    try {
      const reservations = await FlightReservation.find({
        createdBy: req.user?.id,
      });

      const response = reservations.map(
        (reservation) => new ReservationDTO(reservation)
      );

      return res.status(200).json({
        success: true,
        message: "Reservations retrieved successfully",
        response,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve reservations",
      });
    }
  }

  static async getReservationDetails(req: Request, res: Response) {
    try {
      const { reservationCode } = req.params;

      const reservation = await FlightReservation.findOne({
        reservationCode,
        createdBy: req.user?.id,
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Reservation details retrieved successfully",
        response: new ReservationDTO(reservation),
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve reservation details",
      });
    }
  }

  static async cancelReservation(req: Request, res: Response) {
    try {
      const { reservationCode } = req.params;

      const reservation = await FlightReservation.findOne({
        reservationCode,
        createdBy: req.user?.id,
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }

      // TODO: Integrate with GOL API CancelReservationsRequest_1
      reservation.status = "CANCELLED";
      await reservation.save();

      return res.status(200).json({
        success: true,
        message: "Reservation cancelled successfully",
        response: new ReservationDTO(reservation),
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Failed to cancel reservation",
      });
    }
  }

  static async createPassenger(req: Request, res: Response) {
    try {
      const passengerData = new PassengerDTO(req.body);

      const passenger = new Passenger({
        ...passengerData,
        dateOfBirth: new Date(passengerData.dateOfBirth),
        passportExpiry: passengerData.passportExpiry
          ? new Date(passengerData.passportExpiry)
          : undefined,
      });

      await passenger.save();

      return res.status(201).json({
        success: true,
        message: "Passenger created successfully",
        response: new PassengerDTO(passenger),
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Failed to create passenger",
      });
    }
  }

  static async getPassengers(req: Request, res: Response) {
    try {
      const passengers = await Passenger.find();

      const response = passengers.map(
        (passenger) => new PassengerDTO(passenger)
      );

      return res.status(200).json({
        success: true,
        message: "Passengers retrieved successfully",
        response,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve passengers",
      });
    }
  }
}
