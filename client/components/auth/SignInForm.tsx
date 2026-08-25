"use client";

import { FormEvent, useState } from "react";

export default function SignInForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Sign-in will connect to the secure authentication API when we build the backend.",
    );
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
            onClick={() => setIsPasswordVisible((current) => !current)}
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

      <label className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
        <input
          type="checkbox"
          name="remember"
          className="h-4 w-4 accent-[#f1802b]"
        />
        Keep me signed in
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
        className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Sign in
      </button>
    </form>
  );
}