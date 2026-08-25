"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import AdminShell from "@/components/layout/AdminShell";
import { apiRequest } from "@/lib/api-client";
import type { AdminApartment } from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

export default function ApartmentsPage() {
  return (
    <AdminRouteGuard>
      <ApartmentsContent />
    </AdminRouteGuard>
  );
}

function ApartmentsContent() {
  const { authenticatedRequestToken } = useAdminAuth();
  const [apartments, setApartments] = useState<AdminApartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isArchivingId, setIsArchivingId] = useState("");
  const [error, setError] = useState("");

  async function loadApartments() {
    const token = authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest<AdminApartment[]>(
        "/admin/properties/apartments",
        { token },
      );

      setApartments(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load apartment listings.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadApartments();
  }, []);

  async function archiveApartment(apartment: AdminApartment) {
    const confirmed = window.confirm(
      `Archive "${apartment.name}"? It will be removed from guest booking results.`,
    );

    if (!confirmed) {
      return;
    }

    const token = authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setIsArchivingId(apartment._id);
    setError("");

    try {
      const updatedApartment = await apiRequest<AdminApartment>(
        `/admin/properties/apartments/${apartment._id}`,
        {
          method: "DELETE",
          token,
        },
      );

      setApartments((currentApartments) =>
        currentApartments.map((item) =>
          item._id === updatedApartment._id ? updatedApartment : item,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to archive this apartment.",
      );
    } finally {
      setIsArchivingId("");
    }
  }

  const metrics = useMemo(
    () => ({
      total: apartments.length,
      published: apartments.filter(
        (apartment) => apartment.status === "published",
      ).length,
      draft: apartments.filter((apartment) => apartment.status === "draft")
        .length,
      units: apartments
        .filter((apartment) => apartment.status !== "archived")
        .reduce((total, apartment) => total + apartment.totalUnits, 0),
    }),
    [apartments],
  );

  return (
    <AdminShell>
      <main className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f47c20]">
              Property portfolio
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-[#18295d] sm:text-4xl">
              Apartments
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Manage serviced apartments, villas, and private stays available
              across the Top Rated Apartment Hotels marketplace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadApartments()}
              className="h-11 border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:border-[#18295d]"
            >
              Refresh
            </button>

            <Link
              href="/apartments/create"
              className="inline-flex h-11 items-center bg-[#f47c20] px-5 text-sm font-bold text-white transition hover:bg-[#d96513]"
            >
              Create apartment
            </Link>
          </div>
        </section>

        {error ? (
          <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </p>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="All apartments" value={metrics.total} />
          <MetricCard label="Published" value={metrics.published} emphasis />
          <MetricCard label="Drafts" value={metrics.draft} />
          <MetricCard label="Bookable units" value={metrics.units} />
        </section>

        <section className="mt-8 border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                Live property records
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                Apartment listings
              </h2>
            </div>

            <p className="text-sm font-semibold text-slate-500">
              {apartments.length} record{apartments.length === 1 ? "" : "s"}
            </p>
          </div>

          {isLoading ? (
            <p className="p-6 text-sm font-semibold text-slate-600">
              Loading apartments from the live API...
            </p>
          ) : apartments.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-xl font-extrabold text-[#18295d]">
                Your apartment portfolio is empty
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
                Add your first apartment or villa, set its rate and total
                bookable units, then publish it when it is ready for guests.
              </p>
              <Link
                href="/apartments/create"
                className="mt-6 inline-flex h-11 items-center bg-[#f47c20] px-5 text-sm font-bold text-white transition hover:bg-[#d96513]"
              >
                Create first apartment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Apartment</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Capacity</th>
                    <th className="px-5 py-4">Nightly rate</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {apartments.map((apartment) => (
                    <tr key={apartment._id} className="hover:bg-slate-50">
                      <td className="px-5 py-5">
                        <p className="font-extrabold text-[#18295d]">
                          {apartment.name}
                        </p>
                        <p className="mt-1 line-clamp-1 max-w-xs text-xs text-slate-500">
                          {apartment.summary}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-slate-700">
                        {apartment.address.city}, {apartment.address.country}
                      </td>

                      <td className="px-5 py-5 text-slate-700">
                        {apartment.maxGuests} guests · {apartment.bedrooms} bed
                        {apartment.bedrooms === 1 ? "" : "s"}
                      </td>

                      <td className="px-5 py-5 font-bold text-slate-800">
                        {formatMoney(apartment.platformNightlyRateCents)}
                      </td>

                      <td className="px-5 py-5">
                        <StatusBadge status={apartment.status} />
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/apartments/${apartment._id}/edit`}
                            className="text-sm font-bold text-[#18295d] transition hover:text-[#f47c20]"
                          >
                            Manage
                          </Link>

                          {apartment.status !== "archived" ? (
                            <button
                              type="button"
                              disabled={isArchivingId === apartment._id}
                              onClick={() => void archiveApartment(apartment)}
                              className="text-sm font-bold text-red-700 transition hover:text-red-900 disabled:cursor-not-allowed disabled:text-slate-400"
                            >
                              {isArchivingId === apartment._id
                                ? "Archiving..."
                                : "Archive"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
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

function StatusBadge({
  status,
}: {
  status: "draft" | "published" | "archived";
}) {
  const styles = {
    published: "bg-emerald-100 text-emerald-800",
    draft: "bg-amber-100 text-amber-800",
    archived: "bg-slate-200 text-slate-700",
  };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}