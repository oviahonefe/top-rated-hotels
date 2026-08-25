export type PropertyKind = "hotel" | "apartment";

export type PropertyTier =
  | "standard"
  | "premium"
  | "luxury"
  | "signature";

export type PropertyImage = {
  url: string;
  alt: string;
  isPrimary: boolean;
  publicId?: string;
};

export type PropertyAddress = {
  city: string;
  country: string;
  region?: string;
};

export type PublicProperty = {
  id: string;
  kind: PropertyKind;
  name: string;
  slug: string;
  summary: string;
  tier: PropertyTier;
  address: PropertyAddress;
  featured: boolean;
  images: PropertyImage[];
  amenities: string[];
  starRating?: number;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  fromNightlyRateCents: number;
};

export type HotelRoom = {
  id: string;
  name: string;
  description?: string;
  maxGuests: number;
  bedrooms?: number;
  bathrooms?: number;
  bedSummary?: string;
  amenities: string[];
  platformNightlyRateCents: number;
  totalUnits: number;
};

export type HotelDetail = PublicProperty & {
  kind: "hotel";
  description: string;
  rooms: HotelRoom[];
};

export type ApartmentDetail = PublicProperty & {
  kind: "apartment";
  description: string;
  bedSummary?: string;
  totalUnits: number;
};

export type PropertyCatalogueResponse = {
  properties: PublicProperty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PropertySearchParams = {
  q?: string;
  city?: string;
  country?: string;
  type?: PropertyKind | "all";
  tier?: PropertyTier;
  guests?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
};