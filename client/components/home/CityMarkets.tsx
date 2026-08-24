import Image from "next/image";
import { cityMarkets } from "@/lib/home-data";
import SiteContainer from "@/components/ui/SiteContainer";

export default function CityMarkets() {
  return (
    <section className="bg-surface py-20">
     <SiteContainer>
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Europe coverage
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Major European cities, with Malaga as the launch focus
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cityMarkets.map((market) => (
            <article key={market.city} className="group relative overflow-hidden rounded-lg">
              <Image
                src={market.image}
                alt={`${market.city}, ${market.country}`}
                width={600}
                height={800}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-sm font-semibold text-accent-light">
                  {market.country}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-white">
                  {market.city}
                </h3>
                <p className="mt-2 text-sm font-semibold text-white/75">
                  {market.stays}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
      </SiteContainer>
    </section>
  );
}
