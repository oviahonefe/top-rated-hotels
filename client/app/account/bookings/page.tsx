import { notFound } from "next/navigation";
import BookingForm from "@/components/bookings/BookingForm";
import SiteContainer from "@/components/ui/SiteContainer";
import {
  getApartmentDetail,
  getHotelDetail,
} from "@/lib/api";

type Props = {
  searchParams: Promise<{
    propertyId?: string;
    slug?: string;
    kind?: "hotel" | "apartment";
    unitKey?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: string;
  }>;
};

export default async function BookingPage({
  searchParams,
}: Props) {
  const values = await searchParams;

  if (
    !values.propertyId ||
    (values.kind !== "hotel" && values.kind !== "apartment")
  ) {
    notFound();
  }

  // New links provide both values. Older links used propertyId as the slug.
  const propertySlug = values.slug ?? values.propertyId;

  const property =
    values.kind === "hotel"
      ? await getHotelDetail(propertySlug)
      : await getApartmentDetail(propertySlug);

  // For new links, ensure the public slug and protected booking ID match.
  if (values.slug && property.id !== values.propertyId) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <BookingForm
          property={property}
          unitKey={values.unitKey ?? "default"}
          initialCheckInDate={values.checkInDate}
          initialCheckOutDate={values.checkOutDate}
          initialGuestCount={
            Number.isFinite(Number(values.guests))
              ? Number(values.guests)
              : 1
          }
        />
      </SiteContainer>
    </main>
  );
}