export interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export function TimerControls({
  isRunning,
  onStart,
  onStop,
  disabled = false,
}: TimerControlsProps) {
  return (
    <div className="flex gap-2">
      {!isRunning ? (
        <button
          type="button"
          onClick={onStart}
          disabled={disabled}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Start timer
        </button>
      ) : (
        <button
          type="button"
          onClick={onStop}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Stop timer
        </button>
      )}
    </div>
  );
}
