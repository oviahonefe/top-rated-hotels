"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ApiError, formatUsd } from "@/lib/api";
import { getMyBookings } from "@/lib/account-api";
import type { Booking } from "@/types/booking";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClass(status: Booking["status"]) {
  if (status === "confirmed") {
    return "bg-green-50 text-green-700";
  }

  if (status === "pending") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "cancelled" || status === "expired") {
    return "bg-red-50 text-red-700";
  }

  return "bg-surface text-primary";
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const result = await getMyBookings();
        if (active) setBookings(result);
      } catch (requestError) {
        if (
          requestError instanceof ApiError &&
          requestError.status === 401
        ) {
          setError("Please sign in to view your bookings.");
        } else {
          setError("Unable to load your bookings.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const { activeBookings, archivedBookings } = useMemo(() => {
    return {
      activeBookings: bookings.filter(
        (booking) =>
          booking.status === "pending" ||
          booking.status === "confirmed",
      ),
      archivedBookings: bookings.filter(
        (booking) =>
          booking.status !== "pending" &&
          booking.status !== "confirmed",
      ),
    };
  }, [bookings]);

  if (loading) {
    return <p className="py-12 text-muted-foreground">Loading bookings…</p>;
  }

  if (error) {
    return <p className="py-12 text-red-700">{error}</p>;
  }

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
              Coming up
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary">
              Active bookings
            </h2>
          </div>

          <Link href="/hotels" className="text-sm font-bold text-accent">
            Find a stay
          </Link>
        </div>

        {activeBookings.length ? (
          <div className="mt-6 grid gap-4">
            {activeBookings.map((booking) => (
              <BookingRow key={booking.bookingReference} booking={booking} />
            ))}
          </div>
        ) : (
          <EmptyBookings />
        )}
      </section>

      <section>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
          Your history
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-primary">
          Past bookings
        </h2>

        {archivedBookings.length ? (
          <div className="mt-6 grid gap-4">
            {archivedBookings.map((booking) => (
              <BookingRow key={booking.bookingReference} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Your completed, cancelled, and expired bookings will appear here.
          </p>
        )}
      </section>
    </div>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const href =
    booking.propertyKind === "hotel"
      ? `/hotels/${booking.propertyId}`
      : `/apartments/${booking.propertyId}`;

  return (
    <article className="grid gap-5 border border-border bg-background p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-6">
      {booking.propertyImageUrl ? (
        <img
          src={booking.propertyImageUrl}
          alt=""
          className="h-40 w-full object-cover sm:h-full"
        />
      ) : (
        <div className="min-h-32 bg-surface" />
      )}

      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className={`inline-flex px-3 py-1 text-xs font-extrabold capitalize ${statusClass(booking.status)}`}>
              {booking.status.replace("-", " ")}
            </span>

            <p className="mt-4 text-sm font-bold text-accent">
              {booking.propertyLocation}
            </p>

            <h3 className="mt-1 text-xl font-extrabold text-primary">
              {booking.propertyName}
            </h3>
          </div>

          <p className="text-sm font-semibold text-muted-foreground">
            {booking.bookingReference}
          </p>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <Info label="Check-in" value={formatDate(booking.checkInDate)} />
          <Info label="Check-out" value={formatDate(booking.checkOutDate)} />
          <Info label="Guests" value={`${booking.guestCount} guest${booking.guestCount === 1 ? "" : "s"}`} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <p className="font-extrabold text-primary">
            {formatUsd(booking.price.totalCents)}
          </p>

          <Link href={href} className="text-sm font-extrabold text-accent">
            View property
          </Link>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-semibold text-primary">{value}</p>
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="mt-6 border border-dashed border-border bg-background p-10 text-center">
      <h3 className="text-xl font-extrabold text-primary">
        No active bookings
      </h3>
      <p className="mt-3 text-sm text-muted-foreground">
        Your confirmed and payment-pending bookings will appear here.
      </p>
      <Link
        href="/hotels"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white"
      >
        Explore stays
      </Link>
    </div>
  );
}