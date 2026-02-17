export interface TimeEntryDurationInputProps {
  /** Value in "h:mm" or "hh:mm" format (e.g. "1:30" = 1h 30m). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

/**
 * Presentational input for duration in hh:mm format.
 * Does not parse or validate; parent is responsible for formatting/parsing.
 */
export function TimeEntryDurationInput({
  value,
  onChange,
  placeholder = "0:00",
  disabled = false,
  "aria-label": ariaLabel = "Duration (hours:minutes)",
}: TimeEntryDurationInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm tabular-nums focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
    />
  );
}
