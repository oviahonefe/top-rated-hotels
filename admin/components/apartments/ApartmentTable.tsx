"use client";

import Image from "next/image";
import Link from "next/link";
import type { AdminApartment } from "@/lib/api-types";

type ApartmentTableProps = {
  apartments: AdminApartment[];
  isArchivingId: string | null;
  onArchive: (apartment: AdminApartment) => void;
};

const statusStyles = {
  draft: "bg-amber-50 text-amber-800",
  published: "bg-emerald-50 text-emerald-800",
  archived: "bg-slate-100 text-slate-600",
};

export default function ApartmentTable({
  apartments,
  isArchivingId,
  onArchive,
}: ApartmentTableProps) {
  if (apartments.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <h2 className="text-xl font-bold text-slate-950">
          No apartments yet
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Create your first apartment listing to make it available for booking.
        </p>

        <Link
          href="/apartments/create"
          className="mt-6 inline-flex h-11 items-center justify-center bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Create apartment
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="w-full min-w-[980px] text-left">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <th className="px-5 py-4">Apartment</th>
            <th className="px-5 py-4">Location</th>
            <th className="px-5 py-4">Capacity</th>
            <th className="px-5 py-4">Nightly rate</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {apartments.map((apartment) => {
            const primaryImage =
              apartment.images.find((image) => image.isPrimary) ??
              apartment.images[0];

            return (
              <tr
                key={apartment._id}
                className="border-b border-slate-200 last:border-b-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-slate-100">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt}
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
                        {apartment.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {apartment.bedrooms} bedrooms · {apartment.bathrooms}{" "}
                        bathrooms
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-slate-700">
                  <p>{apartment.address.city}</p>
                  <p className="mt-1 text-slate-500">
                    {apartment.address.country}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                  {apartment.maxGuests} guests · {apartment.totalUnits} units
                </td>

                <td className="px-5 py-4 text-sm font-bold text-slate-950">
                  ${(apartment.platformNightlyRateCents / 100).toLocaleString()}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-bold capitalize ${
                      statusStyles[apartment.status]
                    }`}
                  >
                    {apartment.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/apartments/${apartment._id}/edit`}
                      className="text-sm font-bold text-orange-600 transition hover:text-orange-700"
                    >
                      Edit
                    </Link>

                    {apartment.status !== "archived" ? (
                      <button
                        type="button"
                        disabled={isArchivingId === apartment._id}
                        onClick={() => onArchive(apartment)}
                        className="text-sm font-bold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isArchivingId === apartment._id
                          ? "Archiving..."
                          : "Archive"}
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}