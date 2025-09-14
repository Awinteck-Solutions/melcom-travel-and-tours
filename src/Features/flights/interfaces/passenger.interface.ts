import { Document } from "mongoose";

export interface IPassenger extends Document {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: Date;
  passportCountry?: string;
  email?: string;
  phone?: string;
  passengerType: "ADULT" | "CHILD" | "INFANT";
  loyaltyProgram?: {
    airline: string;
    membershipNumber: string;
  };
}
