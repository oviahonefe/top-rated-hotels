"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountGate from "@/components/account/AccountGate";
import SiteContainer from "@/components/ui/SiteContainer";
import { authApi } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();

  async function signOut() {
    await authApi.logout();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-surface pt-20">
      <SiteContainer className="py-12 lg:py-16">
        <AccountGate>
          <section className="max-w-3xl border border-border bg-background p-6 sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                Account settings
              </p>

              <h1 className="mt-3 text-4xl font-extrabold text-primary">
                Your account
              </h1>

              <div className="mt-8 border-y border-border py-6">
                <p className="text-sm font-semibold text-muted-foreground">
                  Account access
                </p>
                <p className="mt-2 text-lg font-extrabold text-primary">
                  You are signed in
                </p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/account/bookings"
                  className="rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary"
                >
                  My bookings
                </Link>

                <Link
                  href="/account/favorites"
                  className="rounded-full border border-primary px-5 py-3 text-sm font-bold text-primary"
                >
                  Saved stays
                </Link>

                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white"
                >
                  Sign out
                </button>
              </div>
          </section>
        </AccountGate>
      </SiteContainer>
    </main>
  );
}