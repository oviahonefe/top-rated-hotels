import AdminRouteGuard from "@/components/layout/AdminRouteGuard";
import HotelForm from "@/components/hotels/HotelForm";

export default function CreateHotelPage() {
  return (
    <AdminRouteGuard>
      <main className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-[82rem] px-4 py-7 sm:px-6 lg:px-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-600">
              Property management
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
              Create hotel
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add the property details, room types, pricing, and bookable inventory.
            </p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[82rem] px-4 py-8 sm:px-6 lg:px-8">
          <HotelForm />
        </div>
      </main>
    </AdminRouteGuard>
  );
}