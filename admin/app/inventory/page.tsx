"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import AdminShell from "@/components/layout/AdminShell";
import { apiRequest } from "@/lib/api-client";
import type { AdminApartment, AdminHotel } from "@/lib/api-types";
import { useAdminAuth } from "@/providers/AuthProvider";

type PropertyKind = "hotel" | "apartment";

type OccupancyDay = {
  date: string;
  totalInventory: number;
  reservedInventory: number;
  availableInventory: number;
  isBlocked: boolean;
  blockReason?: string;
};

type OccupancyResponse = {
  propertyId: string;
  propertyKind: PropertyKind;
  unitKey: string;
  dates: OccupancyDay[];
};

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

const today = new Date();
const defaultEnd = new Date();
defaultEnd.setDate(defaultEnd.getDate() + 14);

export default function InventoryPage() {
  return (
    <AdminRouteGuard>
      <InventoryContent />
    </AdminRouteGuard>
  );
}

function InventoryContent() {
  const { authenticatedRequestToken } = useAdminAuth();

  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [apartments, setApartments] = useState<AdminApartment[]>([]);
  const [propertyKind, setPropertyKind] = useState<PropertyKind>("hotel");
  const [propertyId, setPropertyId] = useState("");
  const [unitKey, setUnitKey] = useState("");
  const [startDate, setStartDate] = useState(toDateInput(today));
  const [endDate, setEndDate] = useState(toDateInput(defaultEnd));
  const [blockReason, setBlockReason] = useState("");
  const [inventoryAmount, setInventoryAmount] = useState("");
  const [occupancy, setOccupancy] = useState<OccupancyResponse | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [isLoadingOccupancy, setIsLoadingOccupancy] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel._id === propertyId),
    [hotels, propertyId],
  );

  const selectedApartment = useMemo(
    () => apartments.find((apartment) => apartment._id === propertyId),
    [apartments, propertyId],
  );

  const selectedUnitKey = propertyKind === "apartment" ? "default" : unitKey;

  async function loadProperties() {
    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      setIsLoadingProperties(false);
      return;
    }

    setIsLoadingProperties(true);

    try {
      const [hotelData, apartmentData] = await Promise.all([
        apiRequest<AdminHotel[]>("/admin/properties/hotels", { token }),
        apiRequest<AdminApartment[]>("/admin/properties/apartments", { token }),
      ]);

      setHotels(hotelData.filter((hotel) => hotel.status !== "archived"));
      setApartments(
        apartmentData.filter((apartment) => apartment.status !== "archived"),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load property inventory.",
      );
    } finally {
      setIsLoadingProperties(false);
    }
  }

  useEffect(() => {
    void loadProperties();
  }, []);

  async function loadOccupancy(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!propertyId || !selectedUnitKey) {
      setError("Select a property and bookable room type first.");
      return;
    }

    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setIsLoadingOccupancy(true);
    setError("");
    setMessage("");

    try {
      const query = new URLSearchParams({
        propertyId,
        propertyKind,
        unitKey: selectedUnitKey,
        startDate,
        endDate,
      });

      const data = await apiRequest<OccupancyResponse>(
        `/admin/inventory/occupancy?${query.toString()}`,
        { token },
      );

      setOccupancy(data);
    } catch (requestError) {
      setOccupancy(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load availability for this date range.",
      );
    } finally {
      setIsLoadingOccupancy(false);
    }
  }

  async function updateBlock(isBlocked: boolean) {
    if (!propertyId || !selectedUnitKey) {
      setError("Select a property and bookable room type first.");
      return;
    }

    if (isBlocked && !blockReason.trim()) {
      setError("Add a reason before blocking dates.");
      return;
    }

    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setIsUpdating(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest<{
        updatedDates: number;
        isBlocked: boolean;
      }>("/admin/inventory/blocks", {
        method: "POST",
        token,
        body: {
          propertyId,
          propertyKind,
          unitKey: selectedUnitKey,
          startDate,
          endDate,
          isBlocked,
          ...(isBlocked ? { reason: blockReason.trim() } : {}),
        },
      });

      setMessage(
        result.isBlocked
          ? `${result.updatedDates} date(s) are now blocked.`
          : `${result.updatedDates} date(s) are now open for booking.`,
      );

      await loadOccupancy();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update the availability block.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function updateInventory() {
    const totalInventory = Number(inventoryAmount);

    if (!Number.isInteger(totalInventory) || totalInventory < 0) {
      setError("Enter a valid whole number for total bookable units.");
      return;
    }

    if (!propertyId || !selectedUnitKey) {
      setError("Select a property and bookable room type first.");
      return;
    }

    const token = await authenticatedRequestToken();

    if (!token) {
      setError("Your admin session has expired. Please sign in again.");
      return;
    }

    setIsUpdating(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest<{
        updatedDates: number;
        totalInventory: number;
      }>("/admin/inventory/inventory", {
        method: "POST",
        token,
        body: {
          propertyId,
          propertyKind,
          unitKey: selectedUnitKey,
          startDate,
          endDate,
          totalInventory,
        },
      });

      setMessage(
        `${result.updatedDates} date(s) updated to ${result.totalInventory} bookable unit(s).`,
      );

      await loadOccupancy();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Inventory cannot be reduced below current reservations.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <AdminShell>
      <main className="mx-auto w-full max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">
        <section className="border-b border-slate-200 pb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f47c20]">
            Booking operations
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#18295d] sm:text-4xl">
            Availability
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Protect your guest experience by managing bookable units, blocked
            dates, and live occupancy across your Europe property portfolio.
          </p>
        </section>

        {error ? (
          <p className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
            {message}
          </p>
        ) : null}

        <div className="mt-8 grid gap-8 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="h-fit border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
              Inventory search
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
              Select a stay range
            </h2>

            <form onSubmit={loadOccupancy} className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Property type
                </span>
                <select
                  value={propertyKind}
                  onChange={(event) => {
                    setPropertyKind(event.target.value as PropertyKind);
                    setPropertyId("");
                    setUnitKey("");
                    setOccupancy(null);
                  }}
                  className="field-input"
                >
                  <option value="hotel">Hotel</option>
                  <option value="apartment">Apartment</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Property
                </span>
                <select
                  required
                  value={propertyId}
                  onChange={(event) => {
                    setPropertyId(event.target.value);
                    setUnitKey("");
                    setOccupancy(null);
                  }}
                  className="field-input"
                >
                  <option value="">Select property</option>

                  {propertyKind === "hotel"
                    ? hotels.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name} · {hotel.address.city}
                        </option>
                      ))
                    : apartments.map((apartment) => (
                        <option key={apartment._id} value={apartment._id}>
                          {apartment.name} · {apartment.address.city}
                        </option>
                      ))}
                </select>
              </label>

              {propertyKind === "hotel" ? (
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-slate-700">
                    Room type
                  </span>
                  <select
                    required
                    disabled={!selectedHotel}
                    value={unitKey}
                    onChange={(event) => {
                      setUnitKey(event.target.value);
                      setOccupancy(null);
                    }}
                    className="field-input disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">Select room type</option>
                    {selectedHotel?.rooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.name} · {room.totalUnits} unit(s)
                      </option>
                    ))}
                  </select>
                </label>
              ) : selectedApartment ? (
                <div className="border border-blue-100 bg-blue-50 p-4 text-sm text-[#18295d]">
                  <p className="font-extrabold">Apartment inventory</p>
                  <p className="mt-1">
                    {selectedApartment.totalUnits} default bookable unit(s)
                  </p>
                </div>
              ) : null}

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Check-in date
                </span>
                <input
                  required
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setOccupancy(null);
                  }}
                  className="field-input"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">
                  Check-out date
                </span>
                <input
                  required
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setOccupancy(null);
                  }}
                  className="field-input"
                />
              </label>

              <button
                type="submit"
                disabled={isLoadingProperties || isLoadingOccupancy}
                className="h-11 bg-[#18295d] px-5 text-sm font-bold text-white transition hover:bg-[#101d48] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoadingOccupancy
                  ? "Loading availability..."
                  : "View availability"}
              </button>
            </form>
          </aside>

          <section className="min-w-0">
            {!occupancy ? (
              <div className="border border-dashed border-slate-300 bg-white p-8 sm:p-12">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                  Live stock control
                </p>
                <h2 className="mt-3 text-2xl font-extrabold text-[#18295d]">
                  Select a property to review availability
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                  View daily reservation levels before adjusting sellable
                  inventory or blocking dates for maintenance and owner stays.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="border border-slate-200 bg-white">
                  <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                        Live occupancy
                      </p>
                      <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                        {selectedHotel?.name ?? selectedApartment?.name}
                      </h2>
                    </div>

                    <p className="text-sm font-bold text-slate-600">
                      {occupancy.dates.length} bookable night(s)
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-slate-200 bg-slate-50 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Date</th>
                          <th className="px-5 py-4">Total units</th>
                          <th className="px-5 py-4">Reserved</th>
                          <th className="px-5 py-4">Available</th>
                          <th className="px-5 py-4">Availability</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {occupancy.dates.map((day) => (
                          <tr key={day.date} className="hover:bg-slate-50">
                            <td className="px-5 py-4 font-bold text-[#18295d]">
                              {day.date}
                            </td>
                            <td className="px-5 py-4 text-slate-700">
                              {day.totalInventory}
                            </td>
                            <td className="px-5 py-4 text-slate-700">
                              {day.reservedInventory}
                            </td>
                            <td className="px-5 py-4 font-extrabold text-slate-900">
                              {day.availableInventory}
                            </td>
                            <td className="px-5 py-4">
                              {day.isBlocked ? (
                                <span
                                  title={day.blockReason}
                                  className="inline-flex bg-red-100 px-2 py-1 text-xs font-bold text-red-800"
                                >
                                  Blocked
                                </span>
                              ) : (
                                <span className="inline-flex bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
                                  Open
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid gap-6 2xl:grid-cols-2">
                  <section className="border border-slate-200 bg-white p-5 sm:p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                      Date controls
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                      Block or reopen dates
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Use date blocks for maintenance, property owner stays, or
                      dates temporarily unavailable for guests.
                    </p>

                    <label className="mt-5 grid gap-2">
                      <span className="text-sm font-bold text-slate-700">
                        Block reason
                      </span>
                      <textarea
                        rows={3}
                        value={blockReason}
                        onChange={(event) => setBlockReason(event.target.value)}
                        placeholder="Example: Renovation and maintenance"
                        className="field-input resize-y"
                      />
                    </label>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void updateBlock(true)}
                        className="h-11 bg-red-700 px-4 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-300"
                      >
                        Block dates
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => void updateBlock(false)}
                        className="h-11 border border-slate-300 px-4 text-sm font-bold text-slate-800 transition hover:border-[#18295d] disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        Reopen dates
                      </button>
                    </div>
                  </section>

                  <section className="border border-slate-200 bg-white p-5 sm:p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
                      Sellable stock
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold text-[#18295d]">
                      Adjust bookable units
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Set the maximum units guests can book for every date in
                      the selected range.
                    </p>

                    <label className="mt-5 grid gap-2">
                      <span className="text-sm font-bold text-slate-700">
                        Total bookable units
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={inventoryAmount}
                        onChange={(event) =>
                          setInventoryAmount(event.target.value)
                        }
                        placeholder="Example: 8"
                        className="field-input"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => void updateInventory()}
                      className="mt-5 h-11 w-full bg-[#18295d] px-4 text-sm font-bold text-white transition hover:bg-[#101d48] disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      Save inventory
                    </button>
                  </section>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </AdminShell>
  );
}