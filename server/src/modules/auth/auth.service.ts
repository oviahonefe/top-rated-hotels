import crypto from "node:crypto";

import type { CookieOptions, Request, Response } from "express";
import jwt, {
  type JwtPayload,
  type SignOptions
} from "jsonwebtoken";

import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";
import { hashValue } from "../../utils/crypto.js";
import {
  Session,
  type SessionDocument
} from "./session.model.js";
import {
  type UserDocument,
  type UserRole
} from "../users/user.model.js";

type AccessTokenPayload = {
  userId: string;
  role: UserRole;
};

type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};

function parseDuration(value: string) {
  const match = /^(\d+)(m|h|d)$/.exec(value);

  if (!match) {
    throw new Error(
      "JWT_REFRESH_EXPIRES_IN must use m, h, or d. Example: 7d."
    );
  }

  const amount = Number(match[1]);
  const unit = match[2];

  if (unit === "m") return amount * 60 * 1000;
  if (unit === "h") return amount * 60 * 60 * 1000;

  return amount * 24 * 60 * 60 * 1000;
}

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/v1/auth",
  maxAge: parseDuration(env.JWT_REFRESH_EXPIRES_IN)
};

function isJwtPayload(value: string | JwtPayload): value is JwtPayload {
  return typeof value === "object" && value !== null;
}

function getSignExpiry(value: string) {
  return value as SignOptions["expiresIn"];
}

export function getPublicUser(user: UserDocument) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    profileImageUrl: user.profileImageUrl ?? null,
    createdAt: user.createdAt
  };
}

export function signAccessToken(user: UserDocument) {
  return jwt.sign(
    {
      role: user.role,
      tokenType: "access"
    },
    env.JWT_ACCESS_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: getSignExpiry(env.JWT_ACCESS_EXPIRES_IN)
    }
  );
}

function signRefreshToken(userId: string, sessionId: string) {
  return jwt.sign(
    {
      tokenType: "refresh"
    },
    env.JWT_REFRESH_SECRET,
    {
      subject: userId,
      jwtid: sessionId,
      expiresIn: getSignExpiry(env.JWT_REFRESH_EXPIRES_IN)
    }
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (
    !isJwtPayload(decoded) ||
    decoded.tokenType !== "access" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid access token.");
  }

  return {
    userId: decoded.sub,
    role: decoded.role as UserRole
  };
}

function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (
    !isJwtPayload(decoded) ||
    decoded.tokenType !== "refresh" ||
    typeof decoded.sub !== "string" ||
    typeof decoded.jti !== "string"
  ) {
    throw new Error("Invalid refresh token.");
  }

  return {
    userId: decoded.sub,
    sessionId: decoded.jti
  };
}

export async function createSession(
  user: UserDocument,
  request: Request
) {
  const sessionId = crypto.randomUUID();
  const refreshToken = signRefreshToken(
    user._id.toString(),
    sessionId
  );

  await Session.create({
    userId: user._id,
    sessionId,
    tokenHash: hashValue(refreshToken),
    expiresAt: new Date(
      Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN)
    ),
    userAgent: request.get("user-agent") ?? undefined,
    ipAddress: request.ip
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken
  };
}

export function setRefreshCookie(
  response: Response,
  refreshToken: string
) {
  response.cookie(
    "top_rated_hotels_refresh_token",
    refreshToken,
    refreshCookieOptions
  );
}

export function clearRefreshCookie(response: Response) {
  response.clearCookie("top_rated_hotels_refresh_token", {
    ...refreshCookieOptions,
    maxAge: undefined
  });
}

export async function rotateSession(
  refreshToken: string,
  request: Request,
  getUserById: (userId: string) => Promise<UserDocument | null>
) {
  let payload: RefreshTokenPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid or expired refresh token.", 401);
  }

  const session = await Session.findOne({
    sessionId: payload.sessionId,
    expiresAt: {
      $gt: new Date()
    }
  }).select("+tokenHash");

  if (!session || session.tokenHash !== hashValue(refreshToken)) {
    throw new AppError("Refresh session is no longer valid.", 401);
  }

  const user = await getUserById(payload.userId);

  if (!user) {
    await session.deleteOne();
    throw new AppError("User account was not found.", 401);
  }

  await session.deleteOne();

  return {
    user,
    tokens: await createSession(user, request)
  };
}

export async function removeRefreshSession(
  refreshToken: string | undefined
) {
  if (!refreshToken) return;

  try {
    const payload = verifyRefreshToken(refreshToken);

    await Session.deleteOne({
      sessionId: payload.sessionId
    });
  } catch {
    // Logout must still clear the browser cookie if the token is invalid.
  }
}

export async function removeAllUserSessions(userId: string) {
  await Session.deleteMany({ userId });
}

export function getRefreshTokenFromRequest(request: Request) {
  return request.cookies?.top_rated_hotels_refresh_token as
    | string
    | undefined;
}