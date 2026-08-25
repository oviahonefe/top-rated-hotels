import type { RequestHandler } from "express";

import { AppError } from "../utils/app-error.js";

export const requireAdmin: RequestHandler = (
  req,
  _res,
  next,
) => {
  if (!req.auth) {
    next(new AppError("Authentication is required.", 401));
    return;
  }

  if (req.auth.role !== "admin") {
    next(new AppError("Administrator access is required.", 403));
    return;
  }

  next();
};