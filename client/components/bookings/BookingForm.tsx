"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBooking,
  getBookingQuote,
  getPaymentMethods,
} from "@/lib/account-api";
import { ApiError, formatUsd } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type {
  BookingQuote,
  PaymentMethod,
} from "@/types/booking";
import type { PublicProperty } from "@/types/property";

type BookingFormProps = {
  property: PublicProperty;
  unitKey: string;
  initialCheckInDate?: string;
  initialCheckOutDate?: string;
  initialGuestCount?: number;
};

export default function BookingForm({
  property,
  unitKey,
  initialCheckInDate = "",
  initialCheckOutDate = "",
  initialGuestCount = 1,
}: BookingFormProps) {
  const router = useRouter();
  const user = getStoredUser();

  const [checkInDate, setCheckInDate] = useState(initialCheckInDate);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate);
  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [message, setMessage] = useState("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxGuests = property.maxGuests ?? 1;
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!checkInDate || !checkOutDate) {
      setQuote(null);
      return;
    }

    let active = true;

    async function loadQuote() {
      try {
        setIsLoadingQuote(true);
        setMessage("");

        const result = await getBookingQuote({
          propertyId: property.id,
          propertyKind: property.kind,
          unitKey,
          checkInDate,
          checkOutDate,
          guestCount,
        });

        if (active) {
          setQuote(result);
        }
      } catch (error) {
        if (active) {
          setQuote(null);
          setMessage(
            error instanceof ApiError
              ? error.message
              : "Unable to calculate your booking price.",
          );
        }
      } finally {
        if (active) {
          setIsLoadingQuote(false);
        }
      }
    }

    void loadQuote();

    return () => {
      active = false;
    };
  }, [
    checkInDate,
    checkOutDate,
    guestCount,
    property.id,
    property.kind,
    unitKey,
  ]);

  useEffect(() => {
    let active = true;

    async function loadPaymentMethods() {
      try {
        const methods = await getPaymentMethods();

        if (!active) return;

        setPaymentMethods(methods);
        setPaymentMethodId(methods[0]?._id ?? "");
      } catch (error) {
        if (!active) return;

        setMessage(
          error instanceof ApiError && error.status === 401
            ? "Please sign in before continuing to payment."
            : "Unable to load payment methods.",
        );
      }
    }

    void loadPaymentMethods();

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!quote || !paymentMethodId) {
      setMessage(
        "Choose valid dates and a payment method before continuing.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      setIsSubmitting(true);

      const booking = await createBooking({
        propertyId: property.id,
        propertyKind: property.kind,
        unitKey,
        checkInDate,
        checkOutDate,
        guestCount,
        paymentMethodId,
        guest: {
          firstName: String(formData.get("firstName") ?? "").trim(),
          lastName: String(formData.get("lastName") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          phone: String(formData.get("phone") ?? "").trim() || undefined,
        },
      });

      router.push(`/bookings/${booking.bookingReference}`);
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to create your booking.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <form
        onSubmit={submit}
        className="border border-border bg-background p-6 sm:p-8"
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
          Secure booking
        </p>

        <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
          Reserve {property.name}
        </h1>

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-primary">
            Stay details
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label>
              <span className="text-sm font-bold text-primary">
                Check-in
              </span>
              <input
                type="date"
                required
                min={today}
                value={checkInDate}
                onChange={(event) => setCheckInDate(event.target.value)}
                className="mt-2 h-12 w-full border border-border bg-surface px-4 font-semibold text-primary outline-none focus:border-accent"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-primary">
                Check-out
              </span>
              <input
                type="date"
                required
                min={checkInDate || today}
                value={checkOutDate}
                onChange={(event) => setCheckOutDate(event.target.value)}
                className="mt-2 h-12 w-full border border-border bg-surface px-4 font-semibold text-primary outline-none focus:border-accent"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-primary">Guests</span>
            <select
              value={guestCount}
              onChange={(event) =>
                setGuestCount(Number(event.target.value))
              }
              className="mt-2 h-12 w-full border border-border bg-surface px-4 font-semibold text-primary outline-none focus:border-accent"
            >
              {Array.from(
                { length: Math.max(maxGuests, 1) },
                (_, index) => index + 1,
              ).map((count) => (
                <option key={count} value={count}>
                  {count} guest{count === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-primary">
            Guest information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="firstName"
              label="First name"
              defaultValue={user?.firstName}
            />
            <Field
              id="lastName"
              label="Last name"
              defaultValue={user?.lastName}
            />
            <Field
              id="email"
              label="Email address"
              type="email"
              defaultValue={user?.email}
            />
            <Field id="phone" label="Phone number" type="tel" />
          </div>
        </section>

        <section className="mt-8 border-t border-border pt-8">
          <h2 className="text-xl font-extrabold text-primary">
            Payment method
          </h2>

          <div className="mt-5 grid gap-3">
            {paymentMethods.map((method) => (
              <label
                key={method._id}
                className="flex cursor-pointer gap-3 border border-border bg-surface p-4"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethodId === method._id}
                  onChange={() => setPaymentMethodId(method._id)}
                />
                <span>
                  <span className="block font-extrabold text-primary">
                    {method.displayName}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {method.currency} · {method.type.replace("_", " ")}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        {message ? (
          <p className="mt-7 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || isLoadingQuote || !quote}
          className="mt-8 h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Creating booking…"
            : "Create payment-pending booking"}
        </button>
      </form>

      <aside className="h-fit border border-border bg-background p-5 shadow-lg lg:sticky lg:top-24">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
          Booking summary
        </p>

        <h2 className="mt-3 text-xl font-extrabold text-primary">
          {property.name}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {property.address.city}, {property.address.country}
        </p>

        {isLoadingQuote ? (
          <p className="mt-7 text-sm text-muted-foreground">
            Calculating platform price…
          </p>
        ) : quote ? (
          <div className="mt-7 space-y-4 border-y border-border py-5 text-sm">
            <SummaryRow
              label="Length of stay"
              value={`${quote.quote.nights} nights`}
            />
            <SummaryRow
              label="Nightly platform rate"
              value={formatUsd(quote.quote.nightlyRateCents)}
            />
            <SummaryRow
              label="Accommodation subtotal"
              value={formatUsd(
                quote.quote.accommodationSubtotalCents,
              )}
            />
            <div className="flex items-end justify-between gap-4 pt-3">
              <span className="font-bold text-primary">Total</span>
              <span className="text-xl font-extrabold text-primary">
                {formatUsd(quote.quote.totalCents)}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-7 text-sm text-muted-foreground">
            Select valid check-in and check-out dates to receive your quote.
          </p>
        )}

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          The booking remains pending until you submit a payment reference and
          an administrator approves it.
        </p>
      </aside>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "tel";
  defaultValue?: string;
}) {
  return (
    <label>
      <span className="text-sm font-bold text-primary">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        required={id !== "phone"}
        defaultValue={defaultValue}
        className="mt-2 h-12 w-full border border-border bg-surface px-4 font-medium text-primary outline-none focus:border-accent"
      />
    </label>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold text-primary">{value}</span>
    </div>
  );
}