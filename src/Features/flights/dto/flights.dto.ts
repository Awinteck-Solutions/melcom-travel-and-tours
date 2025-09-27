import { 
  FlightType, 
  CabinClass, 
  PassengerType, 
  Currency, 
  Language, 
  CountryCode, 
  AirportCategory, 
  SearchType,
  DefaultAirport,
  DefaultCountry,
  PhonePrefix,
  ToleranceDays,
  BookingStatus,
  MealType,
  SeatPreference,
  FlightDealCategory,
  FlightStatus,
  Airlines
} from '../enums/flights.enum';

// Flexible GOL API Request DTO - can handle any GOL API request structure
export class FlexibleGolApiRequestDto {
  language?: string;
  country?: string;
  currency?: string;
  passiveSessionId?: string;
  clientId?: string;
  password?: string;
  requestDetail?: any;

  constructor(data: any = {}) {
    this.language = data.language || "en";
    this.country = data.country || "CZ";
    this.currency = data.currency || "GHS";
    this.passiveSessionId = data.passiveSessionId || "116417370";
    this.clientId = data.clientId || process.env.GOL_API_CLIENT_ID;
    this.password = data.password || process.env.GOL_API_PASSWORD;
    this.requestDetail = data.requestDetail;
  }

  // Create the complete GOL API payload
  createPayload(): any {
    return {
      GolApi: {
        PassiveSessionId: this.passiveSessionId,
        Authorization: {
          Requestor: {
            ClientId: this.clientId,
            Password: this.password,
          },
        },
        Settings: {
          Localization: {
            Language: this.language,
            Country: this.country,
            ...(this.currency && { Currency: this.currency }),
          },
        },
        RequestDetail: this.requestDetail,
      },
    };
  }
}

// Flight Search Request DTO with flexible trip configuration
export class FlexibleFlightSearchDto {
  // Destination search parameters
  searchQuery?: string;
  searchType?: SearchType;
  
  // Flight search parameters
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  
  // Flight preferences
  flightType?: FlightType;
  cabinClass?: CabinClass;
  passengers?: PassengerInfo[];
  
  // Localization
  language?: string;
  country?: string;
  currency?: string;
  
  // API credentials (optional overrides)
  passiveSessionId?: string;
  clientId?: string;
  password?: string;

  constructor(data: any = {}) {
    // Destination search
    this.searchQuery = data.searchQuery || data.query;
    this.searchType = data.searchType || SearchType.FLIGHT;
    
    // Flight search
    this.origin = data.origin;
    this.destination = data.destination;
    this.departureDate = data.departureDate;
    this.returnDate = data.returnDate;
    this.flightType = data.flightType || FlightType.ONE_WAY;
    this.cabinClass = data.cabinClass || CabinClass.ECO;
    this.passengers = data.passengers || [{ type: PassengerType.ADT, count: 1 }];
    
    // Localization
    this.language = data.language || "en";
    this.country = data.country || "CZ";
    this.currency = data.currency || "GHS";
    
    // API credentials
    this.passiveSessionId = data.passiveSessionId || "116417370";
    this.clientId = data.clientId || process.env.GOL_API_CLIENT_ID;
    this.password = data.password || process.env.GOL_API_PASSWORD;
  }

  // Create destination search payload
  createDestinationSearchPayload(): any {
    return new FlexibleGolApiRequestDto({
      language: this.language,
      country: this.country,
      currency: this.currency,
      passiveSessionId: this.passiveSessionId,
      clientId: this.clientId,
      password: this.password,
      requestDetail: {
        SearchDestinationsRequest_1: {
          SearchPattern: {
            $t: this.searchQuery,
            SearchType: this.searchType,
          },
        },
      },
    }).createPayload();
  }

  // Create flight search payload
  createFlightSearchPayload(): any {
    const travelers = this.passengers?.map(passenger => ({
      Code: passenger.type,
      Quantity: passenger.count.toString(),
    })) || [];

    const tripRequests = [
      {
        Origin: this.origin,
        Destination: this.destination,
        DepartDate: this.departureDate,
      },
    ];

    // Add return trip for round-trip flights
    if (this.flightType === FlightType.RETURN && this.returnDate) {
      tripRequests.push({
        Origin: this.destination,
        Destination: this.origin,
        DepartDate: this.returnDate,
      });
    }

    return new FlexibleGolApiRequestDto({
      language: this.language,
      country: this.country,
      currency: this.currency,
      passiveSessionId: this.passiveSessionId,
      clientId: this.clientId,
      password: this.password,
      requestDetail: {
        SearchFlightsRequest_1: {
          Travelers: travelers,
          TripType: this.flightType?.toUpperCase(),
          TripRequests: tripRequests,
          CabinType: this.cabinClass,
        },
      },
    }).createPayload();
  }
}

// Flight Deals Request DTO
export class FlightDealsRequestDto {
  category?: FlightDealCategory;
  language?: Language;
  country?: CountryCode;
  currency?: Currency;
  limit?: number;

