"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { authApi } from "@/lib/auth";

export default function RegisterForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "");
    const lastName = String(formData.get("lastName") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      setIsSubmitting(true);
      await authApi.register({
        firstName,
        lastName,
        email,
        password,
      });

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`,
      );
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="firstName" label="First name" placeholder="Your first name" />
        <FormField id="lastName" label="Last name" placeholder="Your last name" />
      </div>

      <FormField
        id="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
      />

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="text-sm font-bold text-primary">
            Create a password
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
          name="password"
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          required
          placeholder="At least 8 characters"
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[#f1802b]"
        />
        <span>
          I agree to the platform terms and privacy policy for Top Rated
          Apartment Hotels.
        </span>
      </label>

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
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "email";
};

function FormField({
  id,
  label,
  placeholder,
  type = "text",
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-primary">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}