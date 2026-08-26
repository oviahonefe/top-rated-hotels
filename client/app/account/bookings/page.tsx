import AccountGate from "@/components/account/AccountGate";
import BookingHistory from "@/components/account/BookingHistory";
import SiteContainer from "@/components/ui/SiteContainer";

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">
      <section className="border-b border-border bg-background">
        <SiteContainer className="py-10 sm:py-12 lg:py-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Your travel account
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-primary sm:text-5xl">
            My bookings
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Every reservation shown here is loaded from your real account.
          </p>
        </SiteContainer>
      </section>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <AccountGate>
          <BookingHistory />
        </AccountGate>
      </SiteContainer>
    </main>
  );
}