import type {
  ErrorRequestHandler,
  RequestHandler
} from "express";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  logger.error({ error }, "Unhandled API error");

  const statusCode =
    typeof error?.statusCode === "number" ? error.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 && env.NODE_ENV === "production"
        ? "Internal server error"
        : error?.message || "Internal server error"
  });
};