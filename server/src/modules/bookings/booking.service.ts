import mongoose, { Types } from "mongoose";
import { randomUUID } from "node:crypto";

import {
  releaseInventory,
  reserveInventory,
} from "../availability/availability.service.js";
import { ApartmentModel } from "../properties/apartment.model.js";
import { HotelModel } from "../properties/hotel.model.js";
import {
  createPriceQuote,
  type PriceQuote,
} from "../pricing/pricing.service.js";
import { getEnabledPaymentMethod } from "../payments/payment-method.service.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";
import {
  BookingModel,
  type BookingDocument,
} from "./booking.model.js";
import type {
  CreateBookingInput,
  CreateBookingQuoteInput,
} from "./booking.validation.js";

type ResolvedProperty = {
  propertyId: Types.ObjectId;
  propertyKind: "hotel" | "apartment";
  unitKey: string;
  propertyName: string;
  propertyLocation: string;
  propertyImageUrl?: string;
  tier: "standard" | "premium" | "luxury" | "signature";
  platformNightlyRateCents: number;
  totalInventory: number;
  maxGuests: number;
};

function parseDate(value: string, label: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${label} is invalid.`, 400);
  }

  return date;
}

function getPrimaryImageUrl(
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>,
) {
  return (
    images.find((image) => image.isPrimary)?.url ??
    images[0]?.url
  );
}

function createBookingReference() {
  return `TRH-${randomUUID()
    .replaceAll("-", "")
    .slice(0, 10)
    .toUpperCase()}`;
}

async function resolveProperty(
  input: CreateBookingQuoteInput,
): Promise<ResolvedProperty> {
  if (!Types.ObjectId.isValid(input.propertyId)) {
    throw new AppError("The property ID is invalid.", 400);
  }

  if (input.propertyKind === "apartment") {
    const apartment = await ApartmentModel.findOne({
      _id: input.propertyId,
      status: "published",
    }).lean();

    if (!apartment) {
      throw new AppError(
        "Apartment not found or unavailable.",
        404,
      );
    }

    if (input.unitKey !== "default") {
      throw new AppError(
        "Apartments must use the default unit.",
        400,
      );
    }

    return {
      propertyId: new Types.ObjectId(String(apartment._id)),
      propertyKind: "apartment",
      unitKey: "default",
      propertyName: apartment.name,
      propertyLocation: `${apartment.address.city}, ${apartment.address.country}`,
      propertyImageUrl: getPrimaryImageUrl(apartment.images),
      tier: apartment.tier,
      platformNightlyRateCents:
        apartment.platformNightlyRateCents,
      totalInventory: apartment.totalUnits,
      maxGuests: apartment.maxGuests,
    };
  }

  const hotel = await HotelModel.findOne({
    _id: input.propertyId,
    status: "published",
  }).lean();

  if (!hotel) {
    throw new AppError(
      "Hotel not found or unavailable.",
      404,
    );
  }

  const room = hotel.rooms.find((item) => {
    const roomId = (item as typeof item & {
      _id?: unknown;
    })._id;

    return String(roomId) === input.unitKey;
  });

  if (!room || !room.isActive) {
    throw new AppError(
      "Hotel room type not found or unavailable.",
      404,
    );
  }

  return {
    propertyId: new Types.ObjectId(String(hotel._id)),
    propertyKind: "hotel",
    unitKey: input.unitKey,
    propertyName: hotel.name,
    propertyLocation: `${hotel.address.city}, ${hotel.address.country}`,
    propertyImageUrl: getPrimaryImageUrl(hotel.images),
    tier: hotel.tier,
    platformNightlyRateCents:
      room.platformNightlyRateCents,
    totalInventory: room.totalUnits,
    maxGuests: room.maxGuests,
  };
}

async function resolveQuote(
  input: CreateBookingQuoteInput,
) {
  const property = await resolveProperty(input);

  if (input.guestCount > property.maxGuests) {
    throw new AppError(
      "Guest count exceeds this accommodation's capacity.",
      400,
    );
  }

  const checkInDate = parseDate(
    input.checkInDate,
    "Check-in date",
  );

  const checkOutDate = parseDate(
    input.checkOutDate,
    "Check-out date",
  );

  const quote = createPriceQuote({
    checkInDate,
    checkOutDate,
    platformNightlyRateCents:
      property.platformNightlyRateCents,
    tier: property.tier,
  });

  return {
    property,
    checkInDate,
    checkOutDate,
    quote,
  };
}

export async function getBookingQuote(
  input: CreateBookingQuoteInput,
) {
  const result = await resolveQuote(input);

  return {
    property: {
      id: String(result.property.propertyId),
      kind: result.property.propertyKind,
      unitKey: result.property.unitKey,
      name: result.property.propertyName,
      location: result.property.propertyLocation,
    },
    quote: result.quote,
  };
}

export async function createBooking(
  userId: string,
  input: CreateBookingInput,
): Promise<BookingDocument> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError("User session is invalid.", 401);
  }

  const {
    property,
    checkInDate,
    checkOutDate,
    quote,
  } = await resolveQuote(input);
  const paymentMethod = await getEnabledPaymentMethod(
    input.paymentMethodId,
  );

  const session = await mongoose.startSession();

  try {
    let booking: BookingDocument | undefined;

    await session.withTransaction(async () => {
      await reserveInventory({
        propertyId: property.propertyId,
        propertyKind: property.propertyKind,
        unitKey: property.unitKey,
        checkInDate,
        checkOutDate,
        totalInventory: property.totalInventory,
        session,
      });

      const created = await BookingModel.create(
        [
          {
            bookingReference: createBookingReference(),
            userId: new Types.ObjectId(userId),
            propertyId: property.propertyId,
            propertyKind: property.propertyKind,
            unitKey: property.unitKey,
            propertyName: property.propertyName,
            propertyLocation: property.propertyLocation,
            propertyImageUrl: property.propertyImageUrl,
            checkInDate,
            checkOutDate,
            guestCount: input.guestCount,
            guest: input.guest,
            price: quote,
            paymentDueAt: new Date(
              Date.now() + env.PAYMENT_HOLD_MINUTES * 60_000,
            ),
            payment: {
              methodId: new Types.ObjectId(
                String(paymentMethod._id),
              ),
              methodName: paymentMethod.displayName,
              methodType: paymentMethod.type,
              currency: paymentMethod.currency,
              instructions: paymentMethod.instructions,
              details: paymentMethod.details.map((detail) => ({
                label: detail.label,
                value: detail.value,
              })),
              status: "awaiting_payment",
            },
            status: "pending",
          },
        ],
        { session },
      );

      booking = created[0];
    });

    if (!booking) {
      throw new AppError(
        "Booking could not be completed.",
        500,
      );
    }

    return booking;
  } finally {
    await session.endSession();
  }
}

export async function listUserBookings(userId: string) {
  return BookingModel.find({
    userId,
  })
    .sort({ checkInDate: -1 })
    .lean();
}

export async function getUserBooking(
  userId: string,
  bookingReference: string,
) {
  const booking = await BookingModel.findOne({
    userId,
    bookingReference: bookingReference.toUpperCase(),
  }).lean();

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  return booking;
}

export async function cancelUserBooking(
  userId: string,
  bookingReference: string,
  reason?: string,
) {
  const session = await mongoose.startSession();

  try {
    let booking: BookingDocument | null = null;

    await session.withTransaction(async () => {
      const existing = await BookingModel.findOne({
        userId,
        bookingReference: bookingReference.toUpperCase(),
      }).session(session);

      if (!existing) {
        throw new AppError("Booking not found.", 404);
      }

      if (
        existing.status !== "pending" &&
        existing.status !== "confirmed"
      ) {
        throw new AppError(
          "This booking cannot be cancelled.",
          409,
        );
      }

      if (existing.checkInDate <= new Date()) {
        throw new AppError(
          "Bookings cannot be cancelled on or after check-in.",
          409,
        );
      }

      await releaseInventory({
        propertyId: existing.propertyId,
        propertyKind: existing.propertyKind,
        unitKey: existing.unitKey,
        checkInDate: existing.checkInDate,
        checkOutDate: existing.checkOutDate,
        session,
      });

      existing.status = "cancelled";
      existing.cancelledAt = new Date();
      existing.cancellationReason = reason?.trim();

      booking = await existing.save({ session });
    });

    return booking;
  } finally {
    await session.endSession();
  }
}

export async function submitPaymentReference(
  userId: string,
  bookingReference: string,
  input: {
    transactionReference: string;
    note?: string;
  },
) {
  const booking = await BookingModel.findOne({
    userId,
    bookingReference: bookingReference.toUpperCase(),
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.status !== "pending") {
    throw new AppError(
      "Payment can no longer be submitted for this booking.",
      409,
    );
  }

  if (booking.paymentDueAt <= new Date()) {
    throw new AppError(
      "The payment hold for this booking has expired.",
      409,
    );
  }

  if (
    booking.payment.status === "approved" ||
    booking.payment.status === "submitted"
  ) {
    throw new AppError(
      "Payment has already been submitted for review.",
      409,
    );
  }

  booking.payment.status = "submitted";
  booking.payment.transactionReference =
    input.transactionReference.trim();
  booking.payment.submittedAt = new Date();
  booking.payment.reviewNote = input.note?.trim();

  return booking.save();
}

export async function reviewBookingPayment(
  adminUserId: string,
  bookingReference: string,
  input: {
    decision: "approve" | "reject";
    note?: string;
  },
) {
  if (!Types.ObjectId.isValid(adminUserId)) {
    throw new AppError("Administrator session is invalid.", 401);
  }

  const booking = await BookingModel.findOne({
    bookingReference: bookingReference.toUpperCase(),
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.paymentDueAt <= new Date()) {
    throw new AppError(
      "The payment hold for this booking has expired.",
      409,
    );
  }

  if (booking.payment.status !== "submitted") {
    throw new AppError(
      "Only submitted payments can be reviewed.",
      409,
    );
  }

  booking.payment.status =
    input.decision === "approve"
      ? "approved"
      : "rejected";

  booking.payment.reviewedBy = new Types.ObjectId(
    adminUserId,
  );

  booking.payment.reviewedAt = new Date();
  booking.payment.reviewNote = input.note?.trim();

  if (input.decision === "approve") {
    booking.status = "confirmed";
  }

  return booking.save();
}

export async function listAdminBookings(input: {
  status?: string;
  paymentStatus?: string;
  page: number;
  limit: number;
}) {
  const filter: Record<string, unknown> = {};

  if (input.status) {
    filter.status = input.status;
  }

  if (input.paymentStatus) {
    filter["payment.status"] = input.paymentStatus;
  }

  const skip = (input.page - 1) * input.limit;

  const [bookings, total] = await Promise.all([
    BookingModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(input.limit)
      .lean(),
    BookingModel.countDocuments(filter),
  ]);

  return {
    bookings,
    pagination: {
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(
        1,
        Math.ceil(total / input.limit),
      ),
    },
  };
}

export type { PriceQuote };