import {
  PassengerTypeEnum,
  CabinClassEnum,
  TripTypeEnum,
  FlightPreferenceEnum,
} from "../enums";

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

// GOL API Flight Step Interface (for multi-city flights)
export interface FlightStep {
  origin: string;
  destination: string;
  date: string;
}

// Enhanced Flight Search DTO matching GOL API structure
export class FlightSearchDTO {
  // Basic search parameters
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;

  // Passenger counts (using GOL API passenger codes)
  adults: number;
  children?: number;
  infants?: number;
  youth?: number;
  seniors?: number;

  // Flight preferences
  cabin?: CabinClassEnum;
  tripType: TripTypeEnum;
  directFlightsOnly?: boolean;
  flightPreference?: FlightPreferenceEnum;

  // Multi-city specific
  flightSteps?: FlightStep[];

  // Additional preferences from Melcom website
  tolerance?: number; // Days tolerance for flexible dates
  airlines?: string[]; // Preferred airlines
  maxPrice?: number;
  currency?: string;

  constructor(data) {
    this.origin = data.origin;
    this.destination = data.destination;
    this.departureDate = data.departureDate;
    this.returnDate = data.returnDate;
    this.adults = data.adults || 1;
    this.children = data.children || 0;
    this.infants = data.infants || 0;
    this.youth = data.youth || 0;
    this.seniors = data.seniors || 0;
    this.cabin = data.cabin || CabinClassEnum.ECONOMY;
    this.tripType = data.tripType || TripTypeEnum.ONE_WAY;
    this.directFlightsOnly = data.directFlightsOnly || false;
    this.flightPreference =
      data.flightPreference || FlightPreferenceEnum.ALL_FLIGHTS;
    this.flightSteps = data.flightSteps || [];
    this.tolerance = data.tolerance || 0;
    this.airlines = data.airlines || [];
    this.maxPrice = data.maxPrice;
    this.currency = data.currency || "GHS";
  }
}

// Enhanced Passenger DTO matching GOL API and website requirements
export class PassengerDTO {
  // Personal Information
  title: string; // Mr, Ms, Dr, etc.
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passengerType: PassengerTypeEnum;

  // Document Information
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;

  // Contact Information
  email?: string;
  phone?: string;

  // GOL API specific fields
  frequentFlyerNumber?: string;
  specialRequests?: string[];

  // Booking specific
  seatPreference?: string;
  mealPreference?: string;

  constructor(data) {
    this.title = data.title;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.nationality = data.nationality;
    this.passengerType = data.passengerType || PassengerTypeEnum.ADULT;
    this.passportNumber = data.passportNumber;
    this.passportExpiry = data.passportExpiry;
    this.passportCountry = data.passportCountry;
    this.email = data.email;
    this.phone = data.phone;
    this.frequentFlyerNumber = data.frequentFlyerNumber;
    this.specialRequests = data.specialRequests || [];
    this.seatPreference = data.seatPreference;
    this.mealPreference = data.mealPreference;
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

// GOL API Specific Request DTOs
export class GOLSearchRequestDTO {
  JourneyType: number; // 1 = One-way, 2 = Return, 3 = Multi-city
  OriginDestinations: Array<{
    Origin: string;
    Destination: string;
    TravelDate: string;
  }>;
  PassengerTypes: Array<{
    Code: PassengerTypeEnum;
    Quantity: number;
  }>;
  CabinPreferences?: Array<{
    Cabin: CabinClassEnum;
    PreferenceLevel: string;
  }>;
  DirectFlightsOnly?: boolean;
  Airlines?: string[];
  MaxPrice?: number;
  Currency?: string;

  constructor(searchData: FlightSearchDTO) {
    // Set journey type based on trip type
    this.JourneyType = this.mapTripTypeToJourneyType(searchData.tripType);

    // Build origin destinations
    this.OriginDestinations = [];
    if (searchData.flightSteps && searchData.flightSteps.length > 0) {
      // Multi-city
      this.OriginDestinations = searchData.flightSteps.map((step) => ({
        Origin: step.origin,
        Destination: step.destination,
        TravelDate: step.date,
      }));
    } else {
      // Single or return trip
      this.OriginDestinations.push({
        Origin: searchData.origin,
        Destination: searchData.destination,
        TravelDate: searchData.departureDate,
      });

      if (
        searchData.returnDate &&
        searchData.tripType === TripTypeEnum.RETURN
      ) {
        this.OriginDestinations.push({
          Origin: searchData.destination,
          Destination: searchData.origin,
          TravelDate: searchData.returnDate,
        });
      }
    }

    // Build passenger types
    this.PassengerTypes = [];
    if (searchData.adults > 0) {
      this.PassengerTypes.push({
        Code: PassengerTypeEnum.ADULT,
        Quantity: searchData.adults,
      });
    }
    if (searchData.children && searchData.children > 0) {
      this.PassengerTypes.push({
        Code: PassengerTypeEnum.CHILD,
        Quantity: searchData.children,
      });
    }
    if (searchData.infants && searchData.infants > 0) {
      this.PassengerTypes.push({
        Code: PassengerTypeEnum.INFANT,
        Quantity: searchData.infants,
      });
    }
    if (searchData.youth && searchData.youth > 0) {
      this.PassengerTypes.push({
        Code: PassengerTypeEnum.YOUTH,
        Quantity: searchData.youth,
      });
    }
    if (searchData.seniors && searchData.seniors > 0) {
      this.PassengerTypes.push({
        Code: PassengerTypeEnum.SENIOR,
        Quantity: searchData.seniors,
      });
    }

    // Cabin preferences
    if (searchData.cabin) {
      this.CabinPreferences = [
        {
          Cabin: searchData.cabin,
          PreferenceLevel: "Preferred",
        },
      ];
    }

    this.DirectFlightsOnly = searchData.directFlightsOnly;
    this.Airlines = searchData.airlines;
    this.MaxPrice = searchData.maxPrice;
    this.Currency = searchData.currency;
  }

  private mapTripTypeToJourneyType(tripType: TripTypeEnum): number {
    switch (tripType) {
      case TripTypeEnum.ONE_WAY:
        return 1;
      case TripTypeEnum.RETURN:
        return 2;
      case TripTypeEnum.MULTI_CITY:
        return 3;
      default:
        return 1;
    }
  }
}

// Airport DTO for airport search results
export class AirportDTO {
  code: string;
  name: string;
  city: string;
  country: string;
  timezone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };

  constructor(data) {
    this.code = data.code;
    this.name = data.name;
    this.city = data.city;
    this.country = data.country;
    this.timezone = data.timezone;
    this.coordinates = data.coordinates;
  }
}

// Flight Deal DTO for promotional offers
export class FlightDealDTO {
  dealId: string;
  title: string;
  description: string;
  originCity: string;
  destinationCity: string;
  price: {
    amount: number;
    currency: string;
    originalPrice?: number;
  };
  validFrom: string;
  validUntil: string;
  restrictions?: string[];
  imageUrl?: string;

  constructor(data) {
    this.dealId = data.dealId;
    this.title = data.title;
    this.description = data.description;
    this.originCity = data.originCity;
    this.destinationCity = data.destinationCity;
    this.price = data.price;
    this.validFrom = data.validFrom;
    this.validUntil = data.validUntil;
    this.restrictions = data.restrictions || [];
    this.imageUrl = data.imageUrl;
  }
}
