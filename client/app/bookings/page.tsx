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
    kind?: "hotel" | "apartment";
    unitKey?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: string;
  }>;
};

export default async function BookingPage({ searchParams }: Props) {
  const values = await searchParams;

  if (
    !values.propertyId ||
    (values.kind !== "hotel" && values.kind !== "apartment")
  ) {
    notFound();
  }

  const property =
    values.kind === "hotel"
      ? await getHotelDetail(values.propertyId)
      : await getApartmentDetail(values.propertyId);

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