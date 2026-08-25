"use client";

import { FormEvent, useState } from "react";
import SiteContainer from "@/components/ui/SiteContainer";

const contactDetails = [
  {
    title: "Guest support",
    value: "support@topratedhotels.com",
    href: "mailto:support@topratedhotels.com",
    description: "Questions about stays, bookings, or payments.",
  },
  {
    title: "Partner with us",
    value: "partners@topratedhotels.com",
    href: "mailto:partners@topratedhotels.com",
    description: "List your apartment hotel, villa, or lodge.",
  },
  {
    title: "Call our team",
    value: "+34 951 000 000",
    href: "tel:+34951000000",
    description: "Monday to Friday, 9:00 AM to 6:00 PM CET.",
  },
];

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <section id="contact" className="bg-surface py-20 sm:py-24 lg:py-28">
      <SiteContainer>
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
              Contact Top Rated Hotels
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
              Let&apos;s make your next European stay simple.
            </h2>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Our team helps guests discover quality stays and supports property
              partners building trusted listings across Europe.
            </p>

            <div className="mt-10 space-y-4">
              {contactDetails.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="block border border-border bg-background p-5 transition hover:border-accent hover:shadow-sm"
                >
                  <p className="text-sm font-bold text-primary">{item.title}</p>
                  <p className="mt-2 text-base font-semibold text-accent">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="border border-border bg-background p-6 shadow-sm sm:p-8">
            <div>
              <h3 className="text-2xl font-extrabold text-primary">
                Send us a message
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Tell us how we can help and our team will get back to you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="firstName"
                  label="First name"
                  placeholder="Your first name"
                />

                <FormField
                  id="lastName"
                  label="Last name"
                  placeholder="Your last name"
                />
              </div>

              <FormField
                id="email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
              />

              <div>
                <label
                  htmlFor="subject"
                  className="text-sm font-bold text-primary"
                >
                  What can we help with?
                </label>

                <select
                  id="subject"
                  name="subject"
                  required
                  defaultValue=""
                  className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="booking">Booking support</option>
                  <option value="property">List a property</option>
                  <option value="payment">Payment question</option>
                  <option value="general">General enquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-bold text-primary"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us what you need help with..."
                  className="mt-2 w-full resize-y border border-border bg-surface px-4 py-3 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {isSubmitted ? (
                <p
                  role="status"
                  className="border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800"
                >
                  Thank you. Your message has been received.
                </p>
              ) : null}

              <button
                type="submit"
                className="h-12 rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-dark"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder: string;
};

function FormField({
  id,
  label,
  type = "text",
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-primary">
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-medium text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}