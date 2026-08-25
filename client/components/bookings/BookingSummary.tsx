import Image from "next/image";
import type { Hotel } from "@/lib/home-data";

type BookingSummaryProps = {
  hotel: Hotel;
  nights: number;
  guests: string;
};

export default function BookingSummary({
  hotel,
  nights,
  guests,
}: BookingSummaryProps) {
  const nightlyPrice = Math.round(hotel.price / 4);
  const totalPrice = nightlyPrice * nights;

  return (
    <aside className="h-fit border border-border bg-background p-5 shadow-lg lg:sticky lg:top-24">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">
        Booking summary
      </p>

      <div className="mt-5 flex gap-4 border-b border-border pb-5">
        <Image
          src={hotel.image}
          alt={hotel.name}
          width={160}
          height={120}
          className="h-24 w-28 object-cover"
        />

        <div className="min-w-0">
          <p className="text-xs font-bold text-accent">
            {hotel.city}, {hotel.country}
          </p>

          <h2 className="mt-1 text-base font-extrabold text-primary">
            {hotel.name}
          </h2>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {hotel.rating.toFixed(1)} / 5 · {hotel.reviews} reviews
          </p>
        </div>
      </div>

      <div className="space-y-4 border-b border-border py-5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Guests</span>
          <span className="font-bold text-primary">{guests}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Length of stay</span>
          <span className="font-bold text-primary">
            {nights} {nights === 1 ? "night" : "nights"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Estimated nightly rate</span>
          <span className="font-bold text-primary">
            ${nightlyPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-5 pt-5">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Estimated total
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Taxes and final payment options appear next.
          </p>
        </div>

        <p className="text-xl font-extrabold text-primary">
          ${totalPrice.toLocaleString()}
        </p>
      </div>
    </aside>
  );
}