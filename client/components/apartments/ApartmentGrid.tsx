"use client";

import {
  useEffect,
  useState,
} from "react";

import ApartmentCard from "@/components/apartments/ApartmentCard";
import { getProperties } from "@/lib/api";
import type { PublicProperty } from "@/types/property";

export default function ApartmentGrid() {
  const [apartments, setApartments] = useState<
    PublicProperty[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    void getProperties({
      type: "apartment",
      page: 1,
      limit: 50,
    })
      .then((response) => {
        if (isCurrent) {
          setApartments(response.properties);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load apartments.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[31rem] animate-pulse border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-7 border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="mt-7 border border-dashed border-border bg-surface p-10 text-center">
        <h2 className="text-xl font-extrabold text-primary">
          No apartments are available yet.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Check back soon for newly published apartment stays.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {apartments.map((apartment) => (
        <ApartmentCard
          key={apartment.id}
          apartment={apartment}
        />
      ))}
    </div>
  );
}