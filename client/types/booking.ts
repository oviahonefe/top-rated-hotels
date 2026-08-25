import type { PropertyKind } from "@/types/property";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "expired";

export type PaymentStatus =
  | "awaiting_payment"
  | "submitted"
  | "approved"
  | "rejected";

export type PaymentMethod = {
  _id: string;
  displayName: string;
  type: "bank_transfer" | "crypto";
  currency: string;
  instructions: string;
  details: Array<{
    label: string;
    value: string;
  }>;
};

export type BookingQuote = {
  property: {
    id: string;
    kind: PropertyKind;
    unitKey: string;
    name: string;
    location: string;
  };
  quote: {
    currency: "USD";
    nights: number;
    nightlyRateCents: number;
    accommodationSubtotalCents: number;
    minimumBookingApplied: boolean;
    totalCents: number;
  };
};

export type Booking = {
  bookingReference: string;
  propertyId: string;
  propertyKind: PropertyKind;
  unitKey: string;
  propertyName: string;
  propertyLocation: string;
  propertyImageUrl?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  price: BookingQuote["quote"];
  payment: {
    methodName: string;
    methodType: "bank_transfer" | "crypto";
    currency: string;
    instructions: string;
    details: Array<{
      label: string;
      value: string;
    }>;
    status: PaymentStatus;
    transactionReference?: string;
    receipt?: {
      url: string;
      originalFilename: string;
      mimeType: string;
      uploadedAt: string;
    };
  };
  paymentDueAt: string;
  status: BookingStatus;
  createdAt: string;
};