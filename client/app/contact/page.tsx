import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import SiteContainer from "@/components/ui/SiteContainer";

export const metadata: Metadata = {
  title: "Contact Us | Top Rated Apartment Hotels",
  description:
    "Get booking support, payment help, or property partnership information from Top Rated Apartment Hotels.",
};

const helpTopics = [
  {
    number: "01",
    title: "Booking support",
    text: "Need help choosing a stay, reviewing reservation details, or understanding what happens before confirmation? Our guest support team can guide you.",
  },
  {
    number: "02",
    title: "Payments and checkout",
    text: "Contact us when you need help with a payment method, a booking total, payment confirmation, or a question before checkout.",
  },
  {
    number: "03",
    title: "List your property",
    text: "Apartment hotel owners, villa hosts, and serviced accommodation partners can contact our partnerships team about joining the platform.",
  },
];

const contactOptions = [
  {
    title: "Guest support",
    value: "support@topratedhotels.es",
    href: "mailto:support@topratedhotels.es",
    description: "For booking questions, stay details, account support, and general guest enquiries.",
  },
  {
    title: "Property partnerships",
    value: "support@topratedhotels.es",
    href: "mailto:support@topratedhotels.es",
    description: "For property owners and managers interested in listing an apartment hotel, villa, or lodge.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">
      <section className="border-b border-border bg-background">
        <SiteContainer className="py-12 sm:py-14 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              Contact Top Rated Hotels
            </p>

            <h1 className="mt-3 text-4xl font-extrabold text-primary sm:text-5xl">
              Clear answers before, during, and after your stay.
            </h1>

            <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
              Top Rated Apartment Hotels connects guests with trusted stays
              across Europe. Whether you are planning a trip to Malaga, managing
              a reservation, or preparing to list a property, our team is here
              to help you move forward with confidence.
            </p>
          </div>
        </SiteContainer>
      </section>

      <section className="border-b border-border bg-surface">
        <SiteContainer className="py-12 sm:py-14 lg:py-16">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            How we can help
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {helpTopics.map((topic) => (
              <article
                key={topic.number}
                className="border border-border bg-background p-6"
              >
                <p className="text-sm font-extrabold text-accent">
                  {topic.number}
                </p>

                <h2 className="mt-5 text-xl font-extrabold text-primary">
                  {topic.title}
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {topic.text}
                </p>
              </article>
            ))}
          </div>
        </SiteContainer>
      </section>

      <SiteContainer className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <section>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              Reach our team
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-primary">
              Choose the right contact channel.
            </h2>

            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Sharing the right details helps us understand your request. For
              booking support, include your booking reference when you have one.
              For property partnerships, include your property location and stay
              type.
            </p>

            <div className="mt-8 space-y-4">
              {contactOptions.map((option) => (
                <a
                  key={option.title}
                  href={option.href}
                  className="block border border-border bg-background p-5 transition hover:border-accent hover:shadow-sm"
                >
                  <p className="text-sm font-bold text-primary">
                    {option.title}
                  </p>

                  <p className="mt-2 text-base font-extrabold text-accent">
                    {option.value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-8 border border-border bg-background p-5">
              <h3 className="text-base font-extrabold text-primary">
                What happens next
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Once you send your enquiry, our team will review your message and make sure it reaches the right person. We’ll get back to you with the information or assistance you need.
              </p>
            </div>
          </section>

          <section className="h-fit border border-border bg-background p-6 shadow-sm sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              Send an enquiry
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-primary">
              Tell us what you need.
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Select the topic that best matches your request, then provide as
              much detail as you can. This helps the right team understand your
              enquiry from the start.
            </p>

            <div className="mt-7">
              <ContactForm />
            </div>
          </section>
        </div>
      </SiteContainer>
    </main>
  );
}