type HotelSearchProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function HotelSearch({
  query,
  onQueryChange,
}: HotelSearchProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="border border-border bg-background p-4 shadow-sm sm:p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
            Search destinations or stays
          </span>

          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Try Malaga, Paris, villa, or apartment hotel"
            className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <button
          type="submit"
          className="h-12 rounded-full bg-accent px-7 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          Search stays
        </button>
      </div>
    </form>
  );
}