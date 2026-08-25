"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import Button from "@/components/ui/Button";
import {
  formatUsd,
  getFeaturedProperties,
  getPrimaryImage,
} from "@/lib/api";
import type { PublicProperty } from "@/types/property";

import SiteContainer from "@/components/ui/SiteContainer";

export default function FeaturedHotels() {
  const [properties, setProperties] = useState<
    PublicProperty[]
  >([]);

  useEffect(() => {
    let isCurrent = true;

    void getFeaturedProperties()
      .then((response) => {
        if (isCurrent) {
          setProperties(response.properties);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setProperties([]);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <section className="bg-background py-20 lg:pt-48">
      <SiteContainer>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              Featured stays
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Top rated hotels and apartment lodges
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Explore verified stays selected and managed by
              Top Rated Hotels.
            </p>
          </div>

          <Button href="/hotels" variant="outline">
            View all hotels
          </Button>
        </div>

        {properties.length === 0 ? (
          <div className="mt-10 border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              Featured stays will appear here when they are
              published by the team.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {properties.map((property) => {
              const primaryImage = getPrimaryImage(property);
              const href =
                property.kind === "hotel"
                  ? `/hotels/${property.slug}`
                  : `/apartments/${property.slug}`;

              return (
                <article
                  key={`${property.kind}:${property.id}`}
                  className="card overflow-hidden rounded-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.url}
                        alt={primaryImage.alt || property.name}
                        width={700}
                        height={525}
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/3] bg-surface" />
                    )}

                    <span className="absolute right-3 top-3 rounded-pill bg-background px-3 py-1 text-sm font-extrabold capitalize text-primary shadow-sm">
                      {property.tier}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-sm font-semibold text-accent">
                      {property.address.city},{" "}
                      {property.address.country}
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold text-primary">
                      {property.name}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-secondary">
                      From{" "}
                      {formatUsd(
                        property.fromNightlyRateCents,
                      )}{" "}
                      / night
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {property.amenities
                        .slice(0, 3)
                        .map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-pill bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                    </div>

                    <Link
                      href={href}
                      className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                      View details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SiteContainer>
    </section>
  );
}