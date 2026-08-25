import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HotelGallery from "@/components/hotels/HotelGallery";
import SiteContainer from "@/components/ui/SiteContainer";
import { hotels } from "@/lib/home-data";

type HotelDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: HotelDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const hotel = hotels.find((item) => item.id === id);

  if (!hotel) {
    return {
      title: "Stay not found | Top Rated Apartment Hotels",
    };
  }

  return {
    title: `${hotel.name} | Top Rated Apartment Hotels`,
    description: hotel.description,
  };
}

export default async function HotelDetailsPage({
  params,
}: HotelDetailsPageProps) {
  const { id } = await params;
  const hotel = hotels.find((item) => item.id === id);

  if (!hotel) {
    notFound();
  }

  const galleryImages = [
    hotel.image,
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      <SiteContainer className="py-6 sm:py-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground"
        >
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/hotels" className="transition hover:text-accent">
            Hotels
          </Link>
          <span>/</span>
          <span className="text-primary">{hotel.name}</span>
        </nav>
      </SiteContainer>

      <SiteContainer>
        <HotelGallery hotelName={hotel.name} images={galleryImages} />
      </SiteContainer>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div>
            <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                  {hotel.type}
                </p>

                <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
                  {hotel.name}
                </h1>

                <p className="mt-3 text-base font-semibold text-muted-foreground">
                  {hotel.city}, {hotel.country}
                </p>
              </div>

              <div className="border border-border bg-surface px-4 py-3 sm:text-right">
                <p className="text-lg font-extrabold text-primary">
                  {hotel.rating.toFixed(1)} / 5
                </p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {hotel.reviews} verified reviews
                </p>
              </div>
            </div>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                About this stay
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                {hotel.description} Every Top Rated Hotels property is reviewed
                for guest experience, location, comfort, and dependable service.
              </p>
            </section>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                Included with your stay
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ...hotel.features,
                  "Verified accommodation",
                  "Secure booking process",
                  "Guest support",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 border border-border bg-surface px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
                      ✓
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                Good to know
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Check-in"
                  text="From 3:00 PM. Your property host will share arrival details after booking."
                />
                <InfoCard
                  title="Check-out"
                  text="Until 11:00 AM. Early check-in may be available on request."
                />
                <InfoCard
                  title="Payment"
                  text="Choose from the secure payment methods available at checkout."
                />
                <InfoCard
                  title="Support"
                  text="Our guest support team is available before and during your stay."
                />
              </div>
            </section>
          </div>

          <aside className="h-fit border border-border bg-background p-5 shadow-lg lg:sticky lg:top-24">
            <p className="text-sm font-semibold text-muted-foreground">
              Starting from
            </p>

            <p className="mt-1 text-2xl font-extrabold text-primary">
              {hotel.priceLabel}
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Final payment options are shown before you confirm your booking.
            </p>

            <div className="mt-6 grid gap-4 border-y border-border py-5">
              <label className="block">
                <span className="text-sm font-bold text-primary">
                  Check-in date
                </span>
                <input
                  type="date"
                  className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-primary">
                  Check-out date
                </span>
                <input
                  type="date"
                  className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-primary">Guests</span>
                <select className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>5+ guests</option>
                </select>
              </label>
            </div>

            <Link
              href={`/bookings?hotel=${hotel.id}`}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Reserve this stay
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
              You will review your stay details before payment.
            </p>
          </aside>
        </div>
      </SiteContainer>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-border bg-surface p-5">
      <h3 className="text-base font-extrabold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}