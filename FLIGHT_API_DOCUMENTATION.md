# Melcom Travel Flight API - Data Structures Documentation

## Overview

This document outlines all the enums, DTOs (Data Transfer Objects), and
interfaces used in the Melcom Travel Flight API, which integrates with the GOL
(Golibe) API service. All values have been extracted and validated against the
actual Melcom Golibe website (https://melcom.golibe.com/).

## Enums

### PassengerTypeEnum

Defines the types of passengers based on GOL API specifications and age
categories from the Melcom website.

```typescript
export enum PassengerTypeEnum {
  ADULT = "ADT", // Adults (25-59 years)
  CHILD = "CHD", // Children (2-11 or up to 18 years)
  INFANT = "INF", // Infants (Up to 2 years)
  YOUTH = "YTH", // Youth (12-24 years)
  SENIOR = "YCD", // Seniors (60+ years)
}
```

**Usage**: Used in passenger counting, pricing calculations, and API requests to
GOL.

### CabinClassEnum

Flight cabin classes supported by the Melcom Golibe booking system.

```typescript
export enum CabinClassEnum {
  ECONOMY = "ECO", // Economy class
  PREMIUM_ECONOMY = "PRE", // Premium economy class
  BUSINESS = "BUS", // Business class
  FIRST_CLASS = "1ST", // First class
}
```

**Usage**: Cabin preferences in flight searches and booking requests.

### TripTypeEnum

Trip types supported by the booking system, based on Melcom website constants.

```typescript
export enum TripTypeEnum {
  ONE_WAY = "oneway", // One way trip
  RETURN = "return", // Return trip
  MULTI_CITY = "multicity", // Multi-city trip
  TWO_ONE_WAY = "two_one_ways", // Two separate one-way tickets
  SPECIAL_OFFER = "special_offers", // Special offer deals
}
```

**Usage**: Determines the journey type in flight search requests.

### FlightPreferenceEnum

Flight preference options available on the Melcom website.

```typescript
export enum FlightPreferenceEnum {
  ONLY_DIRECT = "only_direct", // Only direct flights
  ALL_FLIGHTS = "all_flights", // All flights including connections
  PREFERRED_AIRLINES = "preferred_airlines", // Preferred airlines only
}
```

**Usage**: User preferences for flight search filtering.

## Primary DTOs

### FlightSearchDTO

Enhanced flight search request structure that supports all GOL API features.

```typescript
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
}
```

**Key Features:**

- Supports all passenger types (ADT, CHD, INF, YTH, YCD)
- Multi-city flight planning with FlightStep array
- Flexible date search with tolerance
- Airline preferences and price limits
- Direct flight filtering

### PassengerDTO

Comprehensive passenger information structure.

```typescript
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
}
```

**Key Features:**

- Complete passenger profile for booking
- Document validation for international travel
- Special services and preferences
- Frequent flyer program integration

### GOLSearchRequestDTO

Converts user-friendly search parameters to GOL API format.

```typescript
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
}
```

**Key Features:**

- Automatic conversion from FlightSearchDTO
- Support for complex multi-city itineraries
- Passenger type mapping with quantities
- Cabin class preferences with preference levels

## GOL API Integration DTOs

### GOLFlightOptionDto

Represents flight options returned by the GOL API.

```typescript
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
```

### GOLFlightSegmentDto

Individual flight segment details.

```typescript
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
```

## Utility DTOs

### AirportDTO

Airport information for search and display.

```typescript
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
}
```

### FlightDealDTO

Promotional flight deals and special offers.

```typescript
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
}
```

## API Endpoints and Usage

### Flight Search

**Endpoint**: `POST /flights/search`

**Request Body**:

```json
{
  "origin": "ACC",
  "destination": "LHR",
  "departureDate": "2024-02-15",
  "returnDate": "2024-02-22",
  "adults": 2,
  "children": 1,
  "cabin": "ECO",
  "tripType": "return",
  "directFlightsOnly": false,
  "tolerance": 3,
  "currency": "GHS"
}
```

### Multi-City Search

**Request Body**:

```json
{
  "tripType": "multicity",
  "flightSteps": [
    {
      "origin": "ACC",
      "destination": "LHR",
      "date": "2024-02-15"
    },
    {
      "origin": "LHR",
      "destination": "JFK",
      "date": "2024-02-18"
    },
    {
      "origin": "JFK",
      "destination": "ACC",
      "date": "2024-02-25"
    }
  ],
  "adults": 1,
  "cabin": "BUS"
}
```

### Flight Deals

**Endpoint**: `GET /flights/flight-deals?category=domestic`

### Airport Search

**Endpoint**: `GET /flights/airports?search=london`

## Environment Variables

Ensure these GOL API credentials are set:

```env
GOL_API_BASE_URL=https://golapi.golibe.com/json.php
GOL_CLIENT_ID=your_client_id
GOL_PASSWORD=your_password
GOL_PASSIVE_SESSION_ID=your_session_id
```

## Best Practices

1. **Enum Usage**: Always use enums instead of hardcoded strings for consistency
2. **DTO Validation**: Validate all input DTOs before processing
3. **Error Handling**: Handle GOL API errors gracefully with meaningful user
   messages
4. **Caching**: Cache airport and airline data to reduce API calls
5. **Currency**: Default to GHS (Ghanaian Cedi) for local market
6. **Date Formats**: Use ISO 8601 date format (YYYY-MM-DD) consistently

## Future Enhancements

1. **Seat Selection**: Add seat map integration
2. **Baggage**: Dynamic baggage pricing based on airline policies
3. **Payment Integration**: Multiple payment gateway support
4. **Loyalty Programs**: Enhanced frequent flyer integration
5. **Mobile**: PWA support for mobile booking experience
