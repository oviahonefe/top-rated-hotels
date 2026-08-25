import { Router } from "express";
import multer from "multer";

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
} from "./booking.validation.js";

export const bookingRouter = Router();

const receiptUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(
        new Error("Only JPEG, PNG, WebP, and PDF receipts are allowed."),
      );
      return;
    }

    callback(null, true);
  },
});

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
  receiptUpload.single("receipt"),
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