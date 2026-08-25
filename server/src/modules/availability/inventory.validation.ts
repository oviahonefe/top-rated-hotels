import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const inventoryRangeSchema = z.object({
  propertyId: z.string().trim().min(1),
  propertyKind: z.enum(["hotel", "apartment"]),
  unitKey: z.string().trim().min(1).max(100),
  startDate: z
    .string()
    .regex(datePattern, "Start date must use YYYY-MM-DD."),
  endDate: z
    .string()
    .regex(datePattern, "End date must use YYYY-MM-DD."),
});

export const setInventoryBlockSchema =
  inventoryRangeSchema
    .extend({
      isBlocked: z.boolean(),
      reason: z.string().trim().max(500).optional(),
    })
    .superRefine((value, context) => {
      if (value.isBlocked && !value.reason) {
        context.addIssue({
          code: "custom",
          path: ["reason"],
          message:
            "A reason is required when blocking inventory.",
        });
      }
    });

export const setInventorySchema =
  inventoryRangeSchema.extend({
    totalInventory: z.number().int().min(0).max(10_000),
  });

export const occupancyQuerySchema = inventoryRangeSchema;

export type SetInventoryBlockInput = z.infer<
  typeof setInventoryBlockSchema
>;

export type SetInventoryInput = z.infer<
  typeof setInventorySchema
>;

export type OccupancyQuery = z.infer<
  typeof occupancyQuerySchema
>;