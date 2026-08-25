import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ApartmentAmenities from "@/components/apartments/ApartmentAmenities";
import ApartmentAvailability from "@/components/apartments/ApartmentAvailability";
import SiteContainer from "@/components/ui/SiteContainer";
import { apartments } from "@/lib/home-data";

type ApartmentDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ApartmentDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const apartment = apartments.find((item) => item.id === id);

  return {
    title: apartment
      ? `${apartment.name} | Top Rated Apartment Hotels`
      : "Apartment Not Found | Top Rated Apartment Hotels",
    description: apartment?.description,
  };
}

export default async function ApartmentDetailsPage({
  params,
}: ApartmentDetailsPageProps) {
  const { id } = await params;
  const apartment = apartments.find((item) => item.id === id);

  if (!apartment) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <SiteContainer className="py-6 sm:py-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="transition hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/apartments" className="transition hover:text-accent">
            Apartments
          </Link>
          <span>/</span>
          <span className="text-primary">{apartment.name}</span>
        </nav>
      </SiteContainer>

      <SiteContainer>
        <div className="relative min-h-[360px] overflow-hidden border border-border sm:min-h-[500px]">
          <Image
            src={apartment.image}
            alt={apartment.name}
            fill
            priority
            sizes="(max-width: 1320px) 100vw, 82rem"
            className="object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 sm:p-8">
            <p className="text-sm font-bold text-white/85">
              {apartment.city}, {apartment.country}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              {apartment.name}
            </h1>
          </div>
        </div>
      </SiteContainer>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div>
            <div className="border-b border-border pb-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                Verified apartment stay
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Stat label="Bedrooms" value={`${apartment.bedrooms}`} />
                <Stat label="Bathrooms" value={`${apartment.bathrooms}`} />
                <Stat label="Guest capacity" value={`Up to ${apartment.guests}`} />
              </div>
            </div>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                About this apartment
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                {apartment.description}
              </p>
            </section>

            <ApartmentAmenities
              amenities={[
                ...apartment.features,
                "Verified accommodation",
                "Secure booking process",
                "Guest support",
              ]}
            />
          </div>

          <ApartmentAvailability apartment={apartment} />
        </div>
      </SiteContainer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-surface p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-extrabold text-primary">{value}</p>
    </div>
  );
}