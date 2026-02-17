import type { TimeEntry, CreateTimeEntryInput, UpdateTimeEntryInput } from "@/domain/entities";

export interface ITimeEntryRepository {
  findById(id: string): Promise<TimeEntry | null>;
  findAll(): Promise<TimeEntry[]>;
  findByProjectId(projectId: string): Promise<TimeEntry[]>;
  findActive(): Promise<TimeEntry | null>;
  create(input: CreateTimeEntryInput): Promise<TimeEntry>;
  update(id: string, input: UpdateTimeEntryInput): Promise<TimeEntry | null>;
  delete(id: string): Promise<boolean>;
  /** Start a new time entry (creates with no endedAt). */
  startEntry(input: CreateTimeEntryInput): Promise<TimeEntry>;
  /** Stop an active entry by setting endedAt. */
  stopEntry(id: string): Promise<TimeEntry | null>;
}
