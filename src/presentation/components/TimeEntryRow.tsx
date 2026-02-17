import type { Project, TaskName, TimeEntry } from "@/domain/entities";
import { TimeEntryDurationInput } from "./TimeEntryDurationInput";

export interface TimeEntryRowProps {
  entry: TimeEntry;
  projects: Project[];
  taskNames: TaskName[];
  durationString: string;
  onProjectChange: (entryId: string, projectId: string) => void;
  onTaskChange: (entryId: string, taskNameId: string) => void;
  onDurationChange: (entryId: string, durationHhMm: string) => void;
  onDelete: (entryId: string) => void;
  onStop?: (entry: TimeEntry) => void;
}

export function TimeEntryRow({
  entry,
  projects,
  taskNames,
  durationString,
  onProjectChange,
  onTaskChange,
  onDurationChange,
  onDelete,
  onStop,
}: TimeEntryRowProps) {
  const tasksForProject = taskNames.filter((t) => t.projectId === entry.projectId);
  const currentTaskInList = tasksForProject.some((t) => t.id === entry.taskNameId);
  const isRunning = !entry.endedAt;

  return (
    <li className="flex flex-wrap items-center gap-2 border-b border-gray-100 py-2 last:border-0">
      <select
        value={entry.projectId}
        onChange={(e) => onProjectChange(entry.id, e.target.value)}
        aria-label="Project"
        className="min-w-[120px] rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <select
        value={entry.taskNameId}
        onChange={(e) => onTaskChange(entry.id, e.target.value)}
        aria-label="Task"
        className="min-w-[120px] rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        {!currentTaskInList && (
          <option value={entry.taskNameId}>—</option>
        )}
        {tasksForProject.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <TimeEntryDurationInput
        value={durationString}
        onChange={(v) => onDurationChange(entry.id, v)}
        aria-label="Duration"
      />
      <div className="ml-auto flex gap-1">
        {isRunning && onStop && (
          <button
            type="button"
            onClick={() => onStop(entry)}
            className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            Stop
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          aria-label="Delete entry"
          className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
