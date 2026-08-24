import SiteContainer from "../ui/SiteContainer";

const steps = [
  {
    title: "Discover",
    description:
      "Search by European city, property type, guest capacity, amenities, and budget.",
  },
  {
    title: "Compare",
    description:
      "Review prices, ratings, image galleries, features, and availability before booking.",
  },
  {
    title: "Checkout",
    description:
      "Choose an admin-enabled payment method and complete a secure reservation.",
  },
];

export default function BookingFlow() {
  return (
    <section className="bg-background py-20">
      <SiteContainer>
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            Booking experience
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Designed for a real marketplace workflow
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The frontend is being arranged so the backend and admin dashboard
            can plug in cleanly later: listings, availability, booking status,
            and payment methods all have a natural place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="card rounded-lg p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-sm font-black text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-primary">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SiteContainer>
    </section>
  );
}
