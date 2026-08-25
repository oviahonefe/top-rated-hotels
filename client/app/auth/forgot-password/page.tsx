"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import SiteContainer from "@/components/ui/SiteContainer";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      await authApi.forgotPassword(email);
      setCodeSent(true);
      setMessage("If an account exists, a reset code has been sent.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to request a reset code.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const otp = String(formData.get("otp") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      setSubmitting(true);
      setMessage("");
      await authApi.resetPassword(email, otp, password);
      setMessage("Password reset successfully. You can now sign in.");
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to reset your password.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="flex min-h-[calc(100svh-5rem)] items-center py-10">
        <section className="mx-auto w-full max-w-xl border border-border bg-background p-6 sm:p-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Account recovery
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-primary">
            Reset your password
          </h1>

          {!codeSent ? (
            <form onSubmit={requestCode} className="mt-8 grid gap-5">
              <label>
                <span className="text-sm font-bold text-primary">
                  Email address
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-12 w-full border border-border bg-surface px-4 text-primary outline-none focus:border-accent"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="h-12 rounded-full bg-accent px-6 text-sm font-bold text-white disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset code"}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="mt-8 grid gap-5">
              <label>
                <span className="text-sm font-bold text-primary">
                  Six-digit reset code
                </span>
                <input
                  name="otp"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  className="mt-2 h-12 w-full border border-border bg-surface px-4 text-center text-lg font-bold tracking-[0.3em] text-primary outline-none focus:border-accent"
                />
              </label>

              <label>
                <span className="text-sm font-bold text-primary">
                  New password
                </span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="mt-2 h-12 w-full border border-border bg-surface px-4 text-primary outline-none focus:border-accent"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="h-12 rounded-full bg-accent px-6 text-sm font-bold text-white disabled:opacity-60"
              >
                {submitting ? "Resetting…" : "Reset password"}
              </button>
            </form>
          )}

          {message ? (
            <p className="mt-6 border border-accent/30 bg-accent/5 p-4 text-sm font-semibold text-primary">
              {message}
            </p>
          ) : null}

          <Link
            href="/auth/login"
            className="mt-7 inline-flex text-sm font-bold text-accent"
          >
            Back to sign in
          </Link>
        </section>
      </SiteContainer>
    </main>
  );
}