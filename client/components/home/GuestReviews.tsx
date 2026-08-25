import ReviewCard from "@/components/reviews/ReviewCard";
import SiteContainer from "@/components/ui/SiteContainer";
import { guestReviews } from "@/lib/home-data";

export default function GuestReviews() {
  return (
    <section className="bg-surface py-20 sm:py-24 lg:py-28">
      <SiteContainer>
        <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              Guest reviews
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
              Stays guests are happy to recommend.
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Reviews from guests who booked verified apartment hotels, villas,
              and serviced stays through Top Rated Hotels.
            </p>
          </div>

          <div className="border border-border bg-background px-5 py-4">
            <p className="text-2xl font-extrabold text-primary">4.8 / 5</p>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Average guest rating
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {guestReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}