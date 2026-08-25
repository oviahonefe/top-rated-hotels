import SiteContainer from "@/components/ui/SiteContainer";
import BookingPaymentDetails from "@/components/bookings/BookingPaymentDetails";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <BookingPaymentDetails bookingReference={id} />
      </SiteContainer>
    </main>
  );
}
