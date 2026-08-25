import { z } from "zod";

const paymentDetailSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(500),
});

export const createPaymentMethodSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  type: z.enum(["bank_transfer", "crypto"]),
  currency: z.string().trim().min(2).max(12),
  instructions: z.string().trim().min(10).max(3000),
  details: z.array(paymentDetailSchema).min(1).max(15),
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10_000).default(0),
});

export const updatePaymentMethodSchema =
  createPaymentMethodSchema.partial();

export type CreatePaymentMethodInput = z.infer<
  typeof createPaymentMethodSchema
>;

export type UpdatePaymentMethodInput = z.infer<
  typeof updatePaymentMethodSchema
>;