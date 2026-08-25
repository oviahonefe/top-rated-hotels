"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setMessage(
      "Your enquiry is ready to be sent. We will connect this form to the contact API during backend development.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
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

      <label className="block">
        <span className="text-sm font-bold text-primary">
          What can we help with?
        </span>

        <select
          name="topic"
          required
          defaultValue=""
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          <option value="" disabled>
            Select a topic
          </option>
          <option value="booking">Booking support</option>
          <option value="property">List a property</option>
          <option value="payment">Payment question</option>
          <option value="general">General enquiry</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-bold text-primary">Message</span>

        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us how we can help..."
          className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
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
        Send message
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