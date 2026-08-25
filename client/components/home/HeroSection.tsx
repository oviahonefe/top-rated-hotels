import Image from "next/image";
import Button from "@/components/ui/Button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800&auto=format&fit=crop";

const stats = [
  ["4.8/5", "Average guest rating"],
  ["12+", "European countries"],
  ["Malaga", "Launch destination"],
];

export default function HeroSection() {
  return (
    <section className="relative bg-surface pt-20">
      <div className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <Image
          src={HERO_IMAGE}
          alt="Modern apartment hotel stay in Europe"
          fill
          priority
          sizes="58vw"
          className="object-cover [mask-image:linear-gradient(to_right,transparent_0%,black_32%)]"
        />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-[82rem] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Curated stays across Europe
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-primary sm:text-5xl lg:text-[4rem]">
            Top-rated places to stay, made easy to book.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Discover verified apartment hotels, villas, serviced lodges, and
            premium stays across Malaga and Europe&apos;s most loved cities.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/hotels" variant="accent" size="lg">
              Explore hotels
            </Button>

            <Button href="/apartments" variant="outline" size="lg">
              Browse apartments
            </Button>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="rounded-md border border-border bg-background p-4 shadow-sm"
              >
                <p className="font-heading text-xl font-extrabold text-primary">
                  {value}
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:hidden">
          <Image
            src={HERO_IMAGE}
            alt="Modern apartment hotel stay in Europe"
            width={900}
            height={675}
            priority
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
          />
        </div>

        <div className="card relative mb-[-50] z-10 grid gap-4 bg-background p-4 shadow-xl sm:grid-cols-2 lg:absolute lg:bottom-0 lg:left-8 lg:right-8 lg:grid-cols-[1.2fr_1fr_1fr_auto] lg:p-5">
          <SearchField label="Where" value="Malaga, Spain" />
          <SearchField label="Stay type" value="Apartment hotel" />
          <SearchField label="Budget" value="$30,000 / 4 days" />

          <Button
            href="/hotels"
            variant="accent"
            className="h-12 w-full lg:self-end rounded-lg"
          >
            Search stays
          </Button>
        </div>
      </div>
    </section>
  );
}

function SearchField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>

      <input
        type="text"
        defaultValue={value}
        aria-label={label}
        className="mt-2 h-12 w-full rounded-md border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </label>
  );
}