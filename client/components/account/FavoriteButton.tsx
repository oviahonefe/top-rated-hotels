"use client";

import { useEffect, useState } from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/lib/account-api";
import { ApiError } from "@/lib/api";
import type { PropertyKind } from "@/types/property";

type Props = {
  propertyId: string;
  propertyKind: PropertyKind;
};

export default function FavoriteButton({
  propertyId,
  propertyKind,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    void getFavorites()
      .then((favorites) => {
        if (!active) return;

        setIsFavorite(
          favorites.some(
            (favorite) =>
              favorite.property.id === propertyId &&
              favorite.property.kind === propertyKind,
          ),
        );
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [propertyId, propertyKind]);

  async function toggleFavorite() {
    try {
      setMessage("");

      if (isFavorite) {
        await removeFavorite(propertyId, propertyKind);
        setIsFavorite(false);
        return;
      }

      await addFavorite(propertyId, propertyKind);
      setIsFavorite(true);
    } catch (error) {
      setMessage(
        error instanceof ApiError && error.status === 401
          ? "Sign in to save properties."
          : "Unable to update saved stays.",
      );
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void toggleFavorite()}
        className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
          isFavorite
            ? "border-accent bg-accent text-white"
            : "border-primary text-white hover:bg-primary hover:text-white"
        }`}
      >
        {isFavorite ? "Saved to favourites" : "Save stay"}
      </button>

      {message ? (
        <p className="mt-2 text-sm font-semibold text-red-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}