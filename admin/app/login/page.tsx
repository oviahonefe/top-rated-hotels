"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";
import { useAdminAuth } from "@/providers/AuthProvider";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1800&auto=format&fit=crop";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signIn(email.trim(), password);

      const requestedPath = searchParams.get("next");
      const nextPath =
        requestedPath && requestedPath.startsWith("/")
          ? requestedPath
          : "/dashboard";

      router.replace(nextPath);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Check your credentials and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f4f6fa] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="login-visual relative hidden overflow-hidden bg-[#18295d] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div
          aria-hidden="true"
          className="login-visual-image absolute -inset-8 opacity-45"
          style={{ backgroundImage: `url(${LOGIN_IMAGE})` }}
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#18295d]/75"
        />

        <div className="relative z-10">
          <TopRatedHotelsLogo
            href="/"
            className="[&>span:last-child>span:first-child]:text-white [&>span:last-child>span:last-child]:text-blue-100"
          />
        </div>

        <div className="login-copy relative z-10 max-w-xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-300">
            Operations console
          </p>

          <h1 className="mt-5 font-heading text-5xl font-extrabold leading-tight">
            Great stays deserve great operations.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-blue-100">
            The secure workspace for managing Top Rated Apartment Hotels across
            Malaga and Europe.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm font-semibold text-blue-100">
          <span className="h-px w-10 bg-orange-300" />
          Top Rated Apartment Hotels
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <TopRatedHotelsLogo href="/" />
          </div>

          <div className="mt-10 border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:mt-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f47c20]">
              Administrator access
            </p>

            <h2 className="mt-3 font-heading text-3xl font-extrabold text-[#18295d]">
              Sign in
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Continue to the Top Rated Apartment Hotels operations console.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Email address
                </span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@topratedhotels.com"
                  className="field-input"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Password
                </span>
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="field-input"
                />
              </label>

              {errorMessage ? (
                <p
                  role="alert"
                  className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800"
                >
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 bg-[#f47c20] px-5 text-sm font-bold text-white transition hover:bg-[#d96513] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Signing in..." : "Sign in to operations"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}