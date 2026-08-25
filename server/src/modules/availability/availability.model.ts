import { Schema, model, type HydratedDocument, Types } from "mongoose";

export const propertyKinds = ["hotel", "apartment"] as const;

export type PropertyKind = (typeof propertyKinds)[number];

export type Availability = {
  propertyId: Types.ObjectId;
  propertyKind: PropertyKind;
  unitKey: string;
  date: Date;
  totalInventory: number;
  reservedInventory: number;
  isBlocked: boolean;
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AvailabilityDocument = HydratedDocument<Availability>;

const availabilitySchema = new Schema<Availability>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    propertyKind: {
      type: String,
      enum: propertyKinds,
      required: true,
      index: true,
    },
    unitKey: {
      type: String,
      required: true,
      trim: true,
      default: "default",
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    totalInventory: {
      type: Number,
      required: true,
      min: 0,
    },
    reservedInventory: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

availabilitySchema.index(
  {
    propertyId: 1,
    propertyKind: 1,
    unitKey: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

export const AvailabilityModel = model<Availability>(
  "Availability",
  availabilitySchema,
);