import {
  ACCESS_TOKEN_KEY,
  apiRequest,
  AUTH_CHANGED_EVENT,
  USER_KEY,
} from "@/lib/api";
import type {
  AuthSession,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "@/types/auth";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function hasStoredSession() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(ACCESS_TOKEN_KEY));
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(
    ACCESS_TOKEN_KEY,
    session.accessToken,
  );
  window.localStorage.setItem(
    USER_KEY,
    JSON.stringify(session.user),
  );
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export const authApi = {
  register(input: RegisterInput) {
    return apiRequest<{ email: string }>("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        email: normalizeEmail(input.email),
      }),
    });
  },

  verifyEmail(email: string, otp: string) {
    return apiRequest<void>("/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizeEmail(email),
        otp: otp.trim(),
      }),
    });
  },

  resendVerification(email: string) {
    return apiRequest<void>("/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizeEmail(email) }),
    });
  },

  async login(input: LoginInput) {
    const session = await apiRequest<AuthSession>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        email: normalizeEmail(input.email),
      }),
    });

    saveSession(session);
    return session;
  },

  async me() {
    const result = await apiRequest<{ user: AuthUser }>("/auth/me");
    return result.user;
  },

  async logout() {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    } finally {
      clearSession();
    }
  },

  forgotPassword(email: string) {
    return apiRequest<void>("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizeEmail(email) }),
    });
  },

  resetPassword(email: string, otp: string, password: string) {
    return apiRequest<void>("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizeEmail(email),
        otp: otp.trim(),
        password,
      }),
    });
  },
};