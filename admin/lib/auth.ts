import { apiRequest } from "@/lib/api-client";
import type { AuthUser } from "@/lib/api-types";

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type MeResponse = {
  user: AuthUser;
};

export function loginAdmin(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function refreshAdminSession() {
  return apiRequest<LoginResponse>("/auth/refresh", {
    method: "POST",
  });
}

export function getCurrentAdmin(accessToken: string) {
  return apiRequest<MeResponse>("/auth/me", {
    token: accessToken,
  });
}

export function logoutAdmin() {
  return apiRequest<never>("/auth/logout", {
    method: "POST",
  });
}