export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  /** Optional preset hex colors to show as swatches. */
  presets?: string[];
  disabled?: boolean;
  "aria-label"?: string;
}

const DEFAULT_PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  disabled = false,
  "aria-label": ariaLabel = "Project color",
}: ColorPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="color"
        value={value || "#6b7280"}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="h-8 w-10 cursor-pointer rounded border border-gray-300 disabled:opacity-50"
      />
      <div className="flex flex-wrap gap-1" role="group" aria-label="Preset colors">
        {presets.map((hex) => (
          <button
            key={hex}
            type="button"
            onClick={() => onChange(hex)}
            disabled={disabled}
            className={`h-6 w-6 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 ${
              (value || "").toLowerCase() === hex.toLowerCase()
                ? "border-gray-900 ring-1 ring-gray-400"
                : "border-transparent hover:border-gray-300"
            }`}
            style={{ backgroundColor: hex }}
            aria-label={`Use color ${hex}`}
          />
        ))}
      </div>
    </div>
  );
}
