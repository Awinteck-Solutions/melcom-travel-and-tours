export class FlightsDTO {
  id: string;
  data: string;
  createdAt: Date;

  constructor(data) {
    this.id = data.id;
    this.data = data.data;
    this.createdAt = data.createdAt;
  }
}

export class FlightSearchDTO {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabin?: string;
  tripType: string;

  constructor(data) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.departureDate = data.departureDate;
    this.returnDate = data.returnDate;
    this.adults = data.adults;
    this.children = data.children || 0;
    this.infants = data.infants || 0;
    this.cabin = data.cabin || "ECONOMY";
    this.tripType = data.tripType;
  }
}

export class PassengerDTO {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  email?: string;
  phone?: string;
  passengerType: string;

  constructor(data) {
    this.title = data.title;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.nationality = data.nationality;
    this.passportNumber = data.passportNumber;
    this.passportExpiry = data.passportExpiry;
    this.passportCountry = data.passportCountry;
    this.email = data.email;
    this.phone = data.phone;
    this.passengerType = data.passengerType;
  }
}

export class FlightBookingDTO {
  offerId: string;
  passengers: PassengerDTO[];
  contactEmail: string;
  contactPhone: string;
  contactAddress?: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };

  constructor(data) {
    this.offerId = data.offerId;
    this.passengers = data.passengers?.map((p) => new PassengerDTO(p)) || [];
    this.contactEmail = data.contactEmail;
    this.contactPhone = data.contactPhone;
    this.contactAddress = data.contactAddress;
  }
}

export class FlightOfferDTO {
  offerId: string;
  type: string;
  price: {
    total: number;
    base: number;
    taxes: number;
    fees: number;
    currency: string;
  };
  outboundSegments: any[];
  returnSegments?: any[];
  validUntil: string;
  passengerCount: {
    adults: number;
    children: number;
    infants: number;
  };

  constructor(data) {
    this.offerId = data.offerId;
    this.type = data.type;
    this.price = data.price;
    this.outboundSegments = data.outboundSegments;
    this.returnSegments = data.returnSegments;
    this.validUntil = data.validUntil;
    this.passengerCount = data.passengerCount;
  }
}

export class ReservationDTO {
  reservationCode: string;
  status: string;
  flightOffer: FlightOfferDTO;
  passengers: PassengerDTO[];
  contactInfo: {
    email: string;
    phone: string;
  };
  bookingDate: string;
  pnr?: string;

  constructor(data) {
    this.reservationCode = data.reservationCode;
    this.status = data.status;
    this.flightOffer = new FlightOfferDTO(data.flightOffer);
    this.passengers = data.passengers?.map((p) => new PassengerDTO(p)) || [];
    this.contactInfo = data.contactInfo;
    this.bookingDate = data.bookingDate;
    this.pnr = data.pnr;
  }
}
