import mongoose, { Schema, Document } from 'mongoose';

export interface IUserCheckout extends Document {
  bookingReference: string;
  flight: {
    id: number;
    from: string;
    fromCode: string;
    to: string;
    toCode: string;
    airlineLogo: string;
    departure: string;
    arrival: string;
    airline: string;
    planeType: string;
    flightType: string;
    returnDate?: string;
    price: number;
    duration: string;
    stops: number;
    flightNumber: string;
    class: string;
    segment: Array<{
      flightNumber: string;
      airline: string;
      aircraft: string;
      departure: {
        airport: string;
        time: string;
        terminal: string;
      };
      arrival: {
        airport: string;
        time: string;
        terminal: string;
      };
      duration: string;
      cabinClass: string;
    }>;
    bookingReference: string;
    currency: string;
    perPassenger: number;
    segments: Array<{
      flightNumber: string;
      airline: string;
      aircraft: string;
      departure: {
        airport: string;
        time: string;
        terminal: string;
      };
      arrival: {
        airport: string;
        time: string;
        terminal: string;
      };
      duration: string;
      cabinClass: string;
    }>;
    totalSegments: number;
    firstAirline: string;
    firstAirlineCode: string;
  };
  travelers: Array<{
    PassengerType: string;
    BirthDate: string;
    Passport: string;
    LoyaltyProgram: string;
    Gender: string;
    NamePrefix: string;
    GivenName: string;
    Surname: string;
  }>;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  checkoutId?: string;
  transactionId?: string;
  golReservationId?: string;
  userId?: string;
  contactInfo: {
    email: string;
    phone: string;
    name: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserCheckoutSchema = new Schema({
  bookingReference: { 
    type: String, 
    required: true, 
    unique: true 
  },
  flight: {
    id: { type: Number, required: true },
    from: { type: String, required: true },
    fromCode: { type: String, required: true },
    to: { type: String, required: true },
    toCode: { type: String, required: true },
    airlineLogo: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    airline: { type: String, required: true },
    planeType: { type: String, required: true },
    flightType: { type: String, required: true },
    returnDate: { type: String, required: false },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    stops: { type: Number, required: true },
    flightNumber: { type: String, required: true },
    class: { type: String, required: true },
    segment: [{
      flightNumber: { type: String, required: true },
      airline: { type: String, required: true },
      aircraft: { type: String, required: true },
      departure: {
        airport: { type: String, required: true },
        time: { type: String, required: true },
        terminal: { type: String, required: true }
      },
      arrival: {
        airport: { type: String, required: true },
        time: { type: String, required: true },
        terminal: { type: String, required: true }
      },
      duration: { type: String, required: true },
      cabinClass: { type: String, required: true }
    }],
    bookingReference: { type: String, required: true },
    currency: { type: String, required: true },
    perPassenger: { type: Number, required: true },
    segments: [{
      flightNumber: { type: String, required: true },
      airline: { type: String, required: true },
      aircraft: { type: String, required: true },
      departure: {
        airport: { type: String, required: true },
        time: { type: String, required: true },
        terminal: { type: String, required: true }
      },
      arrival: {
        airport: { type: String, required: true },
        time: { type: String, required: true },
        terminal: { type: String, required: true }
      },
      duration: { type: String, required: true },
      cabinClass: { type: String, required: true }
    }],
    totalSegments: { type: Number, required: true },
    firstAirline: { type: String, required: true },
    firstAirlineCode: { type: String, required: true }
  },
  travelers: [{
    PassengerType: { type: String, required: true },
    BirthDate: { type: String, required: false },
    Passport: { type: String, required: false },
    LoyaltyProgram: { type: String, required: false },
    Gender: { type: String, required: true },
    NamePrefix: { type: String, required: true },
    GivenName: { type: String, required: true },
    Surname: { type: String, required: true }
  }],
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'GHS' },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  checkoutId: { type: String, required: false },
  transactionId: { type: String, required: false },
  golReservationId: { type: String, required: false },
  userId: { type: String, required: false },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true }
  },
  notes: { type: String, required: false }
}, { timestamps: true });

const UserCheckout = mongoose.model<IUserCheckout>('UserCheckout', UserCheckoutSchema);

export default UserCheckout;

       