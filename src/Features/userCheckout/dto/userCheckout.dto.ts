export interface FlightSegmentDTO {
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
}

export interface FlightDTO {
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
  segment: FlightSegmentDTO[];
  bookingReference: string;
  currency: string;
  perPassenger: number;
  segments: FlightSegmentDTO[];
  totalSegments: number;
  firstAirline: string;
  firstAirlineCode: string;
}

export interface TravelerDTO {
  PassengerType: string;
  BirthDate: string;
  Passport: string;
  LoyaltyProgram?: string;
  Gender: string;
  NamePrefix: string;
  GivenName: string;
  Surname: string;
  email?: string;
  phone?: string;
}

export interface CheckoutRequestDTO {
  flight: FlightDTO;
  Traveler: TravelerDTO[];
  contactInfo: {
    email: string;
    phone: string;
    name: string;
  }
}

export interface CheckoutResponseDTO {
  checkoutId: string;
  checkoutUrl: string;
  bookingReference: string;
  status: string;
  message: string;
}

export class UserCheckoutDTO {
  id: string;
  bookingReference: string;
  flight: FlightDTO;
  travelers: TravelerDTO[];
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  checkoutId?: string;
  transactionId?: string;
  golReservationId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.bookingReference = data.bookingReference;
    this.flight = data.flight;
    this.travelers = data.travelers;
    this.totalAmount = data.totalAmount;
    this.currency = data.currency;
    this.status = data.status;
    this.paymentStatus = data.paymentStatus;
    this.checkoutId = data.checkoutId;
    this.transactionId = data.transactionId;
    this.golReservationId = data.golReservationId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}