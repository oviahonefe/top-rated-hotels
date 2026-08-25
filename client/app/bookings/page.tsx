import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingForm from "@/components/bookings/BookingForm";
import SiteContainer from "@/components/ui/SiteContainer";
import { apartments, hotels } from "@/lib/home-data";

export const metadata: Metadata = {
  title: "Reserve Your Stay | Top Rated Apartment Hotels",
  description: "Review and reserve your selected European stay.",
};

type BookingPageProps = {
  searchParams: Promise<{
    hotel?: string;
  }>;
};

export default async function BookingPage({
  searchParams,
}: BookingPageProps) {
  const { hotel: propertyId } = await searchParams;

  const property = propertyId
    ? [...hotels, ...apartments].find((item) => item.id === propertyId)
    : hotels[0];

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <BookingForm hotel={property} />
      </SiteContainer>
    </main>
  );
}