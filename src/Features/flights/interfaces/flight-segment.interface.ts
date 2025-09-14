import { Document } from "mongoose";

export interface IFlightSegment extends Document {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: Date;
  departureTime: string;
  arrivalDate: Date;
  arrivalTime: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  duration: number; // in minutes
  stops: number;
  cabin: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
  fareClass: string;
  baggage?: {
    checkedBags: number;
    checkedWeight: number;
    carryOnBags: number;
    carryOnWeight: number;
  };
}
