"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import AdminShell from "@/components/layout/AdminShell";
import { apiRequest } from "@/lib/api-client";
import type { AdminApartment, AdminHotel } from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

type AdminBooking = {
  _id: string;
  bookingReference: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  guest: {
    firstName: string;
    lastName: string;
  };
  payment: {
    status: "awaiting_payment" | "submitted" | "approved" | "rejected";
  };
  status: "pending" | "confirmed" | "cancelled" | "completed" | "expired";
};

type BookingsResponse = {
  bookings: AdminBooking[];
  pagination: {
    total: number;
  };
};

export default function DashboardPage() {
  return (
    <AdminRouteGuard>
      <DashboardContent />
    </AdminRouteGuard>
  );
}

function DashboardContent() {
  const { user, authenticatedRequestToken } = useAdminAuth();
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [apartments, setApartments] = useState<AdminApartment[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [bookingTotal, setBookingTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    const token = authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const [hotelData, apartmentData, bookingData] = await Promise.all([
        apiRequest<AdminHotel[]>("/admin/properties/hotels", { token }),
        apiRequest<AdminApartment[]>("/admin/properties/apartments", { token }),
        apiRequest<BookingsResponse>("/bookings/admin?page=1&limit=6", {
          token,
        }),
      ]);

      setHotels(hotelData);
      setApartments(apartmentData);
      setBookings(bookingData.bookings);
      setBookingTotal(bookingData.pagination.total);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: "Live hotels",
        value: hotels.filter((hotel) => hotel.status === "published").length,
        detail: `${hotels.length} total hotel listings`,
        href: "/hotels",
      },
      {
        label: "Live apartments",
        value: apartments.filter((item) => item.status === "published").length,
        detail: `${apartments.length} total apartment listings`,
        href: "/apartments",
      },
      {
        label: "Bookings",
        value: bookingTotal,
        detail: "All booking records",
        href: "/bookings",
      },
      {
        label: "Payments to review",
        value: bookings.filter(
          (booking) => booking.payment.status === "submitted",
        ).length,
        detail: "Submitted guest payments",
        href: "/bookings",
      },
    ],
    [apartments, bookingTotal, bookings, hotels],
  );

  return (
    <AdminShell>
      <main className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f47c20]">
              Top Rated Apartment Hotels
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#18295d] sm:text-4xl">
              Good morning, {user?.firstName ?? "Administrator"}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              A live view of your Europe stays marketplace, property supply,
              bookings, availability, and payment operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="h-11 border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-[#18295d]"
            >
              Refresh data
            </button>

            <Link
              href="/hotels/create"
              className="inline-flex h-11 items-center bg-[#f47c20] px-5 text-sm font-bold text-white transition hover:bg-[#d96513]"
            >
              Create hotel
            </Link>
          </div>
        </section>

        {error ? (
          <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {metrics.map((metric) => (
            <Link
              key={metric.label}
              href={metric.href}
              className="border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#18295d] hover:shadow-md"
            >
              <p className="text-sm font-bold text-slate-600">{metric.label}</p>
              <p className="mt-4 text-4xl font-extrabold text-[#18295d]">
                {isLoading ? "..." : metric.value}
              </p>
              <p className="mt-3 text-sm text-slate-500">{metric.detail}</p>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-8 2xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="border border-slate-200 bg-white">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                  Booking activity
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                  Recent booking records
                </h2>
              </div>

              <Link
                href="/bookings"
                className="text-sm font-bold text-[#18295d] hover:text-[#f47c20]"
              >
                Open bookings
              </Link>
            </div>

            {isLoading ? (
              <p className="p-6 text-sm font-semibold text-slate-600">
                Loading booking records...
              </p>
            ) : bookings.length === 0 ? (
              <div className="p-6">
                <h3 className="font-extrabold text-[#18295d]">
                  No bookings yet
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  New guest reservations will appear here once checkout begins
                  writing to the live booking API.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Reference</th>
                      <th className="px-5 py-3">Guest</th>
                      <th className="px-5 py-3">Property</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Booking</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-slate-50">
                        <td className="px-5 py-4 font-bold text-[#18295d]">
                          {booking.bookingReference}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {booking.guest.firstName} {booking.guest.lastName}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {booking.propertyName}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge value={booking.payment.status} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge value={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="border border-[#18295d] bg-[#18295d] p-6 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-300">
              Platform tools
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">
              Today&apos;s operations
            </h2>
            <p className="mt-3 text-sm leading-6 text-blue-100">
              Keep listings accurate, protect inventory, and verify guest
              payment submissions.
            </p>

            <div className="mt-6 grid gap-3">
              <DashboardLink href="/inventory" label="Manage availability" />
              <DashboardLink href="/bookings" label="Review bookings" />
              <DashboardLink href="/settings" label="Configure payments" />
              <DashboardLink href="/apartments/create" label="Create apartment" />
            </div>
          </aside>
        </section>
      </main>
    </AdminShell>
  );
}

function DashboardLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="border border-white/25 px-4 py-3 text-sm font-bold text-white transition hover:border-[#f47c20] hover:bg-[#f47c20]"
    >
      {label}
    </Link>
  );
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    submitted: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-red-100 text-red-800",
    expired: "bg-slate-200 text-slate-700",
    awaiting_payment: "bg-slate-100 text-slate-700",
    pending: "bg-blue-100 text-blue-800",
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