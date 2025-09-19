export interface LogEventDto {
  action:
    | "SEARCH_FLIGHTS"
    | "CLICK_FLIGHT"
    | "CLICK_FLIGHT_DEAL"
    | "USE_PROMO"
    | "CLICK_BLOG"
    | "CLICK_FAQ"
    | "VIEW_COUNTRY"
    | "BOOK_FLIGHT"
    | "CANCEL_BOOKING"
    | "CONTACT_FORM"
    | "LOGIN"
    | "REGISTER"
    | "VIEW_PAGE";
  metadata?: {
    // For flight searches
    from?: string;
    to?: string;
    passengers?: number;
    flightType?: string;

    // For clicks
    itemId?: string;
    itemType?: string;
    itemTitle?: string;

    // For promos
    promoCode?: string;
    promoValue?: number;

    // For bookings
    bookingId?: string;
    amount?: number;
    currency?: string;

    // For page views
    page?: string;
    referrer?: string;

    // Additional data
    additional?: any;
  };
}

export interface AnalyticsStatsResponse {
  totalUsers: number;
  totalBookings: number;
  totalAmount: number;
  totalCancellations: number;
  totalContactForms: number;

  // Time-based stats
  dailyStats: {
    date: string;
    users: number;
    bookings: number;
    amount: number;
    searches: number;
  }[];

  // Popular destinations
  popularDestinations: {
    destination: string;
    searchCount: number;
    bookingCount: number;
  }[];

  // Popular content
  popularBlogs: {
    blogId: string;
    title: string;
    clickCount: number;
  }[];

  popularFaqs: {
    faqId: string;
    question: string;
    clickCount: number;
  }[];

  // User behavior
  deviceBreakdown: {
    device: string;
    count: number;
    percentage: number;
  }[];

  browserBreakdown: {
    browser: string;
    count: number;
    percentage: number;
  }[];

  // Conversion rates
  conversionRates: {
    searchToBooking: number;
    contactToBooking: number;
    dealClickToBooking: number;
  };
}

export interface LogFilters {
  action?: string;
  category?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  country?: string;
  device?: string;
  browser?: string;
}
