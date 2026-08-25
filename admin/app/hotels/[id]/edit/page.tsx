"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import PropertyMediaManager from "@/components/hotels/HotelMediaManager";
import { apiRequest, ApiClientError } from "@/lib/api-client";
import type { AdminHotel, PropertyImage } from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";
import HotelDetailsEditor from "@/components/hotels/HotelDetailsEditor";

export default function EditHotelPage() {
  return (
    <AdminRouteGuard>
      <EditHotelContent />
    </AdminRouteGuard>
  );
}

function EditHotelContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { authenticatedRequestToken } = useAdminAuth();

  const [hotel, setHotel] = useState<AdminHotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadHotel = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = await authenticatedRequestToken();

      const data = await apiRequest<AdminHotel>(
        `/admin/properties/hotels/${params.id}`,
        { token },
      );

      setHotel(data);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiClientError
          ? error.message
          : "Unable to load this hotel.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedRequestToken, params.id]);

  useEffect(() => {
    void loadHotel();
  }, [loadHotel]);

  function updateImages(images: PropertyImage[]) {
    setHotel((current) => (current ? { ...current, images } : current));
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[82rem] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
              Property management
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              {hotel ? hotel.name : "Hotel details"}
            </h1>
          </div>

          <Link
            href="/hotels"
            className="inline-flex h-11 items-center justify-center border border-slate-300 px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to hotels
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[82rem] px-4 py-8 sm:px-6 lg:px-8">
        {searchParams.get("created") === "1" ? (
          <p className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Hotel created successfully. You can now upload its property images.
          </p>
        ) : null}

        {isLoading ? (
          <div className="border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-600">
            Loading hotel details...
          </div>
        ) : null}

        {errorMessage ? (
          <div
            role="alert"
            className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {errorMessage}
          </div>
        ) : null}

        {hotel ? (
          <div className="grid gap-8">
            <section className="border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-950">
                Live property record
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <RecordItem label="Status" value={hotel.status} />
                <RecordItem label="Tier" value={hotel.tier} />
                <RecordItem
                  label="Location"
                  value={`${hotel.address.city}, ${hotel.address.country}`}
                />
                <RecordItem label="Room types" value={`${hotel.rooms.length}`} />
              </div>
            </section>

            <PropertyMediaManager
              propertyKind="hotels"
              propertyId={hotel._id}
              propertyName={hotel.name}
              images={hotel.images}
              onImagesUpdated={updateImages}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}

function RecordItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold capitalize text-slate-950">
        {value}
      </p>
    </div>
  );
}