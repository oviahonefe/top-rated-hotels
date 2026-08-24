import Link from "next/link";
import SiteContainer from "../ui/SiteContainer";

const footerLinks = [
  { href: "/hotels", label: "Hotels" },
  { href: "/apartments", label: "Apartments" },
  { href: "/bookings", label: "Bookings" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-white">
      <SiteContainer>
      <div className="section-shell grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="font-heading text-xl font-extrabold">
            Top Rated Apartment Hotels
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            A Europe-focused booking platform for verified apartment hotels,
            serviced lodges, and premium city stays.
          </p>
        </div>

        <div className="md:text-right">
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-white/80 md:justify-end">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-accent-light">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/60">
            &copy; {new Date().getFullYear()} Top Rated Apartment Hotels.
          </p>
        </div>
      </div>
      </SiteContainer>
    </footer>
  );
}
