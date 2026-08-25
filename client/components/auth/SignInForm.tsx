"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/auth";

export default function SignInForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      setIsSubmitting(true);
      await authApi.login({ email, password });
      router.replace("/account");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <label className="block">
        <span className="text-sm font-bold text-primary">Email address</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="text-sm font-bold text-primary">
            Password
          </label>

          <button
            type="button"
            onClick={() => setIsPasswordVisible((value) => !value)}
            className="text-sm font-bold text-accent transition hover:text-accent-dark"
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        </div>

        <input
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          required
          placeholder="Enter your password"
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {message ? (
        <p
          role="alert"
          className="border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}