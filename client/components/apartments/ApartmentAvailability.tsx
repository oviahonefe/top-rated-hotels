"use client";

import Link from "next/link";
import { useState } from "react";
import type { Apartment } from "@/lib/home-data";

type ApartmentAvailabilityProps = {
  apartment: Apartment;
};

export default function ApartmentAvailability({
  apartment,
}: ApartmentAvailabilityProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 guests");

  return (
    <aside className="h-fit border border-border bg-background p-5 shadow-lg lg:sticky lg:top-24">
      <p className="text-sm font-semibold text-muted-foreground">
        Starting from
      </p>

      <p className="mt-1 text-2xl font-extrabold text-primary">
        {apartment.priceLabel}
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Select your stay details before continuing to a secure booking request.
      </p>

      <div className="mt-6 grid gap-4 border-y border-border py-5">
        <label className="block">
          <span className="text-sm font-bold text-primary">Check-in date</span>

          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-primary">Check-out date</span>

          <input
            type="date"
            min={checkIn}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-primary">Guests</span>

          <select
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option>1 guest</option>
            <option>2 guests</option>
            <option>3 guests</option>
            <option>4 guests</option>
            <option>5+ guests</option>
          </select>
        </label>
      </div>

      <Link
        href={`/bookings?hotel=${apartment.id}`}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark"
      >
        Reserve apartment
      </Link>
    </aside>
  );
}