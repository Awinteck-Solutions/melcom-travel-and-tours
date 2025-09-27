import { 
  FlightType, 
  CabinClass, 
  PassengerType, 
  Currency, 
  Language, 
  CountryCode,
  ToleranceDays,
  WestAfricanAirports,
  InternationalAirports,
  Airlines
} from '../enums/flights.enum';

/**
 * Validation utilities for flight-related data
 */
export class FlightValidationUtils {
  
  /**
   * Validate airport code format (3 letters)
   */
  static isValidAirportCode(code: string): boolean {
    return /^[A-Z]{3}$/.test(code);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  static isValidDateFormat(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  /**
   * Check if date is not in the past
   */
  static isValidFutureDate(date: string): boolean {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format (basic international format)
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate passenger count (1-9 passengers typical limit)
   */
  static isValidPassengerCount(count: number): boolean {
    return count >= 1 && count <= 9;
  }

  /**
   * Get all valid airport codes
   */
  static getAllAirportCodes(): string[] {
    return [
      ...Object.values(WestAfricanAirports),
      ...Object.values(InternationalAirports)
    ];
  }

  /**
   * Get all valid airline codes
   */
  static getAllAirlineCodes(): string[] {
    return Object.values(Airlines);
  }

  /**
   * Check if airport code is supported
   */
  static isSupportedAirport(code: string): boolean {
    return this.getAllAirportCodes().includes(code as any);
  }

  /**
   * Check if airline code is supported
   */
  static isSupportedAirline(code: string): boolean {
    return this.getAllAirlineCodes().includes(code as any);
  }

  /**
   * Validate return date is after departure date
   */
  static isValidReturnDate(departureDate: string, returnDate: string): boolean {
    const dep = new Date(departureDate);
    const ret = new Date(returnDate);
    return ret > dep;
  }

  /**
   * Get default currency based on country
   */
  static getDefaultCurrency(country: CountryCode): Currency {
    switch (country) {
      case CountryCode.GHANA:
        return Currency.GHS;
      case CountryCode.UNITED_KINGDOM:
        return Currency.GBP;
      case CountryCode.UNITED_STATES:
        return Currency.USD;
      case CountryCode.GERMANY:
      case CountryCode.FRANCE:
      case CountryCode.CZECH_REPUBLIC:
        return Currency.EUR;
      default:
        return Currency.USD;
    }
  }

  /**
   * Format price with currency symbol
   */
  static formatPrice(amount: number, currency: Currency): string {
    const symbols = {
      [Currency.GHS]: '₵',
      [Currency.USD]: '$',
      [Currency.EUR]: '€',
      [Currency.GBP]: '£'
    };
    
    return `${symbols[currency]}${amount.toLocaleString()}`;
  }

  /**
   * Calculate age from date of birth
   */
  static calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Determine passenger type based on age
   */
  static getPassengerTypeByAge(age: number): PassengerType {
    if (age < 2) return PassengerType.INFANT;
    if (age < 12) return PassengerType.CHILD;
    return PassengerType.ADULT;
  }

  /**
   * Get GOL API passenger code
   */
  static getGolApiPassengerCode(type: PassengerType): string {
    return type; // PassengerType enum already uses GOL API codes
  }

  /**
   * Format duration from minutes to readable format
   */
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  /**
   * Parse duration string to minutes
   */
  static parseDurationToMinutes(duration: string): number {
    const regex = /(?:(\d+)h)?\s*(?:(\d+)m)?/;
    const match = duration.match(regex);
    
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    
    return hours * 60 + minutes;
  }

  /**
   * Generate booking reference
   */
  static generateBookingReference(prefix: string = 'MC'): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Validate passport number format (basic validation)
   */
  static isValidPassportNumber(passport: string): boolean {
    // Basic format: 1-2 letters followed by 6-9 digits or alphanumeric
    const passportRegex = /^[A-Z]{1,2}[0-9A-Z]{6,9}$/;
    return passportRegex.test(passport);
  }

  /**
   * Check if passport expiry is valid (at least 6 months from now)
   */
  static isValidPassportExpiry(expiryDate: string): boolean {
    const expiry = new Date(expiryDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    return expiry > sixMonthsFromNow;
  }
}

/**
 * GOL API payload builders
 */
export class GolApiPayloadBuilder {
  
  /**
   * Build basic GOL API structure
   */
  static buildBasePayload(language: Language = Language.ENGLISH, country: CountryCode = CountryCode.CZECH_REPUBLIC): any {
    return {
      GolApi: {
        PassiveSessionId: "116417370",
        Authorization: {
          Requestor: {
            ClientId: process.env.GOL_API_CLIENT_ID,
            Password: process.env.GOL_API_PASSWORD,
          },
        },
        Settings: {
          Localization: {
            Language: language,
            Country: country,
          },
        },
      },
    };
  }

  /**
   * Build flight search payload
   */
  static buildFlightSearchPayload(searchRequest: any): any {
    const basePayload = this.buildBasePayload(searchRequest.language, searchRequest.country);
    
    // Build passengers array for GOL API
    const passengers = searchRequest.passengers.map((p: any) => ({
      Code: p.type,
      Quantity: p.count.toString(),
    }));

    basePayload.GolApi.RequestDetail = {
      SearchFlightsExtendedRequest_2: {
        FlightSteps: {
          FlightStep: [
            {
              Origin: searchRequest.origin,
              Destination: searchRequest.destination,
              DepartureDateTime: searchRequest.departureDate,
            },
          ],
        },
        SearchedPassengers: {
          SearchedPassenger: passengers,
        },
        FlightPreferences: {
          IncludeCombinedFlights: {},
          // Add direct flights filter if specified
          ...(searchRequest.directFlightsOnly && {
            MaxStops: "0"
          }),
          // Add cabin class preference
          ...(searchRequest.cabinClass && {
            CabinClass: searchRequest.cabinClass.toUpperCase()
          }),
        },
      },
    };

    // Add return flight if specified
    if (searchRequest.flightType === FlightType.RETURN && searchRequest.returnDate) {
      basePayload.GolApi.RequestDetail.SearchFlightsExtendedRequest_2.FlightSteps.FlightStep.push({
        Origin: searchRequest.destination,
        Destination: searchRequest.origin,
        DepartureDateTime: searchRequest.returnDate,
      });
    }

    return basePayload;
  }

  /**
   * Build destination search payload
   */
  static buildDestinationSearchPayload(query: string, language: Language = Language.ENGLISH): any {
    const basePayload = this.buildBasePayload(language);
    
    basePayload.GolApi.RequestDetail = {
      SearchDestinationsRequest_1: {
        SearchPattern: {
          $t: query,
          SearchType: "flight",
        },
      },
    };

    return basePayload;
  }

  /**
   * Build special offers payload
   */
  static buildSpecialOffersPayload(language: Language = Language.ENGLISH): any {
    const basePayload = this.buildBasePayload(language);
    
    basePayload.GolApi.RequestDetail = {
      ListSpecialoffersRequest_1: {
        SpecialofferTypes: {
          SpecialofferType: {
            Code: "flight",
          },
        },
      },
    };

    return basePayload;
  }
}

/**
 * Response transformation utilities
 */
export class ResponseTransformUtils {
  
  /**
   * Transform GOL API special offers to standardized format
   */
  static transformSpecialOffers(golApiResponse: any): any[] {
    const offers = golApiResponse?.GolApi?.ResponseDetail?.ListSpecialoffersResponse_1?.ListSpecialoffers?.SpecialofferItem || [];
    const codeBook = golApiResponse?.GolApi?.CodeBook;
    
    return offers.map((offer: any) => {
      // Create enriched offer with CodeBook data
      const enrichedOffer = {
        id: offer.SpecialOfferId,
        type: offer.Type,
        airline: {
          code: offer.MarketingAirline,
          name: this.getAirlineName(offer.MarketingAirline, codeBook),
          logo: this.getAirlineLogo(offer.MarketingAirline, codeBook),
        },
        route: {
          origin: {
            code: offer.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Origin,
            name: this.getAirportName(offer.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Origin, codeBook),
          },
          destination: {
            code: offer.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Destination,
            name: this.getAirportName(offer.SpecialOfferSteps?.SpecialOfferStep?.[0]?.Destination, codeBook),
          },
        },
        dateRange: {
          from: offer.SpecialOfferSteps?.SpecialOfferStep?.[0]?.DateRange?.DateFrom,
          to: offer.SpecialOfferSteps?.SpecialOfferStep?.[0]?.DateRange?.DateTo,
        },
        price: {
          amount: parseFloat(offer.SummaryPrice?.FullPrice || '0'),
          currency: Currency.GHS,
          formatted: FlightValidationUtils.formatPrice(parseFloat(offer.SummaryPrice?.FullPrice || '0'), Currency.GHS),
        },
      };
      
      return enrichedOffer;
    });
  }

  /**
   * Get airline name from CodeBook
   */
  private static getAirlineName(code: string, codeBook: any): string {
    const airlines = codeBook?.TransportCompanies?.TransportCompany || [];
    const airline = airlines.find((a: any) => a.Code === code);
    return airline?.Name?.$t || code;
  }

  /**
   * Get airline logo from CodeBook
   */
  private static getAirlineLogo(code: string, codeBook: any): string | null {
    const airlines = codeBook?.TransportCompanies?.TransportCompany || [];
    const airline = airlines.find((a: any) => a.Code === code);
    return airline?.LogoUrl?.$t || null;
  }

  /**
   * Get airport name from CodeBook
   */
  private static getAirportName(code: string, codeBook: any): string {
    const airports = codeBook?.Airports?.Airport || [];
    const airport = airports.find((a: any) => a.Code === code);
    return airport?.$t || code;
  }

  /**
   * Transform destination search results
   */
  static transformDestinationResults(golApiResponse: any): any[] {
    const searchedAirports = golApiResponse?.GolApi?.ResponseDetail?.SearchDestinationsResponse_1?.SearchedAirports?.SearchedAirport || [];
    const codeBook = golApiResponse?.GolApi?.CodeBook;
    
    return searchedAirports.map((searched: any) => {
      const airportDetails = this.getAirportDetails(searched.Destination, codeBook);
      
      return {
        code: searched.Destination,
        name: airportDetails.name,
        country: airportDetails.country,
        state: airportDetails.state,
        category: airportDetails.category,
        parent: searched.Parent,
        showCode: searched.ShowCode === 'true',
      };
    });
  }

  /**
   * Get airport details from CodeBook
   */
  private static getAirportDetails(code: string, codeBook: any): any {
    const airports = codeBook?.Airports?.Airport || [];
    const airport = airports.find((a: any) => a.Code === code);
    
    return {
      name: airport?.$t || code,
      country: airport?.Country || '',
      state: airport?.State || '',
      category: airport?.Category || 'AIRPORT',
    };
  }
}