"use client";

import ApartmentForm from "@/components/apartments/ApartmentForm";
import AdminRouteGuard from "@/components/layout/AdminRouteGuard";

export default function CreateApartmentPage() {
  return (
    <AdminRouteGuard>
      <main className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-[82rem] px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
              Property management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Create apartment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Add the apartment&apos;s booking, pricing, and availability
              details. Images can be uploaded from its edit screen after
              creation.
            </p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[82rem] px-4 py-8 sm:px-6 lg:px-8">
          <ApartmentForm />
        </div>
      </main>
    </AdminRouteGuard>
  );
}