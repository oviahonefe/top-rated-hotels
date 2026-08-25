import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type {
  Booking,
  BookingQuote,
  PaymentMethod,
} from "@/types/booking";
import type { Favorite } from "@/types/account";
import type {
  PropertyKind,
  PublicProperty,
} from "@/types/property";

export function getCurrentUser() {
  return apiRequest<{ user: AuthUser }>("/auth/me").then(
    (result) => result.user,
  );
}

export function getMyBookings() {
  return apiRequest<Booking[]>("/bookings/mine");
}

export function getMyBooking(reference: string) {
  return apiRequest<Booking>(
    `/bookings/${encodeURIComponent(reference)}`,
  );
}

export function cancelBooking(reference: string, reason?: string) {
  return apiRequest<Booking>(
    `/bookings/${encodeURIComponent(reference)}/cancel`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    },
  );
}

export function getFavorites() {
  return apiRequest<Favorite[]>("/me/favorites");
}

export function addFavorite(
  propertyId: string,
  propertyKind: PropertyKind,
) {
  return apiRequest<Favorite>("/me/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId, propertyKind }),
  });
}

export function removeFavorite(
  propertyId: string,
  propertyKind: PropertyKind,
) {
  return apiRequest<void>(
    `/me/favorites/${propertyKind}/${propertyId}`,
    { method: "DELETE" },
  );
}

export function getRecommendations() {
  return apiRequest<PublicProperty[]>("/me/recommendations");
}

export function getPaymentMethods() {
  return apiRequest<PaymentMethod[]>("/payment-methods");
}

export function getBookingQuote(input: {
  propertyId: string;
  propertyKind: PropertyKind;
  unitKey: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
}) {
  return apiRequest<BookingQuote>("/bookings/quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export function createBooking(input: {
  propertyId: string;
  propertyKind: PropertyKind;
  unitKey: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  paymentMethodId: string;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}) {
  return apiRequest<Booking>("/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export function submitBookingPayment(
  bookingReference: string,
  input: {
    transactionReference: string;
    receipt: File;
    note?: string;
  },
) {
  const formData = new FormData();

  formData.append(
    "transactionReference",
    input.transactionReference,
  );

  formData.append("receipt", input.receipt);

  if (input.note) {
    formData.append("note", input.note);
  }

  return apiRequest<Booking>(
    `/bookings/${encodeURIComponent(bookingReference)}/payment`,
    {
      method: "POST",
      body: formData,
    },
  );
}