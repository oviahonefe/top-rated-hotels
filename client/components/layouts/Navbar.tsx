"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/hotels", label: "Hotels" },
  { href: "/apartments", label: "Apartments" },
  { href: "/destinations", label: "Destinations" },
  { href: "/bookings", label: "My bookings" },
];

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const isActive = (href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition duration-200 ${
        isScrolled || isMenuOpen
          ? "border-border bg-background/95 shadow-[0_10px_30px_rgb(17_24_39_/_8%)] backdrop-blur-xl"
          : "border-transparent bg-background/85 backdrop-blur-md"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-[82rem] items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <TopRatedHotelsLogo />

        <ul className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative text-sm font-semibold transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-accent after:transition-transform ${
                  isActive(link.href)
                    ? "text-primary after:scale-x-100"
                    : "text-secondary after:scale-x-0 hover:text-primary hover:after:scale-x-100"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 xl:flex">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-primary transition hover:text-accent"
          >
            Sign in
          </Link>

          <Link
            href="/hotels"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            Find a stay
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm xl:hidden"
        >
          <span className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`grid overflow-hidden border-t bg-background transition-[grid-template-rows] duration-200 xl:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] border-border"
            : "grid-rows-[0fr] border-transparent"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto w-full max-w-[72rem] px-4 py-5 sm:px-6 lg:px-8">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-md px-3 py-3 text-base font-semibold transition ${
                      isActive(link.href)
                        ? "bg-surface text-primary"
                        : "text-secondary hover:bg-surface hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link
                href="/auth/login"
                className="rounded-full border border-primary px-4 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href="/hotels"
                className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-dark"
              >
                Find a stay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}