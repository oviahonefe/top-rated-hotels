import { z } from "zod";

export const createFavoriteSchema = z.object({
  propertyId: z.string().trim().min(1),
  propertyKind: z.enum(["hotel", "apartment"]),
});

export type CreateFavoriteInput = z.infer<
  typeof createFavoriteSchema
>;