import { z } from "zod";

export const adminBookingQuerySchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "expired",
    ])
    .optional(),
  paymentStatus: z
    .enum([
      "awaiting_payment",
      "submitted",
      "approved",
      "rejected",
    ])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type AdminBookingQuery = z.infer<
  typeof adminBookingQuerySchema
>;