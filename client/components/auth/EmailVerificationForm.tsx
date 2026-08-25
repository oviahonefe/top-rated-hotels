"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/auth";

type Props = {
  email: string;
};

export default function EmailVerificationForm({ email }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const otp = String(new FormData(event.currentTarget).get("otp") ?? "");

    try {
      setIsSubmitting(true);
      await authApi.verifyEmail(email, otp);
      router.replace("/auth/login?verified=1");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to verify this email address.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resend() {
    try {
      setIsResending(true);
      await authApi.resendVerification(email);
      setMessage("A new verification code has been sent.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to resend the verification code.",
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form onSubmit={verify} className="mt-8 grid gap-5">
      <label className="block">
        <span className="text-sm font-bold text-primary">
          Six-digit verification code
        </span>
        <input
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-center text-lg font-bold tracking-[0.35em] text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>

      {message ? (
        <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm font-semibold text-primary">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Verifying…" : "Verify email"}
      </button>

      <button
        type="button"
        onClick={resend}
        disabled={isResending}
        className="text-sm font-bold text-accent disabled:opacity-60"
      >
        {isResending ? "Sending…" : "Resend code"}
      </button>
    </form>
  );
}