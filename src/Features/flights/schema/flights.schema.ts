import mongoose, { Schema } from "mongoose";

// Import interfaces
import {
  IPassenger,
  IFlightOffer,
  IFlightReservation,
  IFlightSearch,
} from "../interfaces";

// Import schemas
import PassengerSchema from "./passenger.schema";
import FlightOfferSchema from "./flight-offer.schema";
import FlightReservationSchema from "./flight-reservation.schema";
import FlightSearchSchema from "./flight-search.schema";

// Legacy Flights Schema (keeping for backward compatibility)
const FlightsSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["ACTIVE", "DEACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// Create and export models
const Passenger = mongoose.model<IPassenger>("Passenger", PassengerSchema);
const FlightOffer = mongoose.model<IFlightOffer>(
  "FlightOffer",
  FlightOfferSchema
);
const FlightReservation = mongoose.model<IFlightReservation>(
  "FlightReservation",
  FlightReservationSchema
);
const FlightSearch = mongoose.model<IFlightSearch>(
  "FlightSearch",
  FlightSearchSchema
);
const Flights = mongoose.model("Flights", FlightsSchema);

export { Passenger, FlightOffer, FlightReservation, FlightSearch };

export default Flights;
