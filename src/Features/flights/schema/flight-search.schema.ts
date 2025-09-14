import { Schema } from "mongoose";
import { IFlightSearch } from "../interfaces/flight-search.interface";
import FlightOfferSchema from "./flight-offer.schema";

const FlightSearchSchema = new Schema<IFlightSearch>(
  {
    searchId: {
      type: String,
      required: true,
      unique: true,
    },
    searchParams: {
      origin: {
        type: String,
        required: true,
      },
      destination: {
        type: String,
        required: true,
      },
      departureDate: {
        type: Date,
        required: true,
      },
      returnDate: Date,
      passengers: {
        adults: {
          type: Number,
          required: true,
          min: 1,
        },
        children: {
          type: Number,
          default: 0,
          min: 0,
        },
        infants: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
      cabin: {
        type: String,
        enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
        default: "ECONOMY",
      },
      tripType: {
        type: String,
        enum: ["ONEWAY", "RETURN", "MULTICITY"],
        required: true,
      },
    },
    results: [FlightOfferSchema],
    searchedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default FlightSearchSchema;
