import type {
  TimeEntry,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
} from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";
import {
  toDomainTimeEntry,
  toTimeEntrySchema,
  type TimeEntrySchema,
} from "@/infrastructure/persistence/models/TimeEntrySchema";

function generateId(): string {
  return crypto.randomUUID();
}

export class InMemoryTimeEntryRepository implements ITimeEntryRepository {
  private store = new Map<string, TimeEntrySchema>();

  async findById(id: string): Promise<TimeEntry | null> {
    const row = this.store.get(id);
    return row ? toDomainTimeEntry(row) : null;
  }

  async findAll(): Promise<TimeEntry[]> {
    return Array.from(this.store.values()).map(toDomainTimeEntry);
  }

  async findByProjectId(projectId: string): Promise<TimeEntry[]> {
    return Array.from(this.store.values())
      .filter((r) => r.project_id === projectId)
      .map(toDomainTimeEntry);
  }

  async findActive(): Promise<TimeEntry | null> {
    const active = Array.from(this.store.values()).find(
      (r) => r.ended_at == null
    );
    return active ? toDomainTimeEntry(active) : null;
  }

  async startEntry(input: CreateTimeEntryInput): Promise<TimeEntry> {
    return this.create({
      ...input,
      startedAt: input.startedAt ?? new Date(),
    });
  }

  async stopEntry(id: string): Promise<TimeEntry | null> {
    const entry = await this.findById(id);
    if (!entry || entry.endedAt) return null;
    return this.update(id, { endedAt: new Date() });
  }

  async create(input: CreateTimeEntryInput): Promise<TimeEntry> {
    const now = new Date();
    const id = input.id ?? generateId();
    const row: TimeEntrySchema = {
      id,
      ...toTimeEntrySchema({
        projectId: input.projectId,
        taskNameId: input.taskNameId,
        startedAt: input.startedAt ?? now,
        endedAt: input.endedAt,
        description: input.description,
        createdAt: now,
        updatedAt: now,
      }),
    };
    this.store.set(id, row);
    return toDomainTimeEntry(row);
  }

  async update(
    id: string,
    input: UpdateTimeEntryInput
  ): Promise<TimeEntry | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: TimeEntrySchema = {
      ...existing,
      ...(input.projectId != null && { project_id: input.projectId }),
      ...(input.taskNameId != null && { task_name_id: input.taskNameId }),
      ...(input.startedAt != null && { started_at: input.startedAt }),
      ...(input.endedAt != null && { ended_at: input.endedAt }),
      ...(input.description != null && { description: input.description }),
      ...(input.updatedAt != null && { updated_at: input.updatedAt }),
      updated_at: input.updatedAt ?? new Date(),
    };
    this.store.set(id, updated);
    return toDomainTimeEntry(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
