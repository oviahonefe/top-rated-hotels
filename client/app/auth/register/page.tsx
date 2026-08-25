import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";
import SiteContainer from "@/components/ui/SiteContainer";

export const metadata: Metadata = {
  title: "Create Account | Top Rated Apartment Hotels",
  description: "Create an account to manage your European stays and bookings.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="flex min-h-[calc(100svh-5rem)] items-center py-10 sm:py-12 lg:py-16">
        <div className="grid w-full overflow-hidden border border-border bg-background lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <TopRatedHotelsLogo
              className="[&>span:last-child>span:first-child]:text-white [&>span:last-child>span:last-child]:text-white/70"
            />

            <div className="max-w-md">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent-light">
                Your travel starts here
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight">
                Create an account for better stays.
              </h1>

              <p className="mt-5 text-base leading-8 text-white/75">
                Save favourite apartment hotels, manage reservations, and book
                trusted European stays with confidence.
              </p>
            </div>

            <p className="text-sm font-semibold text-white/65">
              One account for every Top Rated Hotels booking.
            </p>
          </section>

          <section className="mx-auto w-full max-w-xl p-6 sm:p-10 lg:p-14">
            <div className="lg:hidden">
              <TopRatedHotelsLogo />
            </div>

            <div className="mt-10 lg:mt-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                Join Top Rated Hotels
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Save time when booking your next apartment hotel, villa, or
                serviced stay across Europe.
              </p>

              <RegisterForm />

              <div className="mt-7 border-t border-border pt-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  Already have an account?
                </p>

                <Link
                  href="/auth/login"
                  className="mt-3 inline-flex text-sm font-extrabold text-accent transition hover:text-accent-dark"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </section>
        </div>
      </SiteContainer>
    </main>
  );
}