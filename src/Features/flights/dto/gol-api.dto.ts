export interface GolApiRequestDto {
  GolApi: {
    PassiveSessionId: string;
    Authorization: {
      Requestor: {
        ClientId: string;
        Password: string;
      };
    };
    Settings: {
      Localization: {
        Language: string;
        Country: string;
      };
      Currency: {
        Code: string;
      };
      AlternativeCurrency: {
        Code: string;
        ExchangeRate: string;
      };
      PriceGuarantee: {
        Type: string;
      };
    };
    RequestDetail: any; // This will be dynamic based on the request type
  };
}

export interface SearchDestinationsRequestDto {
  SearchDestinationsRequest_1: {
    SearchPattern: {
      SearchType: string;
      $t: string;
    };
  };
}

export interface FlightSearchRequestDto {
  SearchFlightsRequest_1: {
    SearchPattern: {
      TripType: string;
      DepartureLocation: {
        Code: string;
      };
      ArrivalLocation: {
        Code: string;
      };
      DepartureDate: string;
      ReturnDate?: string;
      Passengers: {
        Adults: number;
        Children?: number;
        Infants?: number;
      };
      CabinClass: string;
    };
  };
}

export interface AirportSearchDto {
  searchPattern: string;
  searchType: "flight" | "hotel";
  language?: string;
  country?: string;
  currency?: string;
}

export interface FlightSearchDto {
  from: string;
  to: string;
  departure: string;
  return_date?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabin_class: string;
  trip_type: "oneway" | "roundtrip";
}

// Enhanced GOL API Response DTOs based on real API structure
export interface GOLFlightSegmentDto {
  Departure: {
    AirportCode: string;
    AirportName: string;
    CityCode: string;
    CityName: string;
    DateTime: string;
    Terminal?: string;
  };
  Arrival: {
    AirportCode: string;
    AirportName: string;
    CityCode: string;
    CityName: string;
    DateTime: string;
    Terminal?: string;
  };
  FlightNumber: string;
  AirlineCode: string;
  AirlineName: string;
  AircraftType: string;
  Duration: string;
  CabinClass: string;
  BookingClass: string;
  FareBasis: string;
}

export interface GOLFlightOptionDto {
  OptionId: string;
  TotalPrice: {
    Amount: number;
    Currency: string;
    BaseFare: number;
    Taxes: number;
    Fees: number;
  };
  OutboundSegments: GOLFlightSegmentDto[];
  InboundSegments?: GOLFlightSegmentDto[];
  PassengerPricing: Array<{
    PassengerType: string;
    Quantity: number;
    BaseFare: number;
    Taxes: number;
    Total: number;
  }>;
  Restrictions: {
    Refundable: boolean;
    Changeable: boolean;
    BaggageAllowance: string;
    ValidatingCarrier: string;
  };
  ValidUntil: string;
}

export interface GOLSearchResponseDto {
  SearchId: string;
  TotalResults: number;
  FlightOptions: GOLFlightOptionDto[];
  Errors?: Array<{
    Code: string;
    Message: string;
  }>;
  SearchCriteria: {
    OriginDestinations: any[];
    PassengerTypes: any[];
    CabinPreferences?: any[];
  };
}

// Booking DTOs
export interface GOLBookingRequestDto {
  OptionId: string;
  ContactInformation: {
    Email: string;
    Phone: string;
    Address?: {
      Street: string;
      City: string;
      Country: string;
      PostalCode: string;
    };
  };
  Passengers: Array<{
    PassengerType: string;
    PersonalInfo: {
      Title: string;
      FirstName: string;
      LastName: string;
      DateOfBirth: string;
      Gender: string;
      Nationality: string;
    };
    DocumentInfo: {
      Type: string;
      Number: string;
      ExpiryDate: string;
      IssuingCountry: string;
    };
    ContactInfo?: {
      Email?: string;
      Phone?: string;
    };
    FrequentFlyerInfo?: {
      AirlineCode: string;
      Number: string;
    };
  }>;
  SpecialRequests?: {
    MealPreferences?: string[];
    SeatPreferences?: string[];
    AssistanceRequests?: string[];
    Other?: string;
  };
}

export interface GOLBookingResponseDto {
  BookingReference: string;
  PNR: string;
  Status: string;
  TotalPrice: {
    Amount: number;
    Currency: string;
  };
  BookingDate: string;
  PaymentDeadline: string;
  TicketingDeadline: string;
  FlightDetails: GOLFlightOptionDto;
  PassengerDetails: any[];
  Errors?: Array<{
    Code: string;
    Message: string;
  }>;
}
