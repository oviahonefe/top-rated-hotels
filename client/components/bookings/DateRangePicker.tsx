type DateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

export default function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DateRangePickerProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-bold text-primary">Check-in date</span>

        <input
          type="date"
          required
          min={today}
          value={checkIn}
          onChange={(event) => onCheckInChange(event.target.value)}
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>

      <label className="block">
        <span className="text-sm font-bold text-primary">Check-out date</span>

        <input
          type="date"
          required
          min={checkIn || today}
          value={checkOut}
          onChange={(event) => onCheckOutChange(event.target.value)}
          className="mt-2 h-12 w-full border border-border bg-surface px-4 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </label>
    </div>
  );
}