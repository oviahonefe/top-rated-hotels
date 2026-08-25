import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";

import { AppError } from "../../utils/app-error.js";
import {
  addMinutes,
  createOtp,
  hashValue
} from "../../utils/crypto.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { User } from "../users/user.model.js";
import {
  clearRefreshCookie,
  createSession,
  getPublicUser,
  getRefreshTokenFromRequest,
  removeAllUserSessions,
  removeRefreshSession,
  rotateSession,
  setRefreshCookie
} from "./auth.service.js";
import {
  sendPasswordResetOtp,
  sendVerificationOtp
} from "./email.service.js";

const OTP_EXPIRY_MINUTES = 10;

export const register: RequestHandler = asyncHandler(
  async (request, response) => {
    const {
      firstName,
      lastName,
      email,
      password
    } = request.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        "An account with this email already exists.",
        409
      );
    }

    const otp = createOtp();

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      emailVerification: {
        otpHash: hashValue(otp),
        expiresAt: addMinutes(OTP_EXPIRY_MINUTES),
        sentAt: new Date()
      }
    });

    try {
      await sendVerificationOtp(user.email, user.firstName, otp);
    } catch (error) {
      await user.deleteOne();
      throw error;
    }

    response.status(201).json({
      success: true,
      message: "Account created. Check your email for the verification code.",
      data: {
        email: user.email
      }
    });
  }
);

export const verifyEmail: RequestHandler = asyncHandler(
  async (request, response) => {
    const { email, otp } = request.body;

    const user = await User.findOne({
      email,
      "emailVerification.otpHash": hashValue(otp),
      "emailVerification.expiresAt": {
        $gt: new Date()
      }
    }).select("+emailVerification.otpHash");

    if (!user) {
      throw new AppError(
        "The verification code is invalid or expired.",
        400
      );
    }

    user.emailVerified = true;
    user.emailVerification = undefined;
    await user.save();

    response.status(200).json({
      success: true,
      message: "Email verified successfully."
    });
  }
);

export const resendVerificationOtp: RequestHandler = asyncHandler(
  async (request, response) => {
    const { email } = request.body;

    const user = await User.findOne({ email });

    if (user && !user.emailVerified) {
      const otp = createOtp();

      user.emailVerification = {
        otpHash: hashValue(otp),
        expiresAt: addMinutes(OTP_EXPIRY_MINUTES),
        sentAt: new Date()
      };

      await user.save();
      await sendVerificationOtp(user.email, user.firstName, otp);
    }

    response.status(200).json({
      success: true,
      message: "If an unverified account exists, a new code was sent."
    });
  }
);

export const login: RequestHandler = asyncHandler(
  async (request, response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (!user.emailVerified) {
      throw new AppError(
        "Verify your email address before signing in.",
        403
      );
    }

    const tokens = await createSession(user, request);

    setRefreshCookie(response, tokens.refreshToken);

    response.status(200).json({
      success: true,
      message: "Signed in successfully.",
      data: {
        accessToken: tokens.accessToken,
        user: getPublicUser(user)
      }
    });
  }
);

export const refresh: RequestHandler = asyncHandler(
  async (request, response) => {
    const refreshToken = getRefreshTokenFromRequest(request);

    if (!refreshToken) {
      throw new AppError("Refresh token is required.", 401);
    }

    const { user, tokens } = await rotateSession(
      refreshToken,
      request,
      async (userId) => User.findById(userId)
    );

    setRefreshCookie(response, tokens.refreshToken);

    response.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        user: getPublicUser(user)
      }
    });
  }
);

export const logout: RequestHandler = asyncHandler(
  async (request, response) => {
    await removeRefreshSession(getRefreshTokenFromRequest(request));
    clearRefreshCookie(response);

    response.status(200).json({
      success: true,
      message: "Signed out successfully."
    });
  }
);

export const forgotPassword: RequestHandler = asyncHandler(
  async (request, response) => {
    const { email } = request.body;
    const user = await User.findOne({ email });

    if (user) {
      const otp = createOtp();

      user.passwordReset = {
        otpHash: hashValue(otp),
        expiresAt: addMinutes(OTP_EXPIRY_MINUTES),
        sentAt: new Date()
      };

      await user.save();
      await sendPasswordResetOtp(user.email, user.firstName, otp);
    }

    response.status(200).json({
      success: true,
      message: "If an account exists, a password reset code was sent."
    });
  }
);

export const resetPassword: RequestHandler = asyncHandler(
  async (request, response) => {
    const { email, otp, password } = request.body;

    const user = await User.findOne({
      email,
      "passwordReset.otpHash": hashValue(otp),
      "passwordReset.expiresAt": {
        $gt: new Date()
      }
    }).select("+passwordReset.otpHash");

    if (!user) {
      throw new AppError(
        "The password reset code is invalid or expired.",
        400
      );
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordReset = undefined;

    await user.save();
    await removeAllUserSessions(user.id);

    response.status(200).json({
      success: true,
      message: "Password reset successfully. Please sign in."
    });
  }
);

export const me: RequestHandler = asyncHandler(
  async (request, response) => {
    if (!request.auth?.userId) {
      throw new AppError("Authentication is required.", 401);
    }

    const user = await User.findById(request.auth.userId);

    if (!user) {
      throw new AppError("User account was not found.", 404);
    }

    response.status(200).json({
      success: true,
      data: {
        user: getPublicUser(user)
      }
    });
  }
);