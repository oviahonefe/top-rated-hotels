export type UserRole = "user" | "admin" | "super_admin";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  profileImageUrl?: string | null;
};

export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiError = {
  success: false;
  message?: string;
  errors?: Record<string, string[]>;
};
export type PropertyStatus = "draft" | "published" | "archived";

export type PropertyTier = "standard" | "premium" | "luxury" | "signature";

export type PropertyImage = {
  url: string;
  alt: string;
  isPrimary: boolean;
  publicId?: string;
};

export type HotelRoom = {
  _id?: string;
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

export type AdminHotel = {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  status: PropertyStatus;
  tier: PropertyTier;
  address: {
    country: string;
    city: string;
    region?: string;
    addressLine1?: string;
    postalCode?: string;
  };
  starRating: number;
  amenities: string[];
  images: PropertyImage[];
  rooms: HotelRoom[];
  featured: boolean;
  searchKeywords: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminApartment = {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  status: PropertyStatus;
  tier: PropertyTier;
  address: {
    country: string;
    city: string;
    region?: string;
    addressLine1?: string;
    postalCode?: string;
  };
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
  createdAt: string;
  updatedAt: string;
};

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

export type AdminBooking = {
  _id: string;
  bookingReference: string;
  propertyKind: "hotel" | "apartment";
  propertyName: string;
  propertyLocation: string;
  propertyImageUrl?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  price: {
    currency: "USD";
    nights: number;
    totalCents: number;
  };
  payment: {
    methodName: string;
    methodType: "bank_transfer" | "crypto";
    currency: string;
    status: PaymentStatus;
    transactionReference?: string;
    submittedAt?: string;
    reviewNote?: string;
  };
  paymentDueAt: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminBookingList = {
  bookings: AdminBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};