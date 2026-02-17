export interface TimerDisplayProps {
  /** Elapsed seconds (when running) or total duration (when stopped). */
  elapsedSeconds: number;
  /** Optional label when timer is running, e.g. "Project · Task" */
  label?: string;
  isRunning?: boolean;
  /** Optional formatter; default shows HH:MM:SS */
  formatElapsed?: (seconds: number) => string;
}

function defaultFormat(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function TimerDisplay({
  elapsedSeconds,
  label,
  isRunning = false,
  formatElapsed = defaultFormat,
}: TimerDisplayProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <div
        className="font-mono text-2xl font-semibold tabular-nums text-gray-900"
        aria-live="polite"
      >
        {formatElapsed(elapsedSeconds)}
      </div>
      {label && (
        <p className="mt-1 text-sm text-gray-500" aria-hidden>
          {label}
        </p>
      )}
      {isRunning && (
        <span className="sr-only">Timer running</span>
      )}
    </div>
  );
}
