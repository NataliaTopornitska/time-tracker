/**
 * Domain entity: TimeEntry
 * Represents a single time tracking record - pure domain model.
 */
export interface TimeEntry {
  id: string;
  projectId: string;
  taskNameId: string;
  startedAt: Date;
  endedAt?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTimeEntryInput = Omit<
  TimeEntry,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

/** All fields that can be updated (including project and task). */
export type UpdateTimeEntryInput = Partial<
  Omit<TimeEntry, "id" | "createdAt">
>;
