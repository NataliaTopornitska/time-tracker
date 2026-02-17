import type { Project, TaskName, TimeEntry } from "@/domain/entities";
import { TimeEntryRow } from "./TimeEntryRow";

export interface TimeEntriesGroup {
  projectId: string;
  projectName: string;
  entries: TimeEntry[];
  totalMinutes: number;
}

export interface TimeEntriesGroupedListProps {
  groups: TimeEntriesGroup[];
  projects: Project[];
  taskNames: TaskName[];
  getDurationString: (entry: TimeEntry) => string;
  onProjectChange: (entryId: string, projectId: string) => void;
  onTaskChange: (entryId: string, taskNameId: string) => void;
  onDurationChange: (entryId: string, durationHhMm: string) => void;
  onDelete: (entryId: string) => void;
  onStop?: (entry: TimeEntry) => void;
  formatTotal?: (minutes: number) => string;
}

function defaultFormatTotal(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function TimeEntriesGroupedList({
  groups,
  projects,
  taskNames,
  getDurationString,
  onProjectChange,
  onTaskChange,
  onDurationChange,
  onDelete,
  onStop,
  formatTotal = defaultFormatTotal,
}: TimeEntriesGroupedListProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
        No time entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section
          key={group.projectId}
          className="rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
            <h3 className="font-medium text-gray-900">{group.projectName}</h3>
            <span className="text-sm font-medium tabular-nums text-gray-600">
              Total: {formatTotal(group.totalMinutes)}
            </span>
          </div>
          <ul className="divide-y divide-gray-100 px-4">
            {group.entries.map((entry) => (
              <TimeEntryRow
                key={entry.id}
                entry={entry}
                projects={projects}
                taskNames={taskNames}
                durationString={getDurationString(entry)}
                onProjectChange={onProjectChange}
                onTaskChange={onTaskChange}
                onDurationChange={onDurationChange}
                onDelete={onDelete}
                onStop={onStop}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
