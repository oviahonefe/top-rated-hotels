import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { AppError } from "../utils/app-error.js";

export function validateBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      next(new AppError(message || "Invalid request body.", 400));
      return;
    }

    request.body = result.data;
    next();
  };
}