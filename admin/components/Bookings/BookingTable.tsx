"use client";

import Image from "next/image";
import type { AdminBooking } from "@/lib/api-types";

type BookingTableProps = {
  bookings: AdminBooking[];
  actionReference: string | null;
  onReviewPayment: (
    booking: AdminBooking,
    decision: "approve" | "reject",
  ) => void;
};

const bookingStatusStyles = {
  pending: "bg-amber-50 text-amber-800",
  confirmed: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-blue-50 text-blue-700",
  expired: "bg-slate-100 text-slate-600",
};

const paymentStatusStyles = {
  awaiting_payment: "bg-slate-100 text-slate-700",
  submitted: "bg-orange-50 text-orange-700",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-red-50 text-red-700",
};

export default function BookingTable({
  bookings,
  actionReference,
  onReviewPayment,
}: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <h2 className="text-xl font-bold text-slate-950">
          No bookings match these filters
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Booking records will appear here as guests complete reservations.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full min-w-[1180px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <th className="px-5 py-4">Booking</th>
            <th className="px-5 py-4">Guest</th>
            <th className="px-5 py-4">Stay dates</th>
            <th className="px-5 py-4">Total</th>
            <th className="px-5 py-4">Payment</th>
            <th className="px-5 py-4">Booking status</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => {
            const isReviewing = actionReference === booking.bookingReference;
            const needsReview = booking.payment.status === "submitted";

            return (
              <tr
                key={booking._id}
                className="border-b border-slate-200 align-top last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-slate-100">
                      {booking.propertyImageUrl ? (
                        <Image
                          src={booking.propertyImageUrl}
                          alt={booking.propertyName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid h-full place-items-center text-xs font-semibold text-slate-400">
                          No image
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">
                        {booking.propertyName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {booking.propertyLocation}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-orange-600">
                        {booking.bookingReference}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm">
                  <p className="font-semibold text-slate-950">
                    {booking.guest.firstName} {booking.guest.lastName}
                  </p>
                  <p className="mt-1 text-slate-500">{booking.guest.email}</p>
                  <p className="mt-1 text-slate-500">
                    {booking.guestCount} guest
                    {booking.guestCount === 1 ? "" : "s"}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm">
                  <p className="font-semibold text-slate-950">
                    {formatDate(booking.checkInDate)}
                  </p>
                  <p className="mt-1 text-slate-500">
                    to {formatDate(booking.checkOutDate)}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {booking.price.nights} nights
                  </p>
                </td>

                <td className="px-5 py-4 text-sm font-bold text-slate-950">
                  {formatMoney(
                    booking.price.totalCents,
                    booking.price.currency,
                  )}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-bold capitalize ${
                      paymentStatusStyles[booking.payment.status]
                    }`}
                  >
                    {booking.payment.status.replaceAll("_", " ")}
                  </span>

                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    {booking.payment.methodName}
                  </p>

                  {booking.payment.transactionReference ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Ref: {booking.payment.transactionReference}
                    </p>
                  ) : null}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-bold capitalize ${
                      bookingStatusStyles[booking.status]
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {needsReview ? (
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        disabled={isReviewing}
                        onClick={() => onReviewPayment(booking, "approve")}
                        className="text-sm font-bold text-emerald-700 transition hover:text-emerald-800 disabled:opacity-50"
                      >
                        {isReviewing ? "Reviewing..." : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={isReviewing}
                        onClick={() => onReviewPayment(booking, "reject")}
                        className="text-sm font-bold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p className="text-right text-sm font-medium text-slate-500">
                      No action needed
                    </p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(amountInCents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amountInCents / 100);
}