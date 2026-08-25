import Image from "next/image";
import RatingStars from "@/components/reviews/RatingStars";
import type { GuestReview } from "@/lib/home-data";

type ReviewCardProps = {
  review: GuestReview;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex h-full flex-col border border-border bg-background p-6">
      <RatingStars rating={review.rating} />

      <blockquote className="mt-5 text-base leading-8 text-secondary">
        &ldquo;{review.comment}&rdquo;
      </blockquote>

      <div className="mt-8 flex items-center gap-4 border-t border-border pt-5">
        <Image
          src={review.avatar}
          alt={`${review.guestName} profile`}
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-full object-cover"
        />

        <div className="min-w-0">
          <p className="font-extrabold text-primary">{review.guestName}</p>

          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {review.guestLocation}
          </p>

          <p className="mt-3 text-sm font-bold text-accent">
            Stayed at {review.propertyName}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {review.propertyLocation} · {review.date}
          </p>
        </div>
      </div>
    </article>
  );
}