// Flight Types (exact values from Melcom website)
export enum FlightType {
  ONE_WAY = 'oneway',
  RETURN = 'return',
  MULTI_CITY = 'multicity',
  TWO_ONE_WAYS = 'two_one_ways',
  SPECIAL_OFFERS = 'special_offers'
}

// Trip Types (alternative)
export enum TripType {
  ONE_WAY = 'ONE_WAY',
  ROUND_TRIP = 'ROUND_TRIP',
  MULTI_CITY = 'MULTI_CITY'
}

// Cabin Classes (exact codes from Melcom website)
export enum CabinClass {
  ECO = 'ECO',         // Economy
  PRE = 'PRE',         // Premium Economy  
  BUS = 'BUS',         // Business
  FIRST = '1ST'        // First Class
}

// Passenger Types (exact codes from Melcom website)
export enum PassengerType {
  ADT = 'ADT',  // Adult (25-59)
  CHD = 'CHD',  // Child (2-11)
  INF = 'INF',  // Infant (Up to 2)
  YTH = 'YTH',  // Youth (12-24) 
  YCD = 'YCD'   // Senior (60+)
}

// Flight Status Enum
export enum FlightStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  DELAYED = 'delayed',
  ON_TIME = 'on-time',
  BOARDING = 'boarding',
  DEPARTED = 'departed',
  ARRIVED = 'arrived'
}

// Booking Status Enum
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REFUNDED = 'refunded'
}

// Currency Enum (exact from Melcom website)
export enum Currency {
  GHS = 'GHS'  // Ghana Cedi (primary currency used)
}

// Language Enum (GOL API supported)
export enum Language {
  ENGLISH = 'en',
  FRENCH = 'fr',
  GERMAN = 'de',
  SPANISH = 'es'
}

// Country Code Enum (GOL API format)
export enum CountryCode {
  GHANA = 'GH',
  UNITED_KINGDOM = 'GB',
  UNITED_STATES = 'US',
  GERMANY = 'DE',
  FRANCE = 'FR',
  CZECH_REPUBLIC = 'CZ'
}

// Airport Category Enum (from GOL API responses)
export enum AirportCategory {
  AIRPORT = 'AIRPORT',
  CITY = 'CITY',
  HELIPORT = 'HELIPORT',
  RAILWAY = 'RAILWAY'
}

// Special Offer Type Enum
export enum SpecialOfferType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  CAR = 'car',
  PACKAGE = 'package'
}

// Search Type Enum
export enum SearchType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  CAR = 'car'
}

// Default Airport (from Melcom website configuration)
export enum DefaultAirport {
  ACCRA = 'ACC'  // Default origin airport - Accra, Kotoka (Ghana)
}

// Default Country (from Melcom website configuration)
export enum DefaultCountry {
  GHANA = 'GH'  // Default country for Melcom Travel
}

// Phone Prefix (from Melcom website configuration)
export enum PhonePrefix {
  GHANA = '+233'  // Default phone prefix for Ghana
}

// Tolerance Days Enum (for flexible date searches)
export enum ToleranceDays {
  NONE = 0,
  ONE_DAY = 1,
  TWO_DAYS = 2,
  THREE_DAYS = 3,
  FIVE_DAYS = 5,
  SEVEN_DAYS = 7
}

// Meal Type Enum
export enum MealType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  HALAL = 'halal',
  KOSHER = 'kosher',
  STANDARD = 'standard',
  NO_MEAL = 'no-meal'
}

// Seat Preference Enum
export enum SeatPreference {
  WINDOW = 'window',
  AISLE = 'aisle',
  MIDDLE = 'middle',
  NO_PREFERENCE = 'no-preference'
}

// Flight Deal Category Enum
export enum FlightDealCategory {
  DOMESTIC = 'domestic',
  INTERNATIONAL = 'international',
  BUSINESS = 'business',
  BUDGET = 'budget',
  LAST_MINUTE = 'last-minute',
  SEASONAL = 'seasonal'
}

// Common West African Airport Codes
export enum WestAfricanAirports {
  ACCRA = 'ACC',
  LAGOS = 'LOS',
  ABIDJAN = 'ABJ',
  DAKAR = 'DKR',
  BAMAKO = 'BKO',
  OUAGADOUGOU = 'OUA',
  CONAKRY = 'CKY',
  FREETOWN = 'FNA',
  MONROVIA = 'ROB',
  LIBREVILLE = 'LBV',
  YAOUNDE = 'NSI',
  DOUALA = 'DLA'
}

