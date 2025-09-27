import {
  FlightType,
  CabinClass,
  PassengerType,
  Currency,
  Language,
  CountryCode,
  ToleranceDays,
  BookingStatus,
  FlightStatus,
  Airlines,
  WestAfricanAirports,
  InternationalAirports
} from '../enums/flights.enum';

/**
 * Example API Request/Response structures for documentation and testing
 */

// Example Flight Search Request
export const ExampleFlightSearchRequest = {
  basic: {
    origin: WestAfricanAirports.ACCRA,
    destination: InternationalAirports.LONDON_HEATHROW,
    departureDate: "2025-12-15",
    flightType: FlightType.ONE_WAY,
    cabinClass: CabinClass.ECONOMY,
    directFlightsOnly: false,
    toleranceDays: ToleranceDays.NONE,
    passengers: [
      {
        type: PassengerType.ADULT,
        count: 1
      }
    ],
    language: Language.ENGLISH,
    country: CountryCode.CZECH_REPUBLIC,
    currency: Currency.GHS
  },
  roundTrip: {
    origin: WestAfricanAirports.ACCRA,
    destination: InternationalAirports.NEW_YORK_JFK,
    departureDate: "2025-12-20",
    returnDate: "2026-01-05",
    flightType: FlightType.RETURN,
    cabinClass: CabinClass.BUSINESS,
    directFlightsOnly: false,
    toleranceDays: ToleranceDays.TWO_DAYS,
    passengers: [
      {
        type: PassengerType.ADULT,
        count: 2
      },
      {
        type: PassengerType.CHILD,
        count: 1
      }
    ],
    language: Language.ENGLISH,
    country: CountryCode.CZECH_REPUBLIC,
    currency: Currency.USD,
    preferredAirlines: [Airlines.BRITISH_AIRWAYS, Airlines.VIRGIN_ATLANTIC],
    maxStops: 1,
    maxPrice: 5000
  },
  multiCity: {
    journeys: [
      {
        origin: WestAfricanAirports.ACCRA,
        destination: InternationalAirports.LONDON_HEATHROW,
        departureDate: "2025-12-15"
      },
      {
        origin: InternationalAirports.LONDON_HEATHROW,
        destination: InternationalAirports.PARIS_CDG,
        departureDate: "2025-12-20"
      },
      {
        origin: InternationalAirports.PARIS_CDG,
        destination: WestAfricanAirports.ACCRA,
        departureDate: "2025-12-25"
      }
    ],
    passengers: [
      {
        type: PassengerType.ADULT,
        count: 1
      }
    ],
    cabinClass: CabinClass.PREMIUM_ECONOMY,
    language: Language.ENGLISH,
    country: CountryCode.CZECH_REPUBLIC,
    currency: Currency.EUR
  }
};

// Example Flight Booking Request
export const ExampleFlightBookingRequest = {
  basic: {
    flightOfferId: "FL123456789",
    flightType: FlightType.ROUND_TRIP,
    passengers: [
      {
        type: PassengerType.ADULT,
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-05-15",
        nationality: CountryCode.GHANA,
        passportNumber: "G1234567",
        passportExpiry: "2028-05-15",
        email: "john.doe@example.com",
        phone: "+233241234567"
      },
      {
        type: PassengerType.ADULT,
        title: "Mrs",
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "1987-08-22",
        nationality: CountryCode.GHANA,
        passportNumber: "G2345678",
        passportExpiry: "2029-08-22",
        email: "jane.doe@example.com",
        phone: "+233241234568"
      }
    ],
    contactEmail: "booking@example.com",
    contactPhone: "+233241234567",
    seatPreferences: [
      {
        passengerId: "passenger1",
        preference: "window"
      },
      {
        passengerId: "passenger2",
        preference: "aisle"
      }
    ],
    mealPreferences: [
      {
        passengerId: "passenger1",
        mealType: "vegetarian"
      },
      {
        passengerId: "passenger2",
        mealType: "standard"
      }
    ],
    specialRequests: "Wheelchair assistance required for passenger 2",
    currency: Currency.GHS
  }
};

