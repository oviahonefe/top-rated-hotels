import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteContainer from "@/components/ui/SiteContainer";

export const metadata: Metadata = {
  title: "My Bookings | Top Rated Apartment Hotels",
  description: "View and manage your Top Rated Apartment Hotels bookings.",
};

const bookingRecords = [
  {
    id: "TRH-48291",
    property: "Marina Collection Suites",
    location: "Malaga, Spain",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop",
    checkIn: "18 Sep 2026",
    checkOut: "22 Sep 2026",
    guests: "2 guests",
    total: "$30,000",
    status: "Confirmed",
    href: "/hotels/marina-collection-malaga",
  },
  {
    id: "TRH-47508",
    property: "Gran Via Residences",
    location: "Barcelona, Spain",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=900&auto=format&fit=crop",
    checkIn: "04 Aug 2026",
    checkOut: "08 Aug 2026",
    guests: "3 guests",
    total: "$32,000",
    status: "Completed",
    href: "/hotels/gran-via-residences",
  },
  {
    id: "TRH-46172",
    property: "Alfama Riverside Lodge",
    location: "Lisbon, Portugal",
    image:
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=900&auto=format&fit=crop",
    checkIn: "12 Jun 2026",
    checkOut: "16 Jun 2026",
    guests: "2 guests",
    total: "$28,000",
    status: "Completed",
    href: "/hotels/alfama-riverside-lodge",
  },
];

export default function MyBookingsPage() {
  const upcomingBooking = bookingRecords.find(
    (booking) => booking.status === "Confirmed",
  );

  const pastBookings = bookingRecords.filter(
    (booking) => booking.status !== "Confirmed",
  );

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

          <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Review upcoming stays, see previous bookings, and access your
            property details in one place.
          </p>
        </SiteContainer>
      </section>

      <SiteContainer className="py-10 sm:py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total bookings" value="3" />
          <SummaryCard label="Upcoming stays" value="1" />
          <SummaryCard label="Completed stays" value="2" />
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
                Coming up
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-primary">
                Upcoming stay
              </h2>
            </div>

            <Link
              href="/hotels"
              className="text-sm font-extrabold text-accent transition hover:text-accent-dark"
            >
              Find another stay
            </Link>
          </div>

          {upcomingBooking ? (
            <article className="mt-6 grid overflow-hidden border border-border bg-background lg:grid-cols-[18rem_minmax(0,1fr)]">
              <div className="relative min-h-56">
                <Image
                  src={upcomingBooking.image}
                  alt={upcomingBooking.property}
                  fill
                  sizes="(max-width: 1023px) 100vw, 288px"
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="inline-flex bg-green-50 px-3 py-1 text-xs font-extrabold text-green-700">
                      {upcomingBooking.status}
                    </span>

                    <p className="mt-4 text-sm font-bold text-accent">
                      {upcomingBooking.location}
                    </p>

                    <h3 className="mt-2 text-2xl font-extrabold text-primary">
                      {upcomingBooking.property}
                    </h3>
                  </div>

                  <p className="text-sm font-semibold text-muted-foreground">
                    Ref: {upcomingBooking.id}
                  </p>
                </div>

                <div className="mt-7 grid gap-4 border-y border-border py-5 sm:grid-cols-3">
                  <BookingInfo label="Check-in" value={upcomingBooking.checkIn} />
                  <BookingInfo label="Check-out" value={upcomingBooking.checkOut} />
                  <BookingInfo label="Guests" value={upcomingBooking.guests} />
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-lg font-extrabold text-primary">
                    {upcomingBooking.total}
                  </p>

                  <Link
                    href={upcomingBooking.href}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-dark"
                  >
                    View booking details
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            <EmptyState />
          )}
        </section>

        <section className="mt-14">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
            Your history
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-primary">
            Previous stays
          </h2>

          <div className="mt-6 overflow-x-auto border border-border bg-background">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-border bg-surface">
                <tr className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-4">Property</th>
                  <th className="px-5 py-4">Stay dates</th>
                  <th className="px-5 py-4">Booking reference</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>

              <tbody>
                {pastBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-4">
                      <p className="font-extrabold text-primary">
                        {booking.property}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {booking.location}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-primary">
                      <p>{booking.checkIn}</p>
                      <p className="mt-1 text-muted-foreground">
                        to {booking.checkOut}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-muted-foreground">
                      {booking.id}
                    </td>

                    <td className="px-5 py-4 text-sm font-extrabold text-primary">
                      {booking.total}
                    </td>

                    <td className="px-5 py-4">
                      <span className="bg-surface px-3 py-1 text-xs font-extrabold text-primary">
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={booking.href}
                        className="text-sm font-extrabold text-accent transition hover:text-accent-dark"
                      >
                        View stay
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </SiteContainer>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-5">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-primary">{value}</p>
    </div>
  );
}

function BookingInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-primary">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 border border-dashed border-border bg-background p-10 text-center">
      <h3 className="text-xl font-extrabold text-primary">
        No upcoming stays yet
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Explore top-rated apartment hotels and plan your next European trip.
      </p>
      <Link
        href="/hotels"
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Explore stays
      </Link>
    </div>
  );
}