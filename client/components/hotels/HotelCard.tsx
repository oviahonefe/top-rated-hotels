import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import {
  formatUsd,
  getPrimaryImage,
} from "@/lib/api";
import type { PublicProperty } from "@/types/property";

type HotelCardProps = {
  hotel: PublicProperty;
};

export default function HotelCard({
  hotel,
}: HotelCardProps) {
  const primaryImage = getPrimaryImage(hotel);

  return (
    <article className="group overflow-hidden border border-border bg-background transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || hotel.name}
            width={900}
            height={675}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-surface" />
        )}

        <span className="absolute left-3 top-3 bg-background px-3 py-1.5 text-xs font-extrabold capitalize text-primary shadow-sm">
          {hotel.tier}
        </span>

     {hotel.starRating ? (
  <span
    aria-label={`${hotel.starRating.toFixed(1)} out of 5 rating`}
    className="absolute right-3 top-3 inline-flex items-center gap-1.5 bg-background/95 px-3 py-1.5 text-xs font-extrabold text-primary shadow-lg ring-1 ring-white/70 backdrop-blur"
  >
    <Star
      aria-hidden="true"
      size={14}
      strokeWidth={2.5}
      className="fill-accent text-accent"
    />
    {hotel.starRating.toFixed(1)}
  </span>
) : null}
      </div>

      <div className="p-5">
        <p className="text-sm font-bold text-accent">
          {hotel.address.city}, {hotel.address.country}
        </p>

        <h3 className="mt-2 text-xl font-extrabold text-primary">
          {hotel.name}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {hotel.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              From
            </p>
            <p className="mt-1 text-sm font-extrabold text-primary">
              {formatUsd(hotel.fromNightlyRateCents)} / night
            </p>
          </div>

          <p className="text-xs font-semibold text-muted-foreground">
            4-night minimum
          </p>
        </div>

        <Link
          href={`/hotels/${hotel.slug}`}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          View stay
        </Link>
      </div>
    </article>
  );
}