// Example API Responses
export const ExampleFlightDealsResponse = {
  status: true,
  message: "Flight deals retrieved successfully",
  data: {
    GolApi: {
      SecurityContent: "grznguklO9QG6BrwGGw=",
      PassiveSessionId: "116417370",
      Settings: {
        Localization: {
          Language: "en",
          Country: "CZ"
        },
        Currency: {
          Code: "GHS"
        }
      },
      CodeBook: {
        Airports: {
          Airport: [
            {
              Code: WestAfricanAirports.ACCRA,
              Parent: "",
              Country: CountryCode.GHANA,
              State: "",
              $t: "Accra - Kotoka"
            },
            {
              Code: WestAfricanAirports.ABIDJAN,
              Parent: "",
              Country: "CI",
              State: "",
              $t: "Abidjan - Felix Houphouet Boigny"
            }
          ]
        },
        TransportCompanies: {
          TransportCompany: [
            {
              Type: "company",
              Code: Airlines.SOUTH_AFRICAN_AIRWAYS,
              AllianceId: "/*A",
              Name: {
                $t: "SOUTH AFRICAN AIRWAYS"
              },
              LogoUrl: {
                $t: "https://fs.golibe.com/cache/ao-467170-SA.png"
              }
            }
          ]
        }
      },
      ResponseDetail: {
        ListSpecialoffersResponse_1: {
          ListSpecialoffers: {
            SpecialofferItem: [
              {
                SpecialOfferId: "46461",
                Type: "flight",
                MarketingAirline: Airlines.SOUTH_AFRICAN_AIRWAYS,
                SpecialOfferSteps: {
                  SpecialOfferStep: [
                    {
                      Origin: WestAfricanAirports.ACCRA,
                      Destination: WestAfricanAirports.ABIDJAN,
                      DateRange: {
                        DateFrom: "2025-09-01",
                        DateTo: "2025-11-30"
                      }
                    }
                  ]
                },
                SummaryPrice: {
                  FullPrice: "3335.00"
                }
              }
            ]
          }
        }
      }
    }
  }
};

export const ExampleDestinationSearchResponse = {
  status: true,
  message: "Destinations retrieved successfully",
  data: {
    GolApi: {
      SecurityContent: "DKr2WcxUDvpzrqORfnLS6Qk=",
      PassiveSessionId: "116417370",
      Settings: {
        Localization: {
          Language: "en",
          Country: "CZ"
        }
      },
      CodeBook: {
        Airports: {
          Airport: [
            {
              Code: "LAX+",
              Parent: "",
              Country: CountryCode.UNITED_STATES,
              State: "CA",
              Category: "CITY",
              $t: "Los Angeles"
            },
            {
              Code: "LAX",
              Parent: "LAX+",
              Country: CountryCode.UNITED_STATES,
              State: "CA",
              Category: "AIRPORT",
              $t: "Los Angeles"
            }
          ]
        }
      },
      ResponseDetail: {
        SearchDestinationsResponse_1: {
          SearchedAirports: {
            SearchedAirport: [
              {
                Destination: "LAX+",
                Parent: "",
                ShowCode: "false"
              },
              {
                Destination: "LAX",
                Parent: "LAX+",
                ShowCode: "true"
              }
            ]
          }
        }
      }
    }
  }
};

