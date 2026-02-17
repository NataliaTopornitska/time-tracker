import type { TimeEntry } from "@/domain/entities";

export interface TimeEntryListProps {
  entries: TimeEntry[];
  onStop?: (entry: TimeEntry) => void;
  formatDuration?: (start: Date, end?: Date) => string;
}

function defaultFormatDuration(start: Date, end?: Date): string {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const mins = Math.floor((e - s) / 60_000);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function TimeEntryList({
  entries,
  onStop,
  formatDuration = defaultFormatDuration,
}: TimeEntryListProps) {
  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {entries.length === 0 ? (
        <li className="px-4 py-8 text-center text-sm text-gray-500">
          No time entries yet.
        </li>
      ) : (
        entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="text-sm text-gray-500">
                {formatDuration(entry.startedAt, entry.endedAt)}
              </span>
              {entry.description && (
                <p className="text-sm text-gray-700">{entry.description}</p>
              )}
            </div>
            {!entry.endedAt && onStop && (
              <button
                type="button"
                onClick={() => onStop(entry)}
                className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                Stop
              </button>
            )}
          </li>
        ))
      )}
    </ul>
  );
}
