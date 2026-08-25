import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/components/account/FavoriteButton";
import PropertyReservationCard from "@/components/bookings/PropertyReservationCard";
import HotelGallery from "@/components/hotels/HotelGallery";
import SiteContainer from "@/components/ui/SiteContainer";
import { ApiError, getHotelDetail } from "@/lib/api";

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
    const hotel = await getHotelDetail(id);

    return {
      title: `${hotel.name} | Top Rated Apartment Hotels`,
      description: hotel.description,
    };
  } catch {
    return {
      title: "Hotel not found | Top Rated Apartment Hotels",
    };
  }
}

export default async function HotelDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  let hotel;

  try {
    hotel = await getHotelDetail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const galleryImages = hotel.images.map((image) => image.url);

  return (
    <main className="min-h-screen bg-background pt-20">
      <SiteContainer className="py-6 sm:py-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/hotels" className="hover:text-accent">
            Hotels
          </Link>
          <span>/</span>
          <span className="text-primary">{hotel.name}</span>
        </nav>
      </SiteContainer>

      <SiteContainer>
        <HotelGallery
          hotelName={hotel.name}
          images={galleryImages}
        />
      </SiteContainer>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div>
            <header className="border-b border-border pb-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                {hotel.tier} hotel
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
                {hotel.name}
              </h1>

              <p className="mt-3 text-base font-semibold text-muted-foreground">
                {hotel.address.city}, {hotel.address.country}
              </p>

              <div className="mt-5">
                <FavoriteButton
                  propertyId={hotel.id}
                  propertyKind="hotel"
                />
              </div>

              {hotel.starRating ? (
                <p className="mt-4 inline-flex border border-border bg-surface px-3 py-2 text-sm font-extrabold text-primary">
                  {hotel.starRating.toFixed(1)} star property
                </p>
              ) : null}
            </header>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                About this stay
              </h2>

              <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-muted-foreground">
                {hotel.description}
              </p>
            </section>

            <section className="border-b border-border py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                Included amenities
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {hotel.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 border border-border bg-surface px-4 py-3 text-sm font-semibold text-primary"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-white">
                      ✓
                    </span>
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            <section className="py-8">
              <h2 className="text-2xl font-extrabold text-primary">
                Available room types
              </h2>

              <div className="mt-6 grid gap-4">
                {hotel.rooms.map((room) => (
                  <article
                    key={room.id}
                    className="border border-border bg-surface p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-extrabold text-primary">
                          {room.name}
                        </h3>

                        {room.description ? (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {room.description}
                          </p>
                        ) : null}

                        <p className="mt-3 text-sm font-semibold text-muted-foreground">
                          Up to {room.maxGuests} guests
                          {room.bedSummary
                            ? ` · ${room.bedSummary}`
                            : ""}
                        </p>
                      </div>

                      <p className="text-lg font-extrabold text-primary">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(
                          room.platformNightlyRateCents / 100,
                        )}
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          / night
                        </span>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <PropertyReservationCard property={hotel} />
        </div>
      </SiteContainer>
    </main>
  );
}