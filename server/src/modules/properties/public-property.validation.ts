import { z } from "zod";

export const catalogueQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  city: z.string().trim().min(1).max(100).optional(),
  country: z.string().trim().min(1).max(100).optional(),
  type: z.enum(["hotel", "apartment", "all"]).default("all"),
  tier: z
    .enum(["standard", "premium", "luxury", "signature"])
    .optional(),
  guests: z.coerce.number().int().min(1).max(30).optional(),
  featured: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CatalogueQuery = z.infer<
  typeof catalogueQuerySchema
>;