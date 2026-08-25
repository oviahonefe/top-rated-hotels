import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/account/FavoriteButton";
import PropertyReservationCard from "@/components/bookings/PropertyReservationCard";
import SiteContainer from "@/components/ui/SiteContainer";
import { ApiError, getApartmentDetail } from "@/lib/api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const apartment = await getApartmentDetail(id);

    return {
      title: `${apartment.name} | Top Rated Apartment Hotels`,
      description: apartment.description,
    };
  } catch {
    return {
      title: "Apartment not found | Top Rated Apartment Hotels",
    };
  }
}

export default async function ApartmentDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  let apartment;

  try {
    apartment = await getApartmentDetail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const primaryImage =
    apartment.images.find((image) => image.isPrimary) ??
    apartment.images[0];

  return (
    <main className="min-h-screen bg-background pt-20">
      <SiteContainer className="py-6 sm:py-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/apartments" className="hover:text-accent">
            Apartments
          </Link>
          <span>/</span>
          <span className="text-primary">{apartment.name}</span>
        </nav>
      </SiteContainer>

      <SiteContainer>
        <div className="relative min-h-[360px] overflow-hidden border border-border sm:min-h-[500px]">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || apartment.name}
              fill
              priority
              sizes="(max-width: 1320px) 100vw, 82rem"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-surface" />
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 sm:p-8">
            <p className="text-sm font-bold text-white/85">
              {apartment.address.city}, {apartment.address.country}
            </p>
            <div className="mt-5">
              <FavoriteButton
                propertyId={apartment.id}
                propertyKind="apartment"
              />
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              {apartment.name}
            </h1>
          </div>
        </div>
      </SiteContainer>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div>
            <section className="border-b border-border pb-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                {apartment.tier} apartment
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Stat
                  label="Bedrooms"
                  value={String(apartment.bedrooms ?? 0)}
                />
                <Stat
                  label="Bathrooms"
                  value={String(apartment.bathrooms ?? 0)}
                />
                <Stat
                  label="Guest capacity"
                  value={`Up to ${apartment.maxGuests ?? 1}`}
                />
              </div>
            </section>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                About this apartment
              </h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
                {apartment.description}
              </p>
            </section>

            <section className="py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                Included amenities
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {apartment.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="border border-border bg-surface px-4 py-3 text-sm font-semibold text-primary"
                  >
                    {amenity}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <PropertyReservationCard property={apartment} />
        </div>
      </SiteContainer>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border bg-surface p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-extrabold text-primary">{value}</p>
    </div>
  );
}