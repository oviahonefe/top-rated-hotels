import {
  Schema,
  model,
  type HydratedDocument,
  Types,
} from "mongoose";

import type { PropertyKind } from "../availability/availability.model.js";

export const bookingStatuses = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "expired",
] as const;

export const paymentStatuses = [
  "awaiting_payment",
  "submitted",
  "approved",
  "rejected",
] as const;

export type BookingStatus =
  (typeof bookingStatuses)[number];

export type PaymentStatus =
  (typeof paymentStatuses)[number];

export type BookingGuest = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export type BookingPaymentDetail = {
  label: string;
  value: string;
};

export type BookingPaymentReceipt = {
  url: string;
  publicId: string;
  resourceType: "image" | "raw";
  originalFilename: string;
  mimeType: string;
  uploadedAt: Date;
};

export type BookingPayment = {
  methodId: Types.ObjectId;
  methodName: string;
  methodType: "bank_transfer" | "crypto";
  currency: string;
  instructions: string;
  details: BookingPaymentDetail[];
  status: PaymentStatus;
  transactionReference?: string;
  receipt?: BookingPaymentReceipt;
  submittedAt?: Date;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reviewNote?: string;
};

export type BookingPriceSnapshot = {
  currency: "USD";
  nights: number;
  nightlyRateCents: number;
  tierMultiplier: number;
  accommodationSubtotalCents: number;
  minimumBookingApplied: boolean;
  totalCents: number;
};

export type Booking = {
  bookingReference: string;
  userId: Types.ObjectId;
  propertyId: Types.ObjectId;
  propertyKind: PropertyKind;
  unitKey: string;
  propertyName: string;
  propertyLocation: string;
  propertyImageUrl?: string;
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  guest: BookingGuest;
  price: BookingPriceSnapshot;
  payment: BookingPayment;
  paymentDueAt: Date;
  status: BookingStatus;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BookingDocument = HydratedDocument<Booking>;

const bookingPaymentDetailSchema =
  new Schema<BookingPaymentDetail>(
    {
      label: {
        type: String,
        required: true,
        trim: true,
      },
      value: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { _id: false },
  );

const bookingPaymentReceiptSchema =
  new Schema<BookingPaymentReceipt>(
    {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      publicId: {
        type: String,
        required: true,
        trim: true,
      },
      resourceType: {
        type: String,
        enum: ["image", "raw"],
        required: true,
      },
      originalFilename: {
        type: String,
        required: true,
        trim: true,
      },
      mimeType: {
        type: String,
        required: true,
        trim: true,
      },
      uploadedAt: {
        type: Date,
        required: true,
      },
    },
    { _id: false },
  );

const bookingSchema = new Schema<Booking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    propertyKind: {
      type: String,
      enum: ["hotel", "apartment"],
      required: true,
    },
    unitKey: {
      type: String,
      required: true,
      trim: true,
      default: "default",
    },
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },
    propertyLocation: {
      type: String,
      required: true,
      trim: true,
    },
    propertyImageUrl: {
      type: String,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: true,
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      index: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    guest: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    price: {
      currency: {
        type: String,
        enum: ["USD"],
        required: true,
        default: "USD",
      },
      nights: {
        type: Number,
        required: true,
        min: 4,
      },
      nightlyRateCents: {
        type: Number,
        required: true,
        min: 1,
      },
      tierMultiplier: {
        type: Number,
        required: true,
        min: 1,
      },
      accommodationSubtotalCents: {
        type: Number,
        required: true,
        min: 1,
      },
      minimumBookingApplied: {
        type: Boolean,
        required: true,
      },
      totalCents: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    payment: {
      methodId: {
        type: Schema.Types.ObjectId,
        ref: "PaymentMethod",
        required: true,
      },
      methodName: {
        type: String,
        required: true,
        trim: true,
      },
      methodType: {
        type: String,
        enum: ["bank_transfer", "crypto"],
        required: true,
      },
      currency: {
        type: String,
        required: true,
        trim: true,
      },
      instructions: {
        type: String,
        required: true,
        trim: true,
      },
      details: {
        type: [bookingPaymentDetailSchema],
        default: [],
      },
      status: {
        type: String,
        enum: paymentStatuses,
        default: "awaiting_payment",
        index: true,
      },
      transactionReference: {
        type: String,
        trim: true,
      },
      receipt: {
        type: bookingPaymentReceiptSchema,
        required: false,
      },
      submittedAt: {
        type: Date,
      },
      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: {
        type: Date,
      },
      reviewNote: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },
    paymentDueAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: bookingStatuses,
      default: "pending",
      index: true,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
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

bookingSchema.index({
  userId: 1,
  createdAt: -1,
});

bookingSchema.index({
  propertyId: 1,
  propertyKind: 1,
  checkInDate: 1,
  checkOutDate: 1,
  status: 1,
});

export const BookingModel = model<Booking>(
  "Booking",
  bookingSchema,
);