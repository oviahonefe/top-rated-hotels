import { Router } from "express";

import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resendVerificationOtp,
  resetPassword,
  verifyEmail
} from "./auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyEmailSchema
} from "./auth.validation.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/verify-email", validateBody(verifyEmailSchema), verifyEmail);
authRouter.post("/resend-verification", validateBody(resendOtpSchema), resendVerificationOtp);

authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authenticate, me);

authRouter.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);