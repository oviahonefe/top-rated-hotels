export type HotelFilterValues = {
  city: string;
  tier: string;
  guests: string;
  budget: string;
};

type HotelFiltersProps = {
  filters: HotelFilterValues;
  resultCount: number;
  onChange: (
    name: keyof HotelFilterValues,
    value: string,
  ) => void;
  onClear: () => void;
};

export default function HotelFilters({
  filters,
  resultCount,
  onChange,
  onClear,
}: HotelFiltersProps) {
  return (
    <aside className="h-fit border border-border bg-background p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-primary">
            Filter stays
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {resultCount} stays available
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-sm font-bold text-accent transition hover:text-accent-dark"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 grid gap-5">
        <FilterSelect
          label="Destination"
          value={filters.city}
          onChange={(value) => onChange("city", value)}
          options={[
            ["", "All destinations"],
            ["Malaga", "Malaga, Spain"],
            ["Barcelona", "Barcelona, Spain"],
            ["Lisbon", "Lisbon, Portugal"],
            ["Paris", "Paris, France"],
            ["Rome", "Rome, Italy"],
            ["Amsterdam", "Amsterdam, Netherlands"],
            ["Vienna", "Vienna, Austria"],
          ]}
        />

        <FilterSelect
          label="Property tier"
          value={filters.tier}
          onChange={(value) => onChange("tier", value)}
          options={[
            ["", "All tiers"],
            ["standard", "Standard"],
            ["premium", "Premium"],
            ["luxury", "Luxury"],
            ["signature", "Signature"],
          ]}
        />

        <FilterSelect
          label="Guests"
          value={filters.guests}
          onChange={(value) => onChange("guests", value)}
          options={[
            ["", "Any guest capacity"],
            ["1", "1+ guest"],
            ["2", "2+ guests"],
            ["4", "4+ guests"],
            ["6", "6+ guests"],
          ]}
        />

        <FilterSelect
          label="Nightly rate"
          value={filters.budget}
          onChange={(value) => onChange("budget", value)}
          options={[
            ["", "Any nightly rate"],
            ["under-3000", "Under $3,000"],
            ["3000-5000", "$3,000 to $5,000"],
            ["over-5000", "Over $5,000"],
          ]}
        />
      </div>
    </aside>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-primary">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full border border-border bg-surface px-3 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}