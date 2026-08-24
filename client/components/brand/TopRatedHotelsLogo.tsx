import Link from "next/link";

type TopRatedHotelsLogoProps = {
  href?: string;
  className?: string;
};

export default function TopRatedHotelsLogo({
  href = "/",
  className = "",
}: TopRatedHotelsLogoProps) {
  return (
    <Link
      href={href}
      aria-label="Top Rated Apartment Hotels home"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className="h-7 w-7"
        >
          <path
            d="M10 39V17L24 8L38 17V39"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 39V28H30V39"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 21.5H16.6M24 21.5H24.1M31.5 21.5H31.6"
            stroke="#F1802B"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-heading truncate text-base font-extrabold text-primary sm:text-lg">
          Top Rated
        </span>
        <span className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:text-xs">
          Apartment Hotels
        </span>
      </span>
    </Link>
  );
}