export const ExampleFlightBookingResponse = {
  status: true,
  message: "Flight booking created successfully",
  data: {
    bookingId: "BK123456789",
    bookingReference: "MC2025ABC123",
    status: BookingStatus.PENDING,
    totalAmount: 2500.00,
    currency: Currency.GHS,
    flightDetails: {
      flightNumber: "BA081",
      airline: Airlines.BRITISH_AIRWAYS,
      airlineName: "British Airways",
      origin: WestAfricanAirports.ACCRA,
      destination: InternationalAirports.LONDON_HEATHROW,
      originName: "Accra - Kotoka",
      destinationName: "London - Heathrow",
      departureDateTime: "2025-12-15T23:40:00",
      arrivalDateTime: "2025-12-16T06:25:00",
      duration: "6h 45m",
      cabinClass: CabinClass.ECONOMY,
      stops: 0,
      status: FlightStatus.ON_TIME
    },
    passengers: [
      {
        type: PassengerType.ADULT,
        title: "Mr",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-05-15",
        nationality: CountryCode.GHANA,
        passportNumber: "G1234567",
        passportExpiry: "2028-05-15",
        email: "john.doe@example.com",
        phone: "+233241234567"
      }
    ],
    paymentDueDate: "2025-10-15T23:59:59",
    createdAt: "2025-09-26T10:30:00"
  }
};

// Validation Error Examples
export const ExampleValidationErrors = {
  invalidAirportCode: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "origin",
        message: "Invalid airport code format. Must be 3 uppercase letters.",
        code: "INVALID_AIRPORT_CODE"
      }
    ]
  },
  invalidDateFormat: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "departureDate",
        message: "Invalid date format. Must be YYYY-MM-DD.",
        code: "INVALID_DATE_FORMAT"
      }
    ]
  },
  pastDate: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "departureDate",
        message: "Departure date cannot be in the past.",
        code: "PAST_DATE"
      }
    ]
  },
  invalidReturnDate: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "returnDate",
        message: "Return date must be after departure date.",
        code: "INVALID_RETURN_DATE"
      }
    ]
  },
  invalidPassengerCount: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "passengers",
        message: "Passenger count must be between 1 and 9.",
        code: "INVALID_PASSENGER_COUNT"
      }
    ]
  },
  invalidEmail: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "contactEmail",
        message: "Invalid email format.",
        code: "INVALID_EMAIL"
      }
    ]
  },
  invalidPassport: {
    status: false,
    message: "Validation failed",
    errors: [
      {
        field: "passportNumber",
        message: "Invalid passport number format.",
        code: "INVALID_PASSPORT"
      },
      {
        field: "passportExpiry",
        message: "Passport must be valid for at least 6 months from travel date.",
        code: "INVALID_PASSPORT_EXPIRY"
      }
    ]
  }
};

// Common airport and airline mappings for quick reference
export const CommonMappings = {
  airports: {
    popular: [
      { code: WestAfricanAirports.ACCRA, name: "Accra - Kotoka International", country: "Ghana" },
      { code: WestAfricanAirports.LAGOS, name: "Lagos - Murtala Muhammed International", country: "Nigeria" },
      { code: InternationalAirports.LONDON_HEATHROW, name: "London - Heathrow", country: "United Kingdom" },
      { code: InternationalAirports.NEW_YORK_JFK, name: "New York - John F. Kennedy International", country: "United States" },
      { code: InternationalAirports.DUBAI, name: "Dubai International", country: "United Arab Emirates" },
      { code: InternationalAirports.PARIS_CDG, name: "Paris - Charles de Gaulle", country: "France" }
    ]
  },
  airlines: {
    popular: [
      { code: Airlines.BRITISH_AIRWAYS, name: "British Airways", alliance: "Oneworld" },
      { code: Airlines.VIRGIN_ATLANTIC, name: "Virgin Atlantic", alliance: "SkyTeam" },
      { code: Airlines.KLM, name: "KLM Royal Dutch Airlines", alliance: "SkyTeam" },
      { code: Airlines.LUFTHANSA, name: "Lufthansa", alliance: "Star Alliance" },
      { code: Airlines.EMIRATES, name: "Emirates", alliance: "Independent" },
      { code: Airlines.TURKISH_AIRLINES, name: "Turkish Airlines", alliance: "Star Alliance" }
    ]
  },
  currencies: {
    [Currency.GHS]: { symbol: "₵", name: "Ghanaian Cedi" },
    [Currency.USD]: { symbol: "$", name: "US Dollar" },
    [Currency.EUR]: { symbol: "€", name: "Euro" },
    [Currency.GBP]: { symbol: "£", name: "British Pound" }
  }
};