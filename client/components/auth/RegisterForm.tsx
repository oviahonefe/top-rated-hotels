"use client";

import { FormEvent, useState } from "react";

export default function RegisterForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Account registration will connect to the secure authentication API when we build the backend.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="firstName"
          label="First name"
          placeholder="Your first name"
        />

        <FormField
          id="lastName"
          label="Last name"
          placeholder="Your last name"
        />
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
            onClick={() => setIsPasswordVisible((current) => !current)}
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
          role="status"
          className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm font-semibold text-primary"
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        className="h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-dark"
      >
        Create account
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