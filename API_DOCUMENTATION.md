# Melcom Travel & Tours API Documentation

## Overview

The Melcom Travel & Tours API is a comprehensive flight booking system integrated with the GOL (Golibe) API platform. It provides real-time flight search, deals, booking management, and utility services.

## Base URL

```
Development: http://localhost:4000
Production: https://api.melcomtravel.com
```

## API Features

### ✈️ Flight Search
- **One-way flights** - Search for single-direction flights
- **Return flights** - Search for round-trip flights  
- **Multi-city flights** - Search for complex multi-destination itineraries

### 🎯 Flight Deals
- **Promotional offers** - Get current flight deals and special offers
- **Deal categories** - Browse deals by category
- **Deal details** - Get specific deal information

### 📋 Flight Booking
- **Create bookings** - Book selected flights
- **Booking management** - View and manage existing bookings

### 🛠️ Utilities
- **Airport search** - Find airports by name, city, or IATA code

## Authentication

Currently, the API uses server-side GOL API credentials. No client authentication is required for public endpoints.

## Quick Start

### 1. Flight Search Examples

#### One-way Flight Search
```bash
curl -X POST "http://localhost:4000/flights/search" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "ACC",
    "destination": "ABJ", 
    "departureDate": "2025-11-15",
    "passengers": "ADT",
    "tripType": "oneway"
  }'
```

#### Return Flight Search
```bash
curl -X POST "http://localhost:4000/flights/search" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "ACC",
    "destination": "ABJ",
    "departureDate": "2025-11-15", 
    "returnDate": "2025-11-20",
    "passengers": "ADT",
    "tripType": "return"
  }'
```

#### Multi-city Flight Search
```bash
curl -X POST "http://localhost:4000/flights/search" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "ACC",
    "destinations": "ABJ,LFW",
    "departureDates": "2025-11-15,2025-11-18",
    "passengers": "ADT", 
    "tripType": "multicity"
  }'
```

### 2. Flight Deals
```bash
# Get all flight deals
curl "http://localhost:4000/flight-deals"

# Get deals by category
curl "http://localhost:4000/flight-deals?category=promotional"

# Get specific deal
curl "http://localhost:4000/flight-deals/12345"
```

### 3. Airport Search
```bash
# Search airports
curl "http://localhost:4000/airports?search=london"
curl "http://localhost:4000/airports?search=ACC"
```

## Data Types & Enums

### Passenger Types
| Code | Description | Age Range |
|------|-------------|-----------|
| `ADT` | Adults | 25-59 years |
| `CHD` | Children | 2-11 years (up to 18) |
| `INF` | Infants | Up to 2 years |
| `YTH` | Youth | 12-24 years |
| `YCD` | Seniors | 60+ years |

### Cabin Classes
| Code | Description |
|------|-------------|
| `ECO` | Economy class |
| `PRE` | Premium economy class |
| `BUS` | Business class |
| `1ST` | First class |

### Trip Types
| Type | Description |
|------|-------------|
| `oneway` | One way trip |
| `return` | Return trip |
| `multicity` | Multi-city trip |
| `two_one_ways` | Two separate one-way tickets |
| `special_offers` | Special offer deals |

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "search_params": {
    // Echo of request parameters (for search endpoints)
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Flight Search Response

The flight search response contains real-time data from the GOL API:

```json
{
  "success": true,
  "message": "oneway flight search completed successfully",
  "data": {
    "GolApi": {
      "SecurityContent": "...",
      "PassiveSessionId": "...",
      "Settings": {
        "Localization": {
          "Language": "en",
          "Country": "CZ"
        },
        "Currency": {
          "Code": "GHS"
        }
      },
      "ResponseDetail": {
        "SearchFlightsExtendedResponse_2": {
          "FlightOffers": [
            {
              "FlightOffer": [
                {
                  "Process": "dynamicBook",
                  "Source": "GALILEO",
                  "PricingDetails": {
                    "PricingDetail": [
                      {
                        "FlightPricing": {
                          "FlightPrice": {
                            "FullPrice": "3251.00",
                            "DisplayPricePerPassenger": "3251.00"
                          }
                        }
                      }
                    ]
                  },
                  "FlightItinerary": {
                    "FlightStream": [
                      {
                        "FlightOption": [
                          {
                            "DepartureDateTime": "2025-11-15T16:00:00",
                            "ArrivalDateTime": "2025-11-15T17:00:00",
                            "FlightSegments": {
                              "FlightSegment": [
                                {
                                  "FlightNumber": "56",
                                  "OriginAirport": "ACC",
                                  "DestinationAirport": "ABJ",
                                  "MarketingAirline": "SA",
                                  "CabinClass": "Economy"
                                }
                              ]
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }
}
```

## Common Airport Codes

### West Africa
| Code | Airport | City | Country |
|------|---------|------|---------|
| `ACC` | Kotoka International | Accra | Ghana |
| `ABJ` | Félix-Houphouët-Boigny | Abidjan | Côte d'Ivoire |
| `LFW` | Gnassingbé Eyadéma International | Lomé | Togo |
| `COO` | Cadjehoun | Cotonou | Benin |
| `LOS` | Murtala Muhammed International | Lagos | Nigeria |

### International
| Code | Airport | City | Country |
|------|---------|------|---------|
| `LHR` | Heathrow | London | UK |
| `CDG` | Charles de Gaulle | Paris | France |
| `JFK` | John F. Kennedy International | New York | USA |
| `DXB` | Dubai International | Dubai | UAE |
| `ADD` | Addis Ababa Bole International | Addis Ababa | Ethiopia |

## Rate Limits

Currently, no rate limits are enforced, but please use the API responsibly.

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid parameters |
| `404` | Not Found - Resource doesn't exist |
| `500` | Internal Server Error - Server-side error |

## Testing with Postman

You can import the OpenAPI specification (`openapi.yaml`) into Postman to generate a collection with all endpoints and examples.

## Support

For API support and questions:
- Email: info@awinteck.com
- Documentation: This file and `openapi.yaml`

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Flight search (one-way, return, multi-city)
- Flight deals integration
- Airport search functionality
- Real-time GOL API integration
- Comprehensive error handling

## Examples

### Successful Flight Search Result
When searching for flights from ACC to ABJ, you might get results like:

- **South African Airways (SA)** - Flight 56: 3,251.00 GHS
- **Emirates (EK)** - Flight 787: 3,339.00 GHS  
- **Air Côte d'Ivoire (HF)** - Flight 501: 5,098.00 GHS

### Flight Deals Example
Promotional deals might include:
- ACC to ABJ: Starting from 3,341 GHS
- ACC to LBV: Starting from 8,447 GHS
- ACC to NSI: Starting from 10,382 GHS

### Airport Search Example
Searching for "london" returns:
- LHR - London Heathrow
- LGW - London Gatwick  
- STN - London Stansted
- LTN - London Luton
- LCY - London City Airport

---

*This documentation is for the Melcom Travel & Tours Flight API v1.0.0*