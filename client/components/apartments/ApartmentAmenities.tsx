type ApartmentAmenitiesProps = {
  amenities: string[];
};

export default function ApartmentAmenities({
  amenities,
}: ApartmentAmenitiesProps) {
  return (
    <section className="border-b border-border py-8">
      <h2 className="text-2xl font-extrabold text-primary">
        Apartment amenities
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {amenities.map((amenity) => (
          <div
            key={amenity}
            className="flex items-center gap-3 border border-border bg-surface px-4 py-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-extrabold text-white">
              ✓
            </span>

            <span className="text-sm font-semibold text-primary">
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}