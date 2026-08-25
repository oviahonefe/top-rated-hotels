import { z } from "zod";

const imageSchema = z.object({
  url: z.url(),
  alt: z.string().trim().min(1).max(180),
  isPrimary: z.boolean().default(false),
});

const addressSchema = z.object({
  country: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  region: z.string().trim().min(1).max(100).optional(),
  addressLine1: z.string().trim().min(1).max(200).optional(),
  postalCode: z.string().trim().min(1).max(30).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

const roomSchema = z.object({
  name: z.string().trim().min(2).max(140),
  description: z.string().trim().max(2000).optional(),
  maxGuests: z.number().int().min(1).max(30),
  bedrooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().min(0).max(20).optional(),
  bedSummary: z.string().trim().max(300).optional(),
  amenities: z.array(z.string().trim().min(1).max(80)).default([]),
  platformNightlyRateCents: z.number().int().min(1),
  totalUnits: z.number().int().min(1).max(10_000).default(1),
  isActive: z.boolean().default(true),
});

const sharedPropertySchema = z.object({
  name: z.string().trim().min(2).max(180),
  summary: z.string().trim().min(10).max(320),
  description: z.string().trim().min(20).max(8000),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tier: z
    .enum(["standard", "premium", "luxury", "signature"])
    .default("standard"),
  address: addressSchema,
  amenities: z.array(z.string().trim().min(1).max(80)).default([]),
  images: z.array(imageSchema).max(30).default([]),
  featured: z.boolean().default(false),
  searchKeywords: z
    .array(z.string().trim().min(1).max(80))
    .max(40)
    .default([]),
});

export const createHotelSchema = sharedPropertySchema.extend({
  starRating: z.number().min(1).max(5),
  rooms: z.array(roomSchema).min(1).max(100),
});

export const updateHotelSchema = createHotelSchema.partial();

export const createApartmentSchema = sharedPropertySchema.extend({
  maxGuests: z.number().int().min(1).max(30),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().min(0).max(20),
  bedSummary: z.string().trim().max(300).optional(),
  platformNightlyRateCents: z.number().int().min(1),
  totalUnits: z.number().int().min(1).max(10_000).default(1),
});

export const updateApartmentSchema =
  createApartmentSchema.partial();

export type CreateHotelInput = z.infer<
  typeof createHotelSchema
>;

export type UpdateHotelInput = z.infer<
  typeof updateHotelSchema
>;

export type CreateApartmentInput = z.infer<
  typeof createApartmentSchema
>;

export type UpdateApartmentInput = z.infer<
  typeof updateApartmentSchema
>;