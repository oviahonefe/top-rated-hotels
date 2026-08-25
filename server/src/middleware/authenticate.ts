import type { RequestHandler } from "express";

import { verifyAccessToken } from "../modules/auth/auth.service.js";
import { AppError } from "../utils/app-error.js";

export const authenticate: RequestHandler = (request, _response, next) => {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError("Authentication is required.", 401));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length).trim();
    const payload = verifyAccessToken(token);

    request.auth = {
      userId: payload.userId,
      role: payload.role
    };

    next();
  } catch {
    next(new AppError("Invalid or expired access token.", 401));
  }
};