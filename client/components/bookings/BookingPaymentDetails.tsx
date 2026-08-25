"use client";

import Link from "next/link";
import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {
  getMyBooking,
  submitBookingPayment,
} from "@/lib/account-api";
import { ApiError, formatUsd } from "@/lib/api";
import type { Booking } from "@/types/booking";

type Props = {
  bookingReference: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function BookingPaymentDetails({
  bookingReference,
}: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    void getMyBooking(bookingReference)
      .then((result) => {
        if (active) setBooking(result);
      })
      .catch((error) => {
        if (!active) return;

        setMessage(
          error instanceof ApiError
            ? error.message
            : "Unable to load this booking.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [bookingReference]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!booking) return;

    const formData = new FormData(event.currentTarget);
    const transactionReference = String(
      formData.get("transactionReference") ?? "",
    ).trim();
    const note = String(formData.get("note") ?? "").trim();

    try {
      setSubmitting(true);
      setMessage("");

      const updatedBooking = await submitBookingPayment(
        booking.bookingReference,
        transactionReference,
        note || undefined,
      );

      setBooking(updatedBooking);
      setMessage(
        "Payment reference submitted. An administrator will review it shortly.",
      );
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to submit your payment reference.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        Loading booking…
      </p>
    );
  }

  if (!booking) {
    return (
      <section className="border border-red-200 bg-red-50 p-8 text-red-700">
        {message || "Booking not found."}
      </section>
    );
  }

  const canSubmitPayment =
    booking.status === "pending" &&
    booking.payment.status === "awaiting_payment";

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <section className="border border-border bg-background p-6 sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
          Booking {booking.bookingReference}
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-primary">
          {booking.propertyName}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {booking.propertyLocation}
        </p>

        <div className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-3">
          <Info
            label="Check-in"
            value={formatDate(booking.checkInDate)}
          />
          <Info
            label="Check-out"
            value={formatDate(booking.checkOutDate)}
          />
          <Info
            label="Guests"
            value={`${booking.guestCount} guest${booking.guestCount === 1 ? "" : "s"}`}
          />
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-primary">
            Payment instructions
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {booking.payment.instructions}
          </p>

          <div className="mt-5 grid gap-3">
            {booking.payment.details.map((detail) => (
              <div
                key={`${detail.label}-${detail.value}`}
                className="border border-border bg-surface p-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  {detail.label}
                </p>
                <p className="mt-2 break-all font-bold text-primary">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {canSubmitPayment ? (
          <form
            onSubmit={submitPayment}
            className="mt-8 border-t border-border pt-8"
          >
            <h2 className="text-xl font-extrabold text-primary">
              Submit payment reference
            </h2>

            <label className="mt-5 block">
              <span className="text-sm font-bold text-primary">
                Transfer or transaction reference
              </span>
              <input
                name="transactionReference"
                required
                minLength={3}
                className="mt-2 h-12 w-full border border-border bg-surface px-4 text-primary outline-none focus:border-accent"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-bold text-primary">
                Optional note
              </span>
              <textarea
                name="note"
                rows={4}
                className="mt-2 w-full border border-border bg-surface px-4 py-3 text-primary outline-none focus:border-accent"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white disabled:opacity-60"
            >
              {submitting
                ? "Submitting…"
                : "Submit payment reference"}
            </button>
          </form>
        ) : (
          <div className="mt-8 border-t border-border pt-8">
            <p className="font-bold text-primary">
              Payment status:{" "}
              <span className="capitalize">
                {booking.payment.status.replace("_", " ")}
              </span>
            </p>
          </div>
        )}

        {message ? (
          <p
            role="status"
            className="mt-6 border border-accent/30 bg-accent/5 p-4 text-sm font-semibold text-primary"
          >
            {message}
          </p>
        ) : null}
      </section>

      <aside className="h-fit border border-border bg-background p-5 shadow-lg lg:sticky lg:top-24">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
          Booking total
        </p>

        <div className="mt-5 space-y-4 border-y border-border py-5 text-sm">
          <Summary
            label="Length of stay"
            value={`${booking.price.nights} nights`}
          />
          <Summary
            label="Nightly rate"
            value={formatUsd(booking.price.nightlyRateCents)}
          />
          <Summary
            label="Payment method"
            value={booking.payment.methodName}
          />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <span className="font-bold text-primary">Total</span>
          <span className="text-2xl font-extrabold text-primary">
            {formatUsd(booking.price.totalCents)}
          </span>
        </div>

        <Link
          href="/account/bookings"
          className="mt-7 flex h-11 items-center justify-center rounded-full border border-primary px-5 text-sm font-bold text-primary"
        >
          View all bookings
        </Link>
      </aside>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-bold text-primary">{value}</p>
    </div>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-bold text-primary">{value}</span>
    </div>
  );
}