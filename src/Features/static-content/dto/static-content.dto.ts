export interface StaticContentResponse {
  id: string;
  type: string;
  title: string;
  content: string;
  lastUpdated: string;
  version: string;
  status: string;
}

export interface CreateStaticContentDto {
  type: "terms-and-conditions" | "privacy-policy" | "cookies" | "about-us";
  title: string;
  content: string;
  version?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateStaticContentDto {
  title?: string;
  content?: string;
  version?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface FAQResponse {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQDto {
  question: string;
  answer: string;
  category?:
    | "general"
    | "booking"
    | "payment"
    | "flights"
    | "cancellation"
    | "support";
  order?: number;
  featured?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateFAQDto {
  question?: string;
  answer?: string;
  category?:
    | "general"
    | "booking"
    | "payment"
    | "flights"
    | "cancellation"
    | "support";
  order?: number;
  featured?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

export interface ContactInfoResponse {
  id: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export interface UpdateContactInfoDto {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  businessHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}
