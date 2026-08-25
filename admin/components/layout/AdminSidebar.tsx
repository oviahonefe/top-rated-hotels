"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TopRatedHotelsLogo from "@/components/brand/TopRatedHotelsLogo";

type AdminSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/hotels", label: "Hotels" },
  { href: "/apartments", label: "Apartments" },
  { href: "/bookings", label: "Bookings" },
  { href: "/inventory", label: "Availability" },
  { href: "/settings", label: "Payment methods" },
];

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <TopRatedHotelsLogo />
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Platform management
          </p>

          <div className="mt-3 grid gap-1">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`border-l-2 px-3 py-3 text-sm font-bold transition ${
                    active
                      ? "border-[#f47c20] bg-orange-50 text-[#18295d]"
                      : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#18295d]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-5">
          <p className="text-xs font-bold text-slate-700">
            Top Rated Apartment Hotels
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Europe stays operations console
          </p>
        </div>
      </aside>
    </>
  );
}