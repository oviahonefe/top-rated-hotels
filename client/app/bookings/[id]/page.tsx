import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteContainer from "@/components/ui/SiteContainer";
import { hotels } from "@/lib/home-data";
import { apartments, hotels } from "@/lib/home-data";

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

  return {
    title: hotel
      ? `${hotel.name} | Top Rated Apartment Hotels`
      : "Hotel Not Found | Top Rated Apartment Hotels",
    description: hotel?.description,
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
        <div className="relative min-h-[360px] overflow-hidden border border-border sm:min-h-[480px]">
          <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            priority
            sizes="(max-width: 1320px) 100vw, 82rem"
            className="object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 sm:p-8">
            <p className="text-sm font-bold text-white/85">
              {hotel.city}, {hotel.country}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              {hotel.name}
            </h1>
          </div>
        </div>
      </SiteContainer>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div>
            <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                  {hotel.type}
                </p>

                <p className="mt-3 text-base font-semibold text-muted-foreground">
                  A verified Top Rated Apartment Hotels stay.
                </p>
              </div>

              <div className="border border-border bg-surface px-5 py-4">
                <p className="text-xl font-extrabold text-primary">
                  {hotel.rating.toFixed(1)} / 5
                </p>

                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {hotel.reviews} verified guest reviews
                </p>
              </div>
            </div>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                About this stay
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                {hotel.description} This property has been selected for its
                comfort, location, and strong guest experience.
              </p>
            </section>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                What&apos;s included
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
                  text="From 3:00 PM. Arrival details are shared once a booking is confirmed."
                />

                <InfoCard
                  title="Check-out"
                  text="Until 11:00 AM. Early check-in may be available on request."
                />

                <InfoCard
                  title="Payments"
                  text="Your available secure payment methods are shown before you confirm."
                />

                <InfoCard
                  title="Support"
                  text="Top Rated Hotels guest support is available before and during your stay."
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
              You will review all booking details before payment.
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