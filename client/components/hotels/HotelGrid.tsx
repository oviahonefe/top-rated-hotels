"use client";

import { useMemo, useState } from "react";
import { hotels } from "@/lib/home-data";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters, {
  type HotelFilterValues,
} from "@/components/hotels/HotelFilters";
import HotelSearch from "@/components/hotels/HotelSearch";

const initialFilters: HotelFilterValues = {
  city: "",
  type: "",
  rating: "",
  budget: "",
};

export default function HotelGrid() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<HotelFilterValues>(initialFilters);
  const [sortBy, setSortBy] = useState("recommended");

  const filteredHotels = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();

    const result = hotels.filter((hotel) => {
      const matchesQuery =
        !normalisedQuery ||
        [
          hotel.name,
          hotel.city,
          hotel.country,
          hotel.type,
          ...hotel.features,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalisedQuery);

      const matchesCity = !filters.city || hotel.city === filters.city;
      const matchesType = !filters.type || hotel.type === filters.type;
      const matchesRating =
        !filters.rating || hotel.rating >= Number(filters.rating);

      const matchesBudget =
        !filters.budget ||
        (filters.budget === "under-30000" && hotel.price < 30000) ||
        (filters.budget === "30000-35000" &&
          hotel.price >= 30000 &&
          hotel.price <= 35000) ||
        (filters.budget === "over-35000" && hotel.price > 35000);

      return matchesQuery && matchesCity && matchesType && matchesRating && matchesBudget;
    });

    return [...result].sort((first, second) => {
      if (sortBy === "rating") {
        return second.rating - first.rating;
      }

      if (sortBy === "price-low") {
        return first.price - second.price;
      }

      if (sortBy === "price-high") {
        return second.price - first.price;
      }

      return second.rating * second.reviews - first.rating * first.reviews;
    });
  }, [filters, query, sortBy]);

  function handleFilterChange(name: keyof HotelFilterValues, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setQuery("");
    setFilters(initialFilters);
    setSortBy("recommended");
  }

  return (
    <div className="mt-8">
      <HotelSearch query={query} onQueryChange={setQuery} />

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
              Showing{" "}
              <span className="font-extrabold text-primary">
                {filteredHotels.length}
              </span>{" "}
              curated stays across Europe
            </p>

            <label className="flex items-center gap-3 text-sm font-semibold text-primary">
              Sort by
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-10 border border-border bg-background px-3 text-sm font-semibold outline-none focus:border-accent"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rating</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          {filteredHotels.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-border bg-surface p-10 text-center">
              <h2 className="text-xl font-extrabold text-primary">
                No stays match those filters.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Try another city, stay type, or budget range.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}