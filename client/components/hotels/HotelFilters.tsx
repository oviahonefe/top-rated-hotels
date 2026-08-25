export type HotelFilterValues = {
  city: string;
  type: string;
  rating: string;
  budget: string;
};

type HotelFiltersProps = {
  filters: HotelFilterValues;
  resultCount: number;
  onChange: (name: keyof HotelFilterValues, value: string) => void;
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
          <h2 className="text-lg font-extrabold text-primary">Filter stays</h2>
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
          label="Stay type"
          value={filters.type}
          onChange={(value) => onChange("type", value)}
          options={[
            ["", "All stay types"],
            ["Apartment hotel", "Apartment hotel"],
            ["Villa", "Villa"],
            ["Serviced lodge", "Serviced lodge"],
          ]}
        />

        <FilterSelect
          label="Guest rating"
          value={filters.rating}
          onChange={(value) => onChange("rating", value)}
          options={[
            ["", "Any rating"],
            ["4.7", "4.7 and above"],
            ["4.8", "4.8 and above"],
            ["4.9", "4.9 and above"],
          ]}
        />

        <FilterSelect
          label="Stay budget"
          value={filters.budget}
          onChange={(value) => onChange("budget", value)}
          options={[
            ["", "Any budget"],
            ["under-30000", "Under $30,000"],
            ["30000-35000", "$30,000 to $35,000"],
            ["over-35000", "Over $35,000"],
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
      <span className="text-sm font-bold text-primary">{label}</span>

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