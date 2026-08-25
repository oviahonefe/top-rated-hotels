"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatUsd } from "@/lib/api";
import type {
  ApartmentDetail,
  HotelDetail,
} from "@/types/property";

type Props = {
  property: HotelDetail | ApartmentDetail;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function PropertyReservationCard({
  property,
}: Props) {
  const rooms =
    property.kind === "hotel" ? property.rooms : [];

  const [selectedRoomId, setSelectedRoomId] = useState(
    rooms[0]?.id ?? "default",
  );

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId),
    [rooms, selectedRoomId],
  );

  const maxGuests =
    selectedRoom?.maxGuests ??
    property.maxGuests ??
    1;

  const nightlyRate =
    selectedRoom?.platformNightlyRateCents ??
    property.fromNightlyRateCents;

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(
    Math.min(2, maxGuests),
  );

  const minimumDate = getToday();

  const bookingUrl = useMemo(() => {
    if (!checkInDate || !checkOutDate) return null;

    const query = new URLSearchParams({
      propertyId: property.slug,
      kind: property.kind,
      unitKey: selectedRoomId,
      checkInDate,
      checkOutDate,
      guests: String(guestCount),
    });

    return `/bookings?${query.toString()}`;
  }, [
    checkInDate,
    checkOutDate,
    guestCount,
    property.kind,
    property.slug,
    selectedRoomId,
  ]);

  return (
    <aside className="h-fit border border-border bg-background p-5 shadow-lg lg:sticky lg:top-24">
      <p className="text-sm font-semibold text-muted-foreground">
        Starting from
      </p>

      <p className="mt-1 text-2xl font-extrabold text-primary">
        {formatUsd(nightlyRate)} / night
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Four-night minimum applies. Your final platform quote is calculated
        before payment.
      </p>

      {property.kind === "hotel" ? (
        <label className="mt-6 block">
          <span className="text-sm font-bold text-primary">
            Room type
          </span>

          <select
            value={selectedRoomId}
            onChange={(event) => {
              const nextId = event.target.value;
              const nextRoom = rooms.find(
                (room) => room.id === nextId,
              );

              setSelectedRoomId(nextId);
              setGuestCount(
                Math.min(
                  guestCount,
                  nextRoom?.maxGuests ?? 1,
                ),
              );
            }}
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — {formatUsd(room.platformNightlyRateCents)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="mt-6 grid gap-4 border-y border-border py-5">
        <label>
          <span className="text-sm font-bold text-primary">
            Check-in date
          </span>

          <input
            type="date"
            min={minimumDate}
            value={checkInDate}
            onChange={(event) =>
              setCheckInDate(event.target.value)
            }
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-primary">
            Check-out date
          </span>

          <input
            type="date"
            min={checkInDate || minimumDate}
            value={checkOutDate}
            onChange={(event) =>
              setCheckOutDate(event.target.value)
            }
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent"
          />
        </label>

        <label>
          <span className="text-sm font-bold text-primary">
            Guests
          </span>

          <select
            value={guestCount}
            onChange={(event) =>
              setGuestCount(Number(event.target.value))
            }
            className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent"
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
      </div>

      {bookingUrl ? (
        <Link
          href={bookingUrl}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          Continue to booking
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white opacity-50"
        >
          Select stay dates
        </button>
      )}
    </aside>
  );
}