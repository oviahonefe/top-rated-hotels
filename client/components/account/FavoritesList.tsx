"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "@/lib/account-api";
import type { Favorite } from "@/types/account";

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    void getFavorites()
      .then((items) => {
        if (active) setFavorites(items);
      })
      .catch(() => {
        if (active) setMessage("Unable to load your saved stays.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function remove(item: Favorite) {
    try {
      await removeFavorite(item.property.id, item.property.kind);
      setFavorites((current) =>
        current.filter(
          (favorite) => favorite.favoriteId !== item.favoriteId,
        ),
      );
    } catch {
      setMessage("Unable to remove this saved stay.");
    }
  }

  if (loading) {
    return <p className="py-10 text-muted-foreground">Loading saved stays…</p>;
  }

  if (message) {
    return <p className="py-4 text-red-700">{message}</p>;
  }

  if (!favorites.length) {
    return (
      <div className="border border-dashed border-border bg-background p-10 text-center">
        <h2 className="text-xl font-extrabold text-primary">
          No saved stays yet
        </h2>
        <Link
          href="/hotels"
          className="mt-5 inline-flex font-bold text-accent"
        >
          Explore hotels
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((item) => {
        const href =
          item.property.kind === "hotel"
            ? `/hotels/${item.property.slug}`
            : `/apartments/${item.property.slug}`;

        return (
          <article
            key={item.favoriteId}
            className="overflow-hidden border border-border bg-background"
          >
            {item.property.image ? (
              <img
                src={item.property.image}
                alt={item.property.name}
                className="h-52 w-full object-cover"
              />
            ) : (
              <div className="h-52 bg-surface" />
            )}

            <div className="p-5">
              <p className="text-sm font-bold text-accent">
                {item.property.city}, {item.property.country}
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-primary">
                {item.property.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.property.summary}
              </p>

              <div className="mt-5 flex items-center justify-between gap-4">
                <Link href={href} className="text-sm font-extrabold text-accent">
                  View stay
                </Link>
                <button
                  type="button"
                  onClick={() => void remove(item)}
                  className="text-sm font-bold text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}