export interface RecommendedCountryResponse {
  id: string;
  name: string;
  code: string;
  image: string;
  numberOfDestinations: number;
  description?: string;
  continent: string;
  currency?: string;
  language?: string;
  bestTimeToVisit?: string;
  averageTemperature?: string;
  featured: boolean;
  popular: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecommendedCountryDto {
  name: string;
  code: string;
  image: string;
  numberOfDestinations?: number;
  description?: string;
  continent:
    | "Africa"
    | "Asia"
    | "Europe"
    | "North America"
    | "South America"
    | "Australia"
    | "Antarctica";
  currency?: string;
  language?: string;
  bestTimeToVisit?: string;
  averageTemperature?: string;
  featured?: boolean;
  popular?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

export interface UpdateRecommendedCountryDto {
  name?: string;
  code?: string;
  image?: string;
  numberOfDestinations?: number;
  description?: string;
  continent?:
    | "Africa"
    | "Asia"
    | "Europe"
    | "North America"
    | "South America"
    | "Australia"
    | "Antarctica";
  currency?: string;
  language?: string;
  bestTimeToVisit?: string;
  averageTemperature?: string;
  featured?: boolean;
  popular?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}