  constructor(data: any = {}) {
    this.category = data.category;
    this.language = data.language || Language.ENGLISH;
    this.country = data.country || CountryCode.GHANA;
    this.currency = data.currency || Currency.GHS;
    this.limit = data.limit || 50;
  }
}

// Enhanced Search Destinations Request DTO
export class SearchDestinationsRequestDto {
  query: string;
  searchType?: SearchType;
  language?: Language;
  country?: CountryCode;

  constructor(data: any) {
    this.query = data.query;
    this.searchType = data.searchType || SearchType.FLIGHT;
    this.language = data.language || Language.ENGLISH;
    this.country = data.country || CountryCode.GHANA;
  }
}

// Enhanced Search Flights Request DTO
export class SearchFlightsRequestDto {
  // Basic flight search parameters
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  
  // Flight type and preferences
  flightType: FlightType;
  cabinClass: CabinClass;
  directFlightsOnly: boolean;
  toleranceDays: ToleranceDays;
  
  // Passenger information
  passengers: PassengerInfo[];
  
  // Localization
  language: Language;
  country: CountryCode;
  currency: Currency;
  
  // Optional filters
  preferredAirlines?: string[];
  maxStops?: number;
  maxPrice?: number;

  constructor(data: any) {
    // Basic parameters
    this.origin = data.origin;
    this.destination = data.destination;
    this.departureDate = data.departureDate;
    this.returnDate = data.returnDate;
    
    // Flight preferences
    this.flightType = data.flightType || FlightType.ONE_WAY;
    this.cabinClass = data.cabinClass || CabinClass.ECO;
    this.directFlightsOnly = data.directFlightsOnly || false;
    this.toleranceDays = data.toleranceDays || ToleranceDays.NONE;
    
    // Passengers
    this.passengers = data.passengers || [{ type: PassengerType.ADT, count: 1 }];
    
    // Localization
    this.language = data.language || Language.ENGLISH;
    this.country = data.country || CountryCode.GHANA;
    this.currency = data.currency || Currency.GHS;
    
    // Optional filters
    this.preferredAirlines = data.preferredAirlines;
    this.maxStops = data.maxStops;
    this.maxPrice = data.maxPrice;
  }
}

// Passenger Information DTO
export class PassengerInfo {
  type: PassengerType;
  count: number;

  constructor(type: PassengerType, count: number) {
    this.type = type;
    this.count = count;
  }
}

// Multi-city Flight Request DTO
export class MultiCityFlightRequestDto {
  journeys: FlightJourneyDto[];
  passengers: PassengerInfo[];
  cabinClass: CabinClass;
  language: Language;
  country: CountryCode;
  currency: Currency;

  constructor(data: any) {
    this.journeys = data.journeys.map((journey: any) => new FlightJourneyDto(journey));
    this.passengers = data.passengers || [{ type: PassengerType.ADT, count: 1 }];
    this.cabinClass = data.cabinClass || CabinClass.ECO;
    this.language = data.language || Language.ENGLISH;
    this.country = data.country || CountryCode.GHANA;
    this.currency = data.currency || Currency.GHS;
  }
}

// Flight Journey DTO (for multi-city)
export class FlightJourneyDto {
  origin: string;
  destination: string;
  departureDate: string;

  constructor(data: any) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.departureDate = data.departureDate;
  }
}

// GOL API Flight Deal Response DTO (based on actual API structure)
export class GolApiFlightDealResponse {
  specialOfferId: string;
  type: string;
  marketingAirline: string;
  origin: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  price: string;
  currency: Currency;
  
  // Enriched data from CodeBook
  originName?: string;
  destinationName?: string;
  airlineName?: string;
  airlineLogo?: string;

  constructor(deal: any, codeBook?: any) {
    this.specialOfferId = deal.SpecialOfferId;
    this.type = deal.Type;
    this.marketingAirline = deal.MarketingAirline;
    this.origin = deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Origin;
    this.destination = deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Destination;
    this.dateFrom = deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.DateRange?.DateFrom;
    this.dateTo = deal.SpecialOfferSteps?.SpecialOfferStep?.[0]?.DateRange?.DateTo;
    this.price = deal.SummaryPrice?.FullPrice;
    this.currency = Currency.GHS;
    
    // Enrich with CodeBook data if available
    if (codeBook) {
      const airports = codeBook.Airports?.Airport || [];
      const airlines = codeBook.TransportCompanies?.TransportCompany || [];
      
      const originAirport = airports.find((apt: any) => apt.Code === this.origin);
      const destinationAirport = airports.find((apt: any) => apt.Code === this.destination);
      const airline = airlines.find((arl: any) => arl.Code === this.marketingAirline);
      
      this.originName = originAirport?.$t;
      this.destinationName = destinationAirport?.$t;
      this.airlineName = airline?.Name?.$t;
      this.airlineLogo = airline?.LogoUrl?.$t;
    }
  }
}

