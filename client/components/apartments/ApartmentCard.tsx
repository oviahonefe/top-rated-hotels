import Image from "next/image";
import Link from "next/link";
import type { Apartment } from "@/lib/home-data";

type ApartmentCardProps = {
  apartment: Apartment;
};

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <article className="group overflow-hidden border border-border bg-background transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Image
          src={apartment.image}
          alt={apartment.name}
          width={900}
          height={675}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 bg-background px-3 py-1.5 text-xs font-extrabold text-primary shadow-sm">
          {apartment.tag}
        </span>

        <span className="absolute right-3 top-3 bg-primary px-3 py-1.5 text-xs font-extrabold text-white shadow-sm">
          {apartment.rating.toFixed(1)} / 5
        </span>
      </div>

      <div className="p-5">
        <p className="text-sm font-bold text-accent">
          {apartment.city}, {apartment.country}
        </p>

        <h2 className="mt-2 text-xl font-extrabold text-primary">
          {apartment.name}
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {apartment.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
            {apartment.bedrooms} bedrooms
          </span>
          <span className="bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
            {apartment.bathrooms} bathrooms
          </span>
          <span className="bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
            Up to {apartment.guests} guests
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              From
            </p>
            <p className="mt-1 text-sm font-extrabold text-primary">
              {apartment.priceLabel}
            </p>
          </div>

          <p className="text-xs font-semibold text-muted-foreground">
            {apartment.reviews} reviews
          </p>
        </div>

        <Link
          href={`/apartments/${apartment.id}`}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          View apartment
        </Link>
      </div>
    </article>
  );
}