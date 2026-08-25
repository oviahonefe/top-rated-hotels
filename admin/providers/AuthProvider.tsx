"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiClientError } from "@/lib/api-client";
import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminSession,
} from "@/lib/auth";
import type { AuthUser } from "@/lib/api-types";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  authenticatedRequestToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function hasAdminRole(user: AuthUser | null) {
  return user?.role === "admin" || user?.role === "super_admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const resetSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      const session = await refreshAdminSession();

      if (!hasAdminRole(session.user)) {
        await logoutAdmin().catch(() => undefined);
        resetSession();
        return;
      }

      const currentUser = await getCurrentAdmin(session.accessToken);

      if (!hasAdminRole(currentUser.user)) {
        await logoutAdmin().catch(() => undefined);
        resetSession();
        return;
      }

      setAccessToken(session.accessToken);
      setUser(currentUser.user);
    } catch {
      resetSession();
    } finally {
      setIsLoading(false);
    }
  }, [resetSession]);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await loginAdmin(email, password);

    if (!hasAdminRole(session.user)) {
      await logoutAdmin().catch(() => undefined);
      throw new ApiClientError(
        "This account does not have administrator access.",
        403,
      );
    }

    setAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      resetSession();
    }
  }, [resetSession]);

  const authenticatedRequestToken = useCallback(async () => {
    if (accessToken) {
      return accessToken;
    }

    const session = await refreshAdminSession();

    if (!hasAdminRole(session.user)) {
      resetSession();
      throw new ApiClientError("Administrator access is required.", 403);
    }

    setAccessToken(session.accessToken);
    setUser(session.user);

    return session.accessToken;
  }, [accessToken, resetSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isAdmin: hasAdminRole(user),
      signIn,
      signOut,
      authenticatedRequestToken,
    }),
    [
      accessToken,
      authenticatedRequestToken,
      isLoading,
      signIn,
      signOut,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AuthProvider.");
  }

  return context;
}