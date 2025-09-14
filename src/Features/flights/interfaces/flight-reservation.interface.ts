import mongoose, { Document } from "mongoose";
import { IFlightOffer } from "./flight-offer.interface";
import { IPassenger } from "./passenger.interface";

export interface IFlightReservation extends Document {
  reservationCode: string;
  golReservationId?: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  flightOffer: IFlightOffer;
  passengers: IPassenger[];
  contactInfo: {
    email: string;
    phone: string;
    address?: {
      street: string;
      city: string;
      country: string;
      postalCode: string;
    };
  };
  payment?: {
    method: "CREDIT_CARD" | "BANK_TRANSFER" | "CASH";
    status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    amount: number;
    currency: string;
    transactionId?: string;
  };
  createdBy: mongoose.Types.ObjectId;
  bookingDate: Date;
  ticketNumbers?: string[];
  pnr?: string; // Passenger Name Record
}
