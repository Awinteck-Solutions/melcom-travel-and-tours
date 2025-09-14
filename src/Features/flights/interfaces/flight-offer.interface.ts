import { Document } from "mongoose";
import { IFlightSegment } from "./flight-segment.interface";

export interface IFlightOffer extends Document {
  offerId: string;
  golReference?: string;
  type: "ONEWAY" | "RETURN" | "MULTICITY";
  outboundSegments: IFlightSegment[];
  returnSegments?: IFlightSegment[];
  price: {
    total: number;
    base: number;
    taxes: number;
    fees: number;
    currency: string;
  };
  fareRules?: {
    changeable: boolean;
    refundable: boolean;
    penalties?: {
      change: number;
      cancel: number;
    };
  };
  validUntil: Date;
  passengerCount: {
    adults: number;
    children: number;
    infants: number;
  };
}
