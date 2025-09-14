import mongoose, { Document } from "mongoose";
import { IFlightOffer } from "./flight-offer.interface";

export interface IFlightSearch extends Document {
  searchId: string;
  searchParams: {
    origin: string;
    destination: string;
    departureDate: Date;
    returnDate?: Date;
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };
    cabin: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    tripType: "ONEWAY" | "RETURN" | "MULTICITY";
  };
  results: IFlightOffer[];
  searchedAt: Date;
  expiresAt: Date;
  userId?: mongoose.Types.ObjectId;
}
