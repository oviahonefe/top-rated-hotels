import type { Metadata } from "next";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";
import SiteContainer from "@/components/ui/SiteContainer";

export const metadata: Metadata = {
  title: "Sign In | Top Rated Apartment Hotels",
  description: "Sign in to manage your bookings and favourite stays.",
};

export default function LoginPage() {
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
                Your travel account
              </p>

              <h1 className="mt-4 text-4xl font-extrabold leading-tight">
                Every great stay, all in one place.
              </h1>

              <p className="mt-5 text-base leading-8 text-white/75">
                Sign in to manage upcoming stays, review your booking history,
                and keep track of your favourite European destinations.
              </p>
            </div>

            <p className="text-sm font-semibold text-white/65">
              Trusted stays across Europe, starting in Malaga.
            </p>
          </section>

          <section className="mx-auto w-full max-w-xl p-6 sm:p-10 lg:p-14">
            <div className="lg:hidden">
              <TopRatedHotelsLogo />
            </div>

            <div className="mt-10 lg:mt-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                Welcome back
              </p>

              <h1 className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
                Sign in to your account
              </h1>

              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Use your account details to manage reservations and future stays.
              </p>

              <SignInForm />

              <div className="mt-7 border-t border-border pt-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  New to Top Rated Apartment Hotels?
                </p>

                <Link
                  href="/auth/register"
                  className="mt-3 inline-flex text-sm font-extrabold text-accent transition hover:text-accent-dark"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </SiteContainer>
    </main>
  );
}