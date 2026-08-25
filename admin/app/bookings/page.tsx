"use client";

import { useEffect, useMemo, useState } from "react";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import AdminShell from "@/components/layout/AdminShell";
import { apiRequest } from "@/lib/api-client";
import { useAdminAuth } from "@/providers/AuthProvider";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "expired";

type PaymentStatus =
  | "awaiting_payment"
  | "submitted"
  | "approved"
  | "rejected";

type AdminBooking = {
  _id: string;
  bookingReference: string;
  propertyName: string;
  propertyKind: "hotel" | "apartment";
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  price: {
    currency: string;
    nights: number;
    totalCents: number;
  };
  payment: {
    methodName?: string;
    status: PaymentStatus;
    transactionReference?: string;
    submittedAt?: string;
  };
  status: BookingStatus;
};

type BookingListResponse = {
  bookings: AdminBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export default function BookingsPage() {
  return (
    <AdminRouteGuard>
      <BookingsContent />
    </AdminRouteGuard>
  );
}

function BookingsContent() {
  const { authenticatedRequestToken } = useAdminAuth();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookingStatus, setBookingStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewingReference, setIsReviewingReference] = useState("");
  const [error, setError] = useState("");

  async function loadBookings() {
    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({
        page: "1",
        limit: "30",
        ...(bookingStatus ? { status: bookingStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      });

      const data = await apiRequest<BookingListResponse>(
        `/bookings/admin?${query.toString()}`,
        { token },
      );

      setBookings(data.bookings);
      setTotalBookings(data.pagination.total);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load booking records.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBookings();
  }, [bookingStatus, paymentStatus]);

  async function reviewPayment(
    booking: AdminBooking,
    decision: "approve" | "reject",
  ) {
    const label = decision === "approve" ? "approve" : "reject";
    const confirmed = window.confirm(
      `Do you want to ${label} payment for booking ${booking.bookingReference}?`,
    );

    if (!confirmed) {
      return;
    }

    const note =
      decision === "reject"
        ? window.prompt("Reason for rejecting this payment:")?.trim()
        : "";

    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setIsReviewingReference(booking.bookingReference);
    setError("");

    try {
      const updatedBooking = await apiRequest<AdminBooking>(
        `/bookings/admin/${booking.bookingReference}/payment-review`,
        {
          method: "POST",
          token,
          body: {
            decision,
            ...(note ? { note } : {}),
          },
        },
      );

      setBookings((currentBookings) =>
        currentBookings.map((item) =>
          item._id === updatedBooking._id ? updatedBooking : item,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to review this payment.",
      );
    } finally {
      setIsReviewingReference("");
    }
  }

  const metrics = useMemo(
    () => ({
      awaitingPayment: bookings.filter(
        (booking) => booking.payment.status === "awaiting_payment",
      ).length,
      readyForReview: bookings.filter(
        (booking) => booking.payment.status === "submitted",
      ).length,
      confirmed: bookings.filter(
        (booking) => booking.status === "confirmed",
      ).length,
    }),
    [bookings],
  );

  return (
    <AdminShell>
      <main className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f47c20]">
              Guest operations
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#18295d] sm:text-4xl">
              Bookings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Review guest reservations, verify payment submissions, and keep
              every Top Rated Apartment Hotels stay moving smoothly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadBookings()}
            className="h-11 border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-[#18295d]"
          >
            Refresh bookings
          </button>
        </section>

        {error ? (
          <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Booking records" value={totalBookings} />
          <MetricCard
            label="Awaiting payment"
            value={metrics.awaitingPayment}
          />
          <MetricCard
            label="Payment review queue"
            value={metrics.readyForReview}
            emphasis
          />
          <MetricCard label="Confirmed stays" value={metrics.confirmed} />
        </section>

        <section className="mt-8 border border-slate-200 bg-white">
          <div className="flex flex-col gap-5 border-b border-slate-200 p-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                Live booking records
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                Guest reservation queue
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Booking status
                <select
                  value={bookingStatus}
                  onChange={(event) => setBookingStatus(event.target.value)}
                  className="field-input min-w-44"
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Payment status
                <select
                  value={paymentStatus}
                  onChange={(event) => setPaymentStatus(event.target.value)}
                  className="field-input min-w-44"
                >
                  <option value="">All payments</option>
                  <option value="awaiting_payment">Awaiting payment</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
            </div>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm font-semibold text-slate-600">
              Loading booking records from the live API...
            </p>
          ) : bookings.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-xl font-extrabold text-[#18295d]">
                No bookings match this view
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
                New guest reservations and payment submissions will appear here
                as your marketplace begins receiving bookings.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4">Guest</th>
                    <th className="px-5 py-4">Stay</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Booking</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {bookings.map((booking) => {
                    const isReviewing =
                      isReviewingReference === booking.bookingReference;

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50">
                        <td className="px-5 py-5">
                          <p className="font-extrabold text-[#18295d]">
                            {booking.bookingReference}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {booking.propertyKind}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-900">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {booking.guest.email}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-bold text-slate-800">
                            {booking.propertyName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {booking.checkInDate} to {booking.checkOutDate}
                          </p>
                        </td>

                        <td className="px-5 py-5 font-bold text-slate-800">
                          {formatMoney(
                            booking.price.totalCents,
                            booking.price.currency,
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge value={booking.payment.status} />
                        </td>

                        <td className="px-5 py-5">
                          <StatusBadge value={booking.status} />
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-3">
                            {booking.payment.status === "submitted" ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isReviewing}
                                  onClick={() =>
                                    void reviewPayment(booking, "approve")
                                  }
                                  className="text-sm font-bold text-emerald-700 transition hover:text-emerald-900 disabled:text-slate-400"
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  disabled={isReviewing}
                                  onClick={() =>
                                    void reviewPayment(booking, "reject")
                                  }
                                  className="text-sm font-bold text-red-700 transition hover:text-red-900 disabled:text-slate-400"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="max-w-40 text-right text-xs font-semibold text-slate-500">
                                {booking.payment.transactionReference
                                  ? `Payment ref: ${booking.payment.transactionReference}`
                                  : "No payment reference yet"}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis
          ? "border border-[#18295d] bg-[#18295d] p-5 text-white"
          : "border border-slate-200 bg-white p-5"
      }
    >
      <p
        className={
          emphasis
            ? "text-sm font-bold text-blue-100"
            : "text-sm font-bold text-slate-600"
        }
      >
        {label}
      </p>
      <p
        className={
          emphasis
            ? "mt-3 text-4xl font-extrabold text-white"
            : "mt-3 text-4xl font-extrabold text-[#18295d]"
        }
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    awaiting_payment: "bg-slate-100 text-slate-700",
    submitted: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    pending: "bg-blue-100 text-blue-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-emerald-100 text-emerald-800",
    expired: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-bold capitalize ${
        styles[value] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "EUR",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}