// GOL API Destination Response DTO
export class GolApiDestinationResponse {
  code: string;
  name: string;
  parent?: string;
  country: string;
  state?: string;
  category: AirportCategory;
  showCode: boolean;

  constructor(destination: any, airport: any) {
    this.code = destination.Destination;
    this.parent = destination.Parent;
    this.showCode = destination.ShowCode === 'true';
    
    // Get details from airport CodeBook
    this.name = airport?.$t || destination.Destination;
    this.country = airport?.Country || '';
    this.state = airport?.State || '';
    this.category = airport?.Category || AirportCategory.AIRPORT;
  }
}

// Flight Booking Request DTO
export class FlightBookingRequestDto {
  // Flight details
  flightOfferId: string;
  flightType: FlightType;
  
  // Passenger details
  passengers: PassengerDetailsDto[];
  
  // Contact information
  contactEmail: string;
  contactPhone: string;
  
  // Preferences
  seatPreferences?: SeatPreferenceDto[];
  mealPreferences?: MealPreferenceDto[];
  
  // Special requests
  specialRequests?: string;
  
  // Payment preference
  currency: Currency;

  constructor(data: any) {
    this.flightOfferId = data.flightOfferId;
    this.flightType = data.flightType;
    this.passengers = data.passengers.map((p: any) => new PassengerDetailsDto(p));
    this.contactEmail = data.contactEmail;
    this.contactPhone = data.contactPhone;
    this.seatPreferences = data.seatPreferences?.map((s: any) => new SeatPreferenceDto(s));
    this.mealPreferences = data.mealPreferences?.map((m: any) => new MealPreferenceDto(m));
    this.specialRequests = data.specialRequests;
    this.currency = data.currency || Currency.GHS;
  }
}

// Passenger Details DTO
export class PassengerDetailsDto {
  type: PassengerType;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: CountryCode;
  passportNumber?: string;
  passportExpiry?: string;
  email?: string;
  phone?: string;

  constructor(data: any) {
    this.type = data.type;
    this.title = data.title;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.nationality = data.nationality;
    this.passportNumber = data.passportNumber;
    this.passportExpiry = data.passportExpiry;
    this.email = data.email;
    this.phone = data.phone;
  }
}

// Seat Preference DTO
export class SeatPreferenceDto {
  passengerId: string;
  preference: SeatPreference;
  specificSeat?: string;

  constructor(data: any) {
    this.passengerId = data.passengerId;
    this.preference = data.preference;
    this.specificSeat = data.specificSeat;
  }
}

// Meal Preference DTO
export class MealPreferenceDto {
  passengerId: string;
  mealType: MealType;
  allergies?: string[];
  specialInstructions?: string;

  constructor(data: any) {
    this.passengerId = data.passengerId;
    this.mealType = data.mealType;
    this.allergies = data.allergies;
    this.specialInstructions = data.specialInstructions;
  }
}

// Flight Booking Response DTO
export class FlightBookingResponseDto {
  bookingId: string;
  bookingReference: string;
  status: BookingStatus;
  totalAmount: number;
  currency: Currency;
  flightDetails: BookedFlightDetailsDto;
  passengers: PassengerDetailsDto[];
  paymentDueDate: string;
  createdAt: string;

  constructor(data: any) {
    this.bookingId = data.bookingId;
    this.bookingReference = data.bookingReference;
    this.status = data.status;
    this.totalAmount = data.totalAmount;
    this.currency = data.currency;
    this.flightDetails = new BookedFlightDetailsDto(data.flightDetails);
    this.passengers = data.passengers.map((p: any) => new PassengerDetailsDto(p));
    this.paymentDueDate = data.paymentDueDate;
    this.createdAt = data.createdAt;
  }
}

// Booked Flight Details DTO
export class BookedFlightDetailsDto {
  flightNumber: string;
  airline: string;
  airlineName: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  departureDateTime: string;
  arrivalDateTime: string;
  duration: string;
  cabinClass: CabinClass;
  stops: number;
  status: FlightStatus;

  constructor(data: any) {
    this.flightNumber = data.flightNumber;
    this.airline = data.airline;
    this.airlineName = data.airlineName;
    this.origin = data.origin;
    this.destination = data.destination;
    this.originName = data.originName;
    this.destinationName = data.destinationName;
    this.departureDateTime = data.departureDateTime;
    this.arrivalDateTime = data.arrivalDateTime;
    this.duration = data.duration;
    this.cabinClass = data.cabinClass;
    this.stops = data.stops;
    this.status = data.status;
  }
}

// Flight Deal Category Response DTO
export class FlightDealCategoryResponseDto {
  id: string;
  name: string;
  category: FlightDealCategory;
  description: string;
  image?: string;
  dealCount: number;
  isActive: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.description = data.description;
    this.image = data.image;
    this.dealCount = data.dealCount;
    this.isActive = data.isActive;
  }
}

// Legacy DTOs (kept for backward compatibility)
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
