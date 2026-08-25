import { z } from "zod";

const reservationSchema = z.object({
  propertyId: z.string().trim().min(1),
  propertyKind: z.enum(["hotel", "apartment"]),
  unitKey: z.string().trim().min(1).max(100),
  checkInDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Check-in must use YYYY-MM-DD.",
    ),
  checkOutDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Check-out must use YYYY-MM-DD.",
    ),
  guestCount: z.number().int().min(1).max(30),
});

export const createBookingQuoteSchema = reservationSchema;

export const createBookingSchema = reservationSchema.extend({
  paymentMethodId: z.string().trim().min(1),
  guest: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.email(),
    phone: z.string().trim().min(5).max(30).optional(),
  }),
});

export const submitPaymentSchema = z.object({
  transactionReference: z
    .string()
    .trim()
    .min(3)
    .max(180),
  note: z.string().trim().max(1000).optional(),
});

export const reviewPaymentSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  note: z.string().trim().max(1000).optional(),
});

export type CreateBookingQuoteInput = z.infer<
  typeof createBookingQuoteSchema
>;

export type CreateBookingInput = z.infer<
  typeof createBookingSchema
>;

export type SubmitPaymentInput = z.infer<
  typeof submitPaymentSchema
>;

export type ReviewPaymentInput = z.infer<
  typeof reviewPaymentSchema
>;