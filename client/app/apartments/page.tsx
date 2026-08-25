import type { Metadata } from "next";

import ApartmentGrid from "@/components/apartments/ApartmentGrid";
import SiteContainer from "@/components/ui/SiteContainer";

export const metadata: Metadata = {
  title: "Apartments | Top Rated Apartment Hotels",
  description:
    "Explore verified apartments and extended-stay residences across Europe.",
};

export default function ApartmentsPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="border-b border-border bg-surface">
        <SiteContainer className="py-12 sm:py-14 lg:py-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Apartments across Europe
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold text-primary sm:text-5xl">
            Space to settle in. Locations you&apos;ll want to explore.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Discover trusted apartments for city breaks,
            family trips, business stays, and longer visits
            across Europe.
          </p>
        </SiteContainer>
      </section>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <ApartmentGrid />
      </SiteContainer>
    </main>
  );
}