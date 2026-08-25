"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters, {
  type HotelFilterValues,
} from "@/components/hotels/HotelFilters";
import HotelSearch from "@/components/hotels/HotelSearch";
import { getProperties } from "@/lib/api";
import type { PublicProperty } from "@/types/property";

const initialFilters: HotelFilterValues = {
  city: "",
  tier: "",
  guests: "",
  budget: "",
};

function matchesBudget(
  hotel: PublicProperty,
  budget: string,
) {
  const nightlyRate = hotel.fromNightlyRateCents / 100;

  if (!budget) {
    return true;
  }

  if (budget === "under-3000") {
    return nightlyRate < 3000;
  }

  if (budget === "3000-5000") {
    return nightlyRate >= 3000 && nightlyRate <= 5000;
  }

  return nightlyRate > 5000;
}

export default function HotelGrid() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] =
    useState<HotelFilterValues>(initialFilters);

  const [sortBy, setSortBy] =
    useState("recommended");

  const [hotels, setHotels] = useState<PublicProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);

      void getProperties({
        type: "hotel",
        q: query.trim() || undefined,
        city: filters.city || undefined,
        tier:
          filters.tier as
            | "standard"
            | "premium"
            | "luxury"
            | "signature"
            | undefined,
        guests: filters.guests
          ? Number(filters.guests)
          : undefined,
        page: 1,
        limit: 50,
      })
        .then((response) => {
          if (isCurrent) {
            setHotels(response.properties);
          }
        })
        .catch((requestError: unknown) => {
          if (!isCurrent) {
            return;
          }

          setHotels([]);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load hotels.",
          );
        })
        .finally(() => {
          if (isCurrent) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [
    filters.city,
    filters.guests,
    filters.tier,
    query,
  ]);

  const filteredHotels = useMemo(() => {
    const result = hotels.filter((hotel) =>
      matchesBudget(hotel, filters.budget),
    );

    return [...result].sort((first, second) => {
      if (sortBy === "price-low") {
        return (
          first.fromNightlyRateCents -
          second.fromNightlyRateCents
        );
      }

      if (sortBy === "price-high") {
        return (
          second.fromNightlyRateCents -
          first.fromNightlyRateCents
        );
      }

      if (sortBy === "rating") {
        return (
          (second.starRating ?? 0) -
          (first.starRating ?? 0)
        );
      }

      if (first.featured !== second.featured) {
        return Number(second.featured) - Number(first.featured);
      }

      return first.name.localeCompare(second.name);
    });
  }, [filters.budget, hotels, sortBy]);

  function handleFilterChange(
    name: keyof HotelFilterValues,
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function clearFilters() {
    setQuery("");
    setFilters(initialFilters);
    setSortBy("recommended");
  }

  return (
    <div className="mt-8">
      <HotelSearch
        query={query}
        onQueryChange={setQuery}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <HotelFilters
          filters={filters}
          resultCount={filteredHotels.length}
          onChange={handleFilterChange}
          onClear={clearFilters}
        />

        <div>
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              {isLoading ? (
                "Loading published stays…"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-extrabold text-primary">
                    {filteredHotels.length}
                  </span>{" "}
                  curated stays across Europe
                </>
              )}
            </p>

            <label className="flex items-center gap-3 text-sm font-semibold text-primary">
              Sort by
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="h-10 border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-accent"
              >
                <option value="recommended">
                  Recommended
                </option>
                <option value="rating">
                  Highest rating
                </option>
                <option value="price-low">
                  Price: low to high
                </option>
                <option value="price-high">
                  Price: high to low
                </option>
              </select>
            </label>
          </div>

          {error ? (
            <div className="mt-6 border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {!error && !isLoading && filteredHotels.length === 0 ? (
            <div className="mt-6 border border-dashed border-border bg-surface p-10 text-center">
              <h2 className="text-xl font-extrabold text-primary">
                No published stays match those filters.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Try another city, tier, or guest capacity.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Clear all filters
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[31rem] animate-pulse border border-border bg-surface"
                />
              ))}
            </div>
          ) : null}

          {!isLoading && filteredHotels.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}