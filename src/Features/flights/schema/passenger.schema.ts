import { Schema } from "mongoose";
import { IPassenger } from "../interfaces/passenger.interface";

const PassengerSchema = new Schema<IPassenger>(
  {
    title: {
      type: String,
      required: true,
      enum: ["MR", "MRS", "MS", "MISS", "DR", "PROF"],
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    passportNumber: String,
    passportExpiry: Date,
    passportCountry: String,
    email: String,
    phone: String,
    passengerType: {
      type: String,
      enum: ["ADULT", "CHILD", "INFANT"],
      required: true,
    },
    loyaltyProgram: {
      airline: String,
      membershipNumber: String,
    },
  },
  { timestamps: true }
);

export default PassengerSchema;
