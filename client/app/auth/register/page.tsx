import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=85&w=1800&auto=format&fit=crop";

export const metadata: Metadata = {
  title: "Create Account | Top Rated Apartment Hotels",
  description: "Create an account to manage your European stays and bookings.",
};

export default function RegisterPage() {
  return (
   <main className="min-h-screen bg-surface">
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-primary px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div
            aria-hidden="true"
            className="auth-visual-image absolute -inset-8 opacity-45"
            style={{ backgroundImage: `url(${AUTH_IMAGE})` }}
          />

          <div aria-hidden="true" className="absolute inset-0 bg-primary/75" />

          <div className="relative z-10">
            <TopRatedHotelsLogo
              className="[&>span:last-child>span:first-child]:text-white [&>span:last-child>span:last-child]:text-white/70"
            />
          </div>

          <div className="auth-visual-content relative z-10 max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent-light">
              Your travel starts here
            </p>

            <h1 className="mt-5 text-5xl font-extrabold leading-tight !text-white">
              Create an account for better stays.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/80">
              Save favourite apartment hotels, manage reservations, and book
              trusted European stays with confidence.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm font-semibold text-white/75">
            One account for every Top Rated Hotels booking.
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <TopRatedHotelsLogo />
            </div>

            <div className="mt-10 border border-border bg-background p-6 shadow-sm sm:p-8 lg:mt-0">
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
          </div>
        </section>
      </div>
    </main>
  );
}