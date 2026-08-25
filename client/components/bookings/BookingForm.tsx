"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Hotel } from "@/lib/home-data";
import BookingSummary from "@/components/bookings/BookingSummary";
import DateRangePicker from "@/components/bookings/DateRangePicker";

type BookingFormProps = {
  hotel: Hotel;
};

export default function BookingForm({ hotel }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 guests");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 4;
    }

    const startDate = new Date(`${checkIn}T00:00:00`);
    const endDate = new Date(`${checkOut}T00:00:00`);
    const difference = endDate.getTime() - startDate.getTime();
    const calculatedNights = Math.ceil(difference / 86_400_000);

    return calculatedNights > 0 ? calculatedNights : 1;
  }, [checkIn, checkOut]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <form
        onSubmit={handleSubmit}
        className="border border-border bg-background p-6 sm:p-8"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
            Complete your request
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
            Reserve your stay
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Enter your stay details. You will review your booking and choose a
            payment method before anything is confirmed.
          </p>
        </div>

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-primary">Stay details</h2>

          <div className="mt-5">
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
            />
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-primary">Guests</span>

            <select
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              <option>1 guest</option>
              <option>2 guests</option>
              <option>3 guests</option>
              <option>4 guests</option>
              <option>5 guests</option>
              <option>6+ guests</option>
            </select>
          </label>
        </section>

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-primary">
            Guest information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
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

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <FormField
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
            />

            <FormField
              id="phone"
              label="Phone number"
              type="tel"
              placeholder="+34 000 000 000"
            />
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-primary">
              Special requests
            </span>

            <textarea
              name="specialRequests"
              rows={5}
              placeholder="Optional: arrival time, accessibility needs, or anything your host should know."
              className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </section>

        {isSubmitted ? (
          <div
            role="status"
            className="mt-8 border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800"
          >
            Your booking request is ready. The next step will be payment
            selection when we connect the backend.
          </div>
        ) : null}

        <button
          type="submit"
          className="mt-8 h-12 w-full rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-dark sm:w-auto"
        >
          Continue to payment
        </button>
      </form>

      <BookingSummary hotel={hotel} nights={nights} guests={guests} />
    </div>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
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