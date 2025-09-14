import { Schema } from "mongoose";
import { IFlightReservation } from "../interfaces/flight-reservation.interface";
import FlightOfferSchema from "./flight-offer.schema";
import PassengerSchema from "./passenger.schema";
import { IPassenger } from "../interfaces/passenger.interface";

const FlightReservationSchema = new Schema<IFlightReservation>(
  {
    reservationCode: {
      type: String,
      required: true,
      unique: true,
    },
    golReservationId: String, // GOL API reservation ID
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"],
      default: "PENDING",
    },
    flightOffer: {
      type: FlightOfferSchema,
      required: true,
    },
    passengers: {
      type: [PassengerSchema],
      required: true,
      validate: {
        validator: function (passengers: IPassenger[]) {
          return passengers.length > 0;
        },
        message: "At least one passenger is required",
      },
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        country: String,
        postalCode: String,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["CREDIT_CARD", "BANK_TRANSFER", "CASH"],
      },
      status: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
        default: "PENDING",
      },
      amount: Number,
      currency: String,
      transactionId: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    ticketNumbers: [String],
    pnr: String, // Passenger Name Record
  },
  { timestamps: true }
);

export default FlightReservationSchema;
