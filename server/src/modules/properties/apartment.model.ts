import { Schema, model, type HydratedDocument } from "mongoose";

import type {
  PropertyAddress,
  PropertyImage,
  PropertySource,
  PropertyStatus,
  PropertyTier,
} from "./property.types.js";

export type Apartment = {
  name: string;
  slug: string;
  summary: string;
  description: string;
  status: PropertyStatus;
  tier: PropertyTier;
  source: PropertySource;
  address: PropertyAddress;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  bedSummary?: string;
  amenities: string[];
  images: PropertyImage[];
  platformNightlyRateCents: number;
  totalUnits: number;
  featured: boolean;
  searchKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ApartmentDocument = HydratedDocument<Apartment>;

const addressSchema = new Schema<PropertyAddress>(
  {
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    region: { type: String, trim: true },
    addressLine1: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
  },
  { _id: false },
);

const imageSchema = new Schema<PropertyImage>(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    publicId: {
      type: String,
      trim: true,
    },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const apartmentSchema = new Schema<Apartment>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 320,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8000,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    tier: {
      type: String,
      enum: ["standard", "premium", "luxury", "signature"],
      default: "standard",
      index: true,
    },
    source: {
      type: String,
      enum: ["admin", "licensed-import"],
      default: "admin",
    },
    address: {
      type: addressSchema,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bedSummary: {
      type: String,
      trim: true,
    },
    amenities: [{ type: String, trim: true }],
    images: {
      type: [imageSchema],
      default: [],
    },
    platformNightlyRateCents: {
      type: Number,
      required: true,
      min: 1,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    searchKeywords: [{ type: String, trim: true, lowercase: true }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

apartmentSchema.index({
  status: 1,
  featured: -1,
});

apartmentSchema.index({
  name: "text",
  "address.city": "text",
  "address.country": "text",
  searchKeywords: "text",
});

export const ApartmentModel = model<Apartment>(
  "Apartment",
  apartmentSchema,
);