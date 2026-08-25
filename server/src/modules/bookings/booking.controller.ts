import type { Request, RequestHandler } from "express";

import { AppError } from "../../utils/app-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  sendBookingCancelledEmail,
  sendBookingConfirmedEmail,
  sendPaymentSubmittedForReviewEmail,
} from "./booking-email.service.js";
import {
  deletePaymentReceipt,
  uploadPaymentReceipt,
} from "./payment-receipt.service.js";
import {
  cancelUserBooking,
  createBooking,
  getBookingQuote,
  getUserBooking,
  listAdminBookings,
  listUserBookings,
  reviewBookingPayment,
  submitPaymentReference,
} from "./booking.service.js";
import { adminBookingQuerySchema } from "./admin-booking.validation.js";
import {
  submitPaymentSchema,
  type CreateBookingInput,
  type CreateBookingQuoteInput,
} from "./booking.validation.js";

function getAuthenticatedUserId(req: Request) {
  if (!req.auth?.userId) {
    throw new AppError("Authentication is required.", 401);
  }

  return req.auth.userId;
}

function getBookingReference(req: Request) {
  const reference = req.params.reference;

  if (
    typeof reference !== "string" ||
    !reference.trim()
  ) {
    throw new AppError(
      "A valid booking reference is required.",
      400,
    );
  }

  return reference.trim();
}

export const getBookingQuoteController: RequestHandler =
  asyncHandler(async (req, res) => {
    const data = await getBookingQuote(
      req.body as CreateBookingQuoteInput,
    );

    res.status(200).json({
      success: true,
      data,
    });
  });

export const createBookingController: RequestHandler =
  asyncHandler(async (req, res) => {
    const booking = await createBooking(
      getAuthenticatedUserId(req),
      req.body as CreateBookingInput,
    );

    res.status(201).json({
      success: true,
      data: booking,
    });
  });

export const listMyBookingsController: RequestHandler =
  asyncHandler(async (req, res) => {
    const bookings = await listUserBookings(
      getAuthenticatedUserId(req),
    );

    res.status(200).json({
      success: true,
      data: bookings,
    });
  });

export const getMyBookingController: RequestHandler =
  asyncHandler(async (req, res) => {
    const booking = await getUserBooking(
      getAuthenticatedUserId(req),
      getBookingReference(req),
    );

    res.status(200).json({
      success: true,
      data: booking,
    });
  });

export const cancelMyBookingController: RequestHandler =
  asyncHandler(async (req, res) => {
    const reason =
      typeof req.body?.reason === "string"
        ? req.body.reason
        : undefined;

    const booking = await cancelUserBooking(
      getAuthenticatedUserId(req),
      getBookingReference(req),
      reason,
    );

    if (!booking) {
      throw new AppError(
        "Booking cancellation could not be completed.",
        500,
      );
    }

    void sendBookingCancelledEmail(booking);

    res.status(200).json({
      success: true,
      data: booking,
    });
  });

export const submitPaymentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const receiptFile = req.file;

    if (!receiptFile) {
      throw new AppError(
        "Upload a payment receipt before submitting payment.",
        400,
      );
    }

    const bookingReference = getBookingReference(req);
    const paymentInput = submitPaymentSchema.parse(req.body);

    const receipt = await uploadPaymentReceipt(
      receiptFile,
      bookingReference,
    );

    try {
      const booking = await submitPaymentReference(
        getAuthenticatedUserId(req),
        bookingReference,
        {
          ...paymentInput,
          receipt,
        },
      );

      void sendPaymentSubmittedForReviewEmail(booking);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      await deletePaymentReceipt(receipt);
      throw error;
    }
  });

export const reviewBookingPaymentController: RequestHandler =
  asyncHandler(async (req, res) => {
    const booking = await reviewBookingPayment(
      getAuthenticatedUserId(req),
      getBookingReference(req),
      req.body as {
        decision: "approve" | "reject";
        note?: string;
      },
    );

    if (!booking) {
      throw new AppError(
        "Payment review could not be completed.",
        500,
      );
    }

    if (booking.payment.status === "approved") {
      void sendBookingConfirmedEmail(booking);
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  });

export const listAdminBookingsController: RequestHandler =
  asyncHandler(async (req, res) => {
    const query = adminBookingQuerySchema.parse(req.query);
    const data = await listAdminBookings(query);

    res.status(200).json({
      success: true,
      data,
    });
  });