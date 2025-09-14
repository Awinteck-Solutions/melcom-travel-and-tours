import { Schema } from "mongoose";
import { IFlightOffer } from "../interfaces/flight-offer.interface";
import FlightSegmentSchema from "./flight-segment.schema";

const FlightOfferSchema = new Schema<IFlightOffer>(
  {
    offerId: {
      type: String,
      required: true,
      unique: true,
    },
    golReference: String, // GOL API reference
    type: {
      type: String,
      enum: ["ONEWAY", "RETURN", "MULTICITY"],
      required: true,
    },
    outboundSegments: [FlightSegmentSchema],
    returnSegments: [FlightSegmentSchema],
    price: {
      total: {
        type: Number,
        required: true,
      },
      base: {
        type: Number,
        required: true,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      fees: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        required: true,
        default: "USD",
      },
    },
    fareRules: {
      changeable: {
        type: Boolean,
        default: false,
      },
      refundable: {
        type: Boolean,
        default: false,
      },
      penalties: {
        change: Number,
        cancel: Number,
      },
    },
    validUntil: {
      type: Date,
      required: true,
    },
    passengerCount: {
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
  },
  { timestamps: true }
);

export default FlightOfferSchema;
