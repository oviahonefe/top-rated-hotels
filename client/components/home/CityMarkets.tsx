"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPrimaryImage, getProperties } from "@/lib/api";
import type { PublicProperty } from "@/types/property";
import SiteContainer from "@/components/ui/SiteContainer";

type CityGroup = {
  city: string;
  country: string;
  properties: PublicProperty[];
};

export default function CityMarkets() {
  const [properties, setProperties] = useState<PublicProperty[]>([]);

  useEffect(() => {
    void getProperties({
      page: 1,
      limit: 50,
    })
      .then((result) => {
        setProperties(result.properties);
      })
      .catch(() => {
        setProperties([]);
      });
  }, []);

  const cities = useMemo<CityGroup[]>(() => {
    const groups = new Map<string, CityGroup>();

    for (const property of properties) {
      const key = `${property.address.city}-${property.address.country}`;

      const group = groups.get(key) ?? {
        city: property.address.city,
        country: property.address.country,
        properties: [],
      };

      group.properties.push(property);
      groups.set(key, group);
    }

    return [...groups.values()].slice(0, 4);
  }, [properties]);

  if (!cities.length) {
    return null;
  }

  return (
    <section className="bg-surface py-20">
      <SiteContainer>
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Available destinations
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
            Explore cities with published stays.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => {
            const image = getPrimaryImage(city.properties[0]);

            return (
              <Link
                key={`${city.city}-${city.country}`}
                href={`/hotels?city=${encodeURIComponent(city.city)}`}
                className="group relative overflow-hidden border border-border bg-primary"
              >
                {image ? (
                  <img
                    src={image.url}
                    alt={`${city.city}, ${city.country}`}
                    className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[3/4] bg-primary" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-sm font-semibold text-accent-light">
                    {city.country}
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold">
                    {city.city}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-white/75">
                    {city.properties.length} published stay
                    {city.properties.length === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </SiteContainer>
    </section>
  );
}