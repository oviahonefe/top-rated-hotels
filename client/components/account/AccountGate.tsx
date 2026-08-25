"use client";

import {
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError, AUTH_CHANGED_EVENT, USER_KEY } from "@/lib/api";
import { getCurrentUser } from "@/lib/account-api";

type Props = {
  children: ReactNode;
};

export default function AccountGate({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const user = await getCurrentUser();

        if (!active) return;

        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
        setReady(true);
      } catch (requestError) {
        if (!active) return;

        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          router.replace("/auth/login");
          return;
        }

        setError("Unable to load your account right now.");
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [router]);

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
        {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="border border-border bg-background p-8 text-sm font-semibold text-muted-foreground">
        Loading your account…
      </div>
    );
  }

  return <>{children}</>;
}