// Common International Airport Codes
export enum InternationalAirports {
  LONDON_HEATHROW = 'LHR',
  LONDON_GATWICK = 'LGW',
  PARIS_CDG = 'CDG',
  AMSTERDAM = 'AMS',
  FRANKFURT = 'FRA',
  NEW_YORK_JFK = 'JFK',
  WASHINGTON_IAD = 'IAD',
  ATLANTA = 'ATL',
  DUBAI = 'DXB',
  DOHA = 'DOH',
  ISTANBUL = 'IST',
  ADDIS_ABABA = 'ADD',
  CASABLANCA = 'CMN',
  JOHANNESBURG = 'JNB'
}

// Airlines (exact list from Melcom website - comprehensive list)
export enum Airlines {
  // Alliance Groups
  ONEWORLD = '/*O',
  SKYTEAM = '/*S', 
  STARALLIANCE = '/*A',
  
  // Major International Airlines  
  AMERICAN_AIRLINES = 'AA',
  AIR_FRANCE = 'AF',
  BRITISH_AIRWAYS = 'BA',
  DELTA_AIR_LINES = 'DL',
  EMIRATES = 'EK',
  ETHIOPIAN_AIRLINES = 'ET',
  KLM = 'KL',
  LUFTHANSA = 'LH',
  QATAR_AIRWAYS = 'QR',
  TURKISH_AIRLINES = 'TK',
  UNITED = 'UA',
  VIRGIN_ATLANTIC = 'VS',
  
  // African Airlines
  AFRICA_WORLD_AIRLINES = 'AW',
  AIR_COTE_DIVOIRE = 'HF',
  AIR_SENEGAL = 'HC', 
  ASKY = 'KP',
  SOUTH_AFRICAN_AIRWAYS = 'SA',
  RWANDAIR = 'WB',
  SILVERSTONE_AIR_SERVICES = 'K5',
  ROYAL_AIR_MAROC = 'AT',
  
  // Additional Major Airlines from Melcom website
  ADRIA_AIRWAYS = 'JP',
  AEGEAN_AIRLINES = 'A3',
  AER_LINGUS = 'EI',
  AERO_ITALIA = 'XZ',
  AEROFLOT = 'SU',
  AEROMAR = 'VW',
  AEROMEXICO = 'AM',
  AIGLE_AZUR = 'ZI',
  AIR_ALGERIE = 'AH',
  AIR_ARABIA = 'G9',
  AIR_ARABIA_ABU_DHABI = '3L',
  AIR_ARABIA_EGYPT = 'E5',
  AIR_ARABIA_MAROC = '3O',
  AIR_ASIA = 'AK',
  AIR_ASTANA = 'KC',
  AIR_AUSTRAL = 'UU',
  AIR_BALTIC = 'BT',
  AIR_BLUE = 'AP',
  AIR_CANADA = 'AC',
  AIR_CARAIBES = 'TX',
  AIR_CHINA = 'CA',
  AIR_CORSICA = 'XK',
  AIR_DOLOMITI = 'EN',
  AIR_EUROPA = 'UX',
  AIR_GREENLAND = 'GL',
  AIR_INDIA = 'AI',
  AIR_ITALY = 'IG',
  AIR_MADAGASCAR = 'MD',
  AIR_MALTA = 'KM',
  AIR_MAURITIUS = 'MK',
  AIR_MOLDOVA = '9U',
  AIR_NAMIBIA = 'SW',
  AIR_NEW_ZEALAND = 'NZ',
  AIR_PREMIA = 'YP',
  AIR_SERBIA = 'JU',
  AIR_SEYCHELLES = 'HM',
  AIR_TAHITI_NUI = 'TN',
  AIR_TRANSAT = 'TS',
  AIR_VANUATU = 'NF',
  AIR_ZIMBABWE = 'UM',
  AIRSWIFT = 'T6',
  AJET = 'VF',
  ALASKA_AIRLINES = 'AS',
  ALL_NIPPON_AIRWAYS = 'NH',
  ALPHALAND_AVIATION = 'C9',
  AMASZONAS = 'Z8',
  ARAJET = 'DM',
  ASIANA_AIRLINES = 'OZ',
  ASL_AIRLINES_FRANCE = '5O',
  ATLANTIC_AIRWAYS = 'RC',
  ATLASJET_AIRLINES = 'KK',
  AUSTRIAN_AIRLINES = 'OS',
  AVIANCA = 'AV',
  AVIANCA_BRAZIL = 'O6',
  AZERBAIJAN_HAVA_YOLLARY = 'J2',
  BANGKOK_AIRWAYS = 'PG',
  BELAVIA = 'B2',
  BINTER_CANARIAS = 'NT',
  BLUE_AIR = '0B',
  BMI = 'BD',
  BOLIVIANA_DE_AVIACION = 'OB',
  BRAATHENS_REGIONAL = 'TF',
  BRUSSELS_AIRLINES = 'SN',
  BULGARIA_AIR = 'FB',
  CAPE_AIR = '9K',
  CARIBBEAN_AIRLINES = 'BW',
  CARPATAIR = 'V3',
  CATHAY_PACIFIC = 'CX',
  CHAIR_AIRLINES = 'CS',
  CHAM_WINGS_AIRLINES = '6Q',
  CHENGDU_AIRLINES = 'EU',
  CHINA_AIRLINES = 'CI',
  CHINA_EASTERN = 'MU',
  CHINA_EXPRESS = 'G5',
  CHINA_SOUTHERN = 'CZ',
  CHINA_UNITED = 'KN',
  CHONGQING_AIRLINES = 'OQ',
  COBRA_AVIATION = '0C',
  COMAIR_KULULA = 'MN',
  CONDOR = 'DE',
  CONTINENTAL = 'CO',
  COPA_AIRLINES = 'CM',
  CORSAIR = 'SS',
  CROATIA_AIRLINES = 'OU',
  CYPRUS_AIRWAYS = 'CY',
  CZECH_AIRLINES = 'OK',
  DIVI_DIVI_AIR = '3R',
  DONAVIA = 'D9',
  EASYJET = 'U2',
  EGYPTAIR = 'MS',
  EL_AL_ISRAEL = 'LY',
  ESWATINI_AIR = 'RN',
  ETIHAD_AIRWAYS = 'EY',
  EUROWINGS = 'EW',
  EVA_AIR = 'BR',
  FIJI_AIRWAYS = 'FJ',
  FINNAIR = 'AY',
  FIREFLY = 'FY',
  FLY_BONDI = 'FO',
  FLY_PLAY = 'OG',
  FLYBONDI = 'FBZ',
  FLYDUBAI = 'FZ',
  FLYONE = '5F',
  FRENCH_BEE = 'BF',
  FRONTIER_AIRLINES = 'F9',
  GARUDA_INDONESIA = 'GA',
  GEORGIAN_AIRWAYS = 'A9',
  GERMANWINGS = '4U',
  GOL_LINHAS_AEREAS = 'G3',
  GROUPE_TRANSAIR = 'R2',
  GROZNYY_AVIA = 'T8',
  GULF_AIR = 'GF',
  HAHN_AIR = 'HR',
  HAINAN_AIRLINES = 'HU',
  HAWAIIAN_AIRLINES = 'HA',
  HELI_AIR_MONACO = 'YO',
  HK_EXPRESS = 'UO',
  HONG_KONG_AIRLINES = 'HX',
  HOP = 'A5',
  IBERIA = 'IB',
  IBEROJET = 'E9',
  ICELANDAIR = 'FI',
  INDIGO = '6E',
  ISLAND_AIR = 'WP',
  ITA_AIRWAYS = 'AZ',
  JAPAN_AIRLINES = 'JL',
  JET_AIRWAYS = '9W',
  JET2 = 'LS',
  JETAIR_CARIBBEAN = '4J',
  JETBLUE_AIRWAYS = 'B6',
  JETSTAR_ASIA = '3K',
  JOON = 'JN',
  JSC_AZIMUTH = 'A4',
  KENYA_AIRWAYS = 'KQ',
  KOREAN_AIR = 'KE',
  KUWAIT_AIRWAYS = 'KU',
  LAM_MOZAMBIQUE = 'TM',
  LATAM = 'LA',
  LATAM_BRASIL = 'JJ',
  LAUDAMOTION = 'OE',
  LION_AIRLINES = 'JT',
  LOGANAIR = 'LM',
  LOT_POLISH = 'LO',
  LUXAIR = 'LG',
  MALAYSIA_AIRLINES = 'MH',
  MALDIVIAN = 'Q2',
  MANGO = 'JE',
  MIAT_MONGOLIAN = 'OM',
  MIDDLE_EAST_AIRLINES = 'ME',
  MONTENEGRO_AIRLINES = 'YM',
  MY_FREIGHTER = 'C6',
  MYAIRLINES = 'Z9',
  MYWAY_AIRLINES = 'MJ',
  NILE_AIR = 'NP',
  NORWEGIAN = 'D8',
  NORWEGIAN_AIR_SHUTTLE = 'DY',
  NOUVELAIR_TUNISIE = 'BJ',
  OLYMPIC_AIR = 'OA',
  OMAN_AIR = 'WY',
  PAKISTAN_INTL = 'PK',
  PEGASUS = 'PC',
  PEOPLES = 'PE',
  PERUVIAN_AIRLINES = 'P9',
  PHILIPPINE_AIRLINES = 'PR',
  PRECISION_AIR = 'PW',
  QANTAS = 'QF',
  ROSSIYA_AIRLINES = 'FV',
  ROYAL_BRUNEI = 'BI',
  ROYAL_JORDANIAN = 'RJ',
  RYANAIR = 'FR',
  S7_AIRLINES = 'S7',
  SA_AIRLINK = '4Z',
  SAFAIR = 'FA',
  SALAM_AIR = 'OV',
  SAS_SCANDINAVIAN = 'SK',
  SATA_AIR_ACORES = 'SP',
  SATA_INTERNATIONAL = 'S4',
  SAUDIA = 'SV',
  SCOOT_TIGERAIR = 'TR',
  SHANGHAI_AIRLINES = 'FM',
  SHENZEN_AIRLINES = 'ZH',
  SICHUAN_AIRLINES = '3U',
  SINGAPORE_AIRLINES = 'SQ',
  SKY_AIRLINE = 'H2',
  SKY_EUROPE = 'SKY',
  SKY_TAXI = 'TE',
  SKYGREECE = 'GW',
  SMALL_PLANET = 'P7',
  SMARTWINGS = 'QS',
  SOUTHWEST_AIRLINES = 'WN',
  SPIRIT_AIRLINES = 'NK',
  SRILANKAN_AIRLINES = 'UL',
  STARLUX = 'JX',
  SUN_COUNTRY = 'SY',
  SUN_EXPRESS = 'XQ',
  SUNCLASS_AIRLINES = 'DK',
  SUPERAIRJET = 'IU',
  SURINAM_AIRWAYS = 'PY',
  SWISS_INTL = 'LX',
  SYRIAN_ARAB = 'RB',
  T_WAY_AIR = 'TW',
  TAP_PORTUGAL = 'TP',
  TAROM = 'RO',
  THAI_AIRWAYS = 'TG',
  THAI_VIETJET_AIR = 'VZ',
  THOMSONFLY = 'TOM',
  THOMSONFLY_LTD = 'BY',
  TOKI_AIR = 'BV',
  TRANS_AIR_CONGO = 'Q8',
  TRANSAERO_AIRLINES = 'UN',
  TRANSAVIA = 'HV',
  TRANSAVIA_FRANCE = 'TO',
  TUNISAIR = 'TU',
  TWIN_JET = 'T7',
  UGANDA_AIRLINES = 'UR',
  UKRAINE_INTERNATIONAL = 'PS',
  URAL_AIRLINES = 'U6',
  US_AIRWAYS = 'US',
  UTAIR_UKRAINE = 'QU',
  UTAIR_AVIATION = 'UT',
  VIETNAM_AIRLINES = 'VN',
  VIRGIN_AUSTRALIA = 'VA',
  VISTARA = 'UK',
  VIVAAEROBUS = 'VB',
  VOLOTEA = 'V7',
  VUELING = 'VY',
  WESTJET = 'WS',
  WIDEROES = 'WF',
  WIND_ROSE_AVIATION = '7W',
  WIZZ_AIR = 'W6',
  WIZZ_AIR_ABU_DHABI = '5W',
  WIZZ_AIR_UK = 'W9',
  WIZZ_AIR_UKRAINE = 'WU',
  Z_AIR = '7Z',
  ZAMBIA_AIRWAYS = 'ZN',
  ZIP_AIR = 'ZG'
}
      