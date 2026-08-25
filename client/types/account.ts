import type {
  PropertyKind,
  PropertyTier,
  PublicProperty,
} from "@/types/property";

export type FavoriteProperty = {
  id: string;
  kind: PropertyKind;
  name: string;
  slug: string;
  summary: string;
  tier: PropertyTier;
  city: string;
  country: string;
  image?: string;
};

export type Favorite = {
  favoriteId: string;
  savedAt: string;
  property: FavoriteProperty;
};

export type AccountOverview = {
  bookings: number;
  favorites: number;
  recommendations: PublicProperty[];
};