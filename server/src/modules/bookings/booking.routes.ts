import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import { validateBody } from "../../middleware/validate.js";
import {
  cancelMyBookingController,
  createBookingController,
  getBookingQuoteController,
  getMyBookingController,
  listAdminBookingsController,
  listMyBookingsController,
  reviewBookingPaymentController,
  submitPaymentController,
} from "./booking.controller.js";
import {
  createBookingQuoteSchema,
  createBookingSchema,
  reviewPaymentSchema,
  submitPaymentSchema,
} from "./booking.validation.js";

export const bookingRouter = Router();

bookingRouter.post(
  "/quote",
  validateBody(createBookingQuoteSchema),
  getBookingQuoteController,
);

bookingRouter.get(
  "/admin",
  authenticate,
  requireAdmin,
  listAdminBookingsController,
);

bookingRouter.post(
  "/admin/:reference/payment-review",
  authenticate,
  requireAdmin,
  validateBody(reviewPaymentSchema),
  reviewBookingPaymentController,
);

bookingRouter.post(
  "/",
  authenticate,
  validateBody(createBookingSchema),
  createBookingController,
);

bookingRouter.get(
  "/mine",
  authenticate,
  listMyBookingsController,
);

bookingRouter.post(
  "/:reference/payment",
  authenticate,
  validateBody(submitPaymentSchema),
  submitPaymentController,
);

bookingRouter.get(
  "/:reference",
  authenticate,
  getMyBookingController,
);

bookingRouter.post(
  "/:reference/cancel",
  authenticate,
  cancelMyBookingController,
);