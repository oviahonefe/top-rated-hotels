import type { Metadata } from "next";
import HotelGrid from "@/components/hotels/HotelGrid";
import SiteContainer from "@/components/ui/SiteContainer";

export const metadata: Metadata = {
  title: "Hotels | Top Rated Apartment Hotels",
  description:
    "Explore top-rated apartment hotels, villas, and serviced lodges across Europe.",
};

export default function HotelsPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="border-b border-border bg-surface">
        <SiteContainer className="py-12 sm:py-14 lg:py-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Explore Europe
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold text-primary sm:text-5xl">
            Find a stay worth looking forward to.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Browse trusted apartment hotels, private villas, and serviced lodges
            in Malaga and Europe&apos;s most loved destinations.
          </p>
        </SiteContainer>
      </section>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <HotelGrid />
      </SiteContainer>
    </main>
  );
}