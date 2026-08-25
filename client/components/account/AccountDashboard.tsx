"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getFavorites,
  getMyBookings,
  getRecommendations,
} from "@/lib/account-api";
import { formatUsd, getPrimaryImage } from "@/lib/api";
import type { AuthUser } from "@/types/auth";
import type { PublicProperty } from "@/types/property";

export default function AccountDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookingCount, setBookingCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [recommendations, setRecommendations] = useState<
    PublicProperty[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [currentUser, bookings, favorites, properties] =
          await Promise.all([
            getCurrentUser(),
            getMyBookings(),
            getFavorites(),
            getRecommendations(),
          ]);

        if (!active) return;

        setUser(currentUser);
        setBookingCount(bookings.length);
        setFavoriteCount(favorites.length);
        setRecommendations(properties);
      } catch {
        if (active) {
          setError("Unable to load your account dashboard.");
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="border border-border bg-background p-8 text-muted-foreground">
        Loading your dashboard…
      </div>
    );
  }

  return (
    <>
      <section className="border border-border bg-background p-6 sm:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
          Your travel account
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-primary">
          Welcome back, {user.firstName}.
        </h1>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Manage real bookings, payment requests, and saved stays from one
          place.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric label="Bookings" value={String(bookingCount)} />
          <Metric label="Saved stays" value={String(favoriteCount)} />
          <Metric
            label="Account status"
            value={user.emailVerified ? "Verified" : "Unverified"}
          />
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/account/bookings"
            className="rounded-full bg-accent px-5 py-3 text-sm font-bold text-white"
          >
            My bookings
          </Link>

          <Link
            href="/account/favorites"
            className="rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary"
          >
            Saved stays
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
          For your next stay
        </p>

        <h2 className="mt-3 text-3xl font-extrabold text-primary">
          Recommended properties
        </h2>

        {recommendations.length ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((property) => {
              const image = getPrimaryImage(property);
              const href =
                property.kind === "hotel"
                  ? `/hotels/${property.slug}`
                  : `/apartments/${property.slug}`;

              return (
                <Link
                  key={`${property.kind}-${property.id}`}
                  href={href}
                  className="overflow-hidden border border-border bg-background transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {image ? (
                    <img
                      src={image.url}
                      alt={image.alt || property.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 bg-surface" />
                  )}

                  <div className="p-5">
                    <p className="text-sm font-bold text-accent">
                      {property.address.city}, {property.address.country}
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold text-primary">
                      {property.name}
                    </h3>

                    <p className="mt-3 text-sm font-bold text-primary">
                      From {formatUsd(property.fromNightlyRateCents)} / night
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-muted-foreground">
            Recommendations will appear after published properties are
            available.
          </p>
        )}
      </section>
    </>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border bg-surface p-5">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-primary">{value}</p>
    </div>
  );
}