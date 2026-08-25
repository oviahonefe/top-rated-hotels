export const propertyStatuses = [
  "draft",
  "published",
  "archived",
] as const;

export type PropertyStatus = (typeof propertyStatuses)[number];

export const propertyTiers = [
  "standard",
  "premium",
  "luxury",
  "signature",
] as const;

export type PropertyTier = (typeof propertyTiers)[number];

export const propertySources = [
  "admin",
  "licensed-import",
] as const;

export type PropertySource = (typeof propertySources)[number];

export type PropertyAddress = {
  country: string;
  city: string;
  region?: string;
  addressLine1?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
};

export type PropertyImage = {
  url: string;
  alt: string;
  isPrimary: boolean;
};

export type RoomOption = {
  name: string;
  description?: string;
  maxGuests: number;
  bedrooms?: number;
  bathrooms?: number;
  bedSummary?: string;
  amenities: string[];
  platformNightlyRateCents: number;
  totalUnits: number;
  isActive: boolean;
};