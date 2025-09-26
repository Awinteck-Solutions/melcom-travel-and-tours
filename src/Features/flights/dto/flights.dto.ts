// Search Destinations Request DTO
export class SearchDestinationsRequestDto {
  query: string;

  constructor(data: any) {
    this.query = data.query;
  }
}

// Search Flights Request DTO
export class SearchFlightsRequestDto {
  origin: string;
  destination: string;
  date: string;

  constructor(data: any) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.date = data.date;
  }
}

// Flight Deal Response DTO
export class FlightDealResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  airline: string;
  duration: string;
  stops: number;
  availableSeats: number;
  createdAt: Date;

  constructor(deal: any) {
    this.id = deal.id;
    this.title = deal.title;
    this.description = deal.description;
    this.price = deal.price;
    this.currency = deal.currency;
    this.origin = deal.origin;
    this.destination = deal.destination;
    this.departureDate = deal.departureDate;
    this.returnDate = deal.returnDate;
    this.airline = deal.airline;
    this.duration = deal.duration;
    this.stops = deal.stops;
    this.availableSeats = deal.availableSeats;
    this.createdAt = deal.createdAt;
  }
}

// Destination Response DTO
export class DestinationResponse {
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  type: string;

  constructor(destination: any) {
    this.code = destination.code;
    this.name = destination.name;
    this.city = destination.city;
    this.country = destination.country;
    this.countryCode = destination.countryCode;
    this.type = destination.type;
  }
}

// Flight Search Response DTO
export class FlightSearchResponse {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  availableSeats: number;
  cabinClass: string;

  constructor(flight: any) {
    this.id = flight.id;
    this.airline = flight.airline;
    this.flightNumber = flight.flightNumber;
    this.origin = flight.origin;
    this.destination = flight.destination;
    this.departureTime = flight.departureTime;
    this.arrivalTime = flight.arrivalTime;
    this.duration = flight.duration;
    this.price = flight.price;
    this.currency = flight.currency;
    this.stops = flight.stops;
    this.availableSeats = flight.availableSeats;
    this.cabinClass = flight.cabinClass;
  }
}

// Generic API Response DTO
export class FlightsApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  error?: any;

  constructor(status: boolean, message: string, data?: T, error?: any) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
