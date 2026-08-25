"use client";

import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/providers/AuthProvider";

export default function AdminHeader({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  const router = useRouter();
  const { user, signOut } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuOpen}
          className="h-10 border border-slate-300 px-3 text-sm font-bold text-slate-800 lg:hidden"
        >
          Menu
        </button>

        <div className="hidden lg:block">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#f47c20]">
            Operations console
          </p>
          <p className="mt-1 text-sm font-bold text-[#18295d]">
            Top Rated Apartment Hotels
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {user?.role === "super_admin" ? "Super administrator" : "Administrator"}
            </p>
          </div>

          <span className="grid h-10 w-10 place-items-center bg-[#18295d] text-sm font-extrabold text-white">
            {user?.firstName?.slice(0, 1).toUpperCase() ?? "A"}
          </span>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              router.replace("/login");
            }}
            className="hidden h-10 border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50 sm:block"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}