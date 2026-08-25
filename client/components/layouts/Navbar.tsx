"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";
import { AUTH_CHANGED_EVENT } from "@/lib/api";
import {
  authApi,
  getStoredUser,
  hasStoredSession,
} from "@/lib/auth";
import type { AuthUser } from "@/types/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/apartments", label: "Apartments" },
  { href: "/account/bookings", label: "My bookings" },
];

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    function updateUser() {
      setUser(getStoredUser());
    }

    updateUser();

    if (hasStoredSession()) {
      void authApi.me()
        .then((currentUser) => setUser(currentUser))
        .catch(() => setUser(null));
    }

    window.addEventListener(AUTH_CHANGED_EVENT, updateUser);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, updateUser);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function signOut() {
    await authApi.logout();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  function active(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[82rem] items-center justify-between px-4 sm:px-6 lg:px-8">
        <TopRatedHotelsLogo />

        <ul className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href} 
                className={`text-sm font-bold transition ${
                  active(link.href)
                    ? "text-accent"
                    : "text-secondary hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 xl:flex">
          {user ? (
            <>
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-2"
              >
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                )}

                <span className="max-w-36 truncate text-sm font-bold text-primary">
                  {user.firstName} {user.lastName}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => void signOut()}
                className="text-sm font-bold text-secondary hover:text-red-700"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-bold text-primary hover:text-accent"
              >
                Sign in
              </Link>

              <Link
                href="/hotels"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Find a stay
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center border border-border xl:hidden"
          aria-label="Toggle navigation"
        >
          <span className="text-xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </nav>

      {menuOpen ? (
        <div className="border-t border-border bg-background px-4 py-5 xl:hidden">
          {user ? (
            <Link
              href="/account"
              className="mb-5 block border border-border bg-surface p-4"
            >
              <p className="font-extrabold text-primary">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Signed in as {user.email}
              </p>
            </Link>
          ) : null}

          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-3 font-bold ${
                  active(link.href)
                    ? "bg-surface text-accent"
                    : "text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="rounded-full border border-primary px-4 py-3 text-center text-sm font-bold text-primary"
                >
                  My account
                </Link>

                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full border border-primary px-4 py-3 text-center text-sm font-bold text-primary"
                >
                  Sign in
                </Link>

                <Link
                  href="/hotels"
                  className="rounded-full bg-accent px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Find a stay
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}