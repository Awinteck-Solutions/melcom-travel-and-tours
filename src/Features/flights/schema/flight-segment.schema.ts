import { Schema } from "mongoose";
import { IFlightSegment } from "../interfaces/flight-segment.interface";

const FlightSegmentSchema = new Schema<IFlightSegment>({
  departureAirport: {
    type: String,
    required: true,
  },
  arrivalAirport: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  aircraft: String,
  duration: {
    type: Number,
    required: true,
  },
  stops: {
    type: Number,
    default: 0,
  },
  cabin: {
    type: String,
    enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
    required: true,
  },
  fareClass: String,
  baggage: {
    checkedBags: Number,
    checkedWeight: Number,
    carryOnBags: Number,
    carryOnWeight: Number,
  },
});

export default FlightSegmentSchema;
