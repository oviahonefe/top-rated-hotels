import Image from "next/image";
import Button from "@/components/ui/Button";
import { featuredHotels } from "@/lib/home-data";
import SiteContainer from "@/components/ui/SiteContainer";

export default function FeaturedHotels() {
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
              Built for a marketplace flow: users compare listings, inspect
              amenities, choose a stay, then continue to checkout.
            </p>
          </div>

          <Button href="/hotels" variant="outline">
            View all hotels
          </Button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredHotels.map((hotel) => (
            <article
              key={hotel.id}
              className="card overflow-hidden rounded-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  width={700}
                  height={525}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3] w-full object-cover"
                />

                <span className="absolute right-3 top-3 rounded-pill bg-background px-3 py-1 text-sm font-extrabold text-primary shadow-sm">
                  {hotel.rating}
                </span>
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold text-accent">
                  {hotel.location}
                </p>

                <h3 className="mt-2 text-xl font-extrabold text-primary">
                  {hotel.name}
                </h3>

                <p className="mt-2 text-sm font-bold text-secondary">
                  {hotel.price}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="rounded-pill bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button
                  href={`/hotels/${hotel.id}`}
                  variant="accent"
                  className="mt-5 w-full text-white"
                >
                  View details
                </Button>
              </div>
            </article>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}