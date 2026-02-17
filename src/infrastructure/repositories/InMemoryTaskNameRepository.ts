import type {
  TaskName,
  CreateTaskNameInput,
  UpdateTaskNameInput,
} from "@/domain/entities";
import type { ITaskNameRepository } from "@/application/ports";
import {
  toDomainTaskName,
  toTaskNameSchema,
  type TaskNameSchema,
} from "@/infrastructure/persistence/models/TaskNameSchema";

function generateId(): string {
  return crypto.randomUUID();
}

export class InMemoryTaskNameRepository implements ITaskNameRepository {
  private store = new Map<string, TaskNameSchema>();

  async findById(id: string): Promise<TaskName | null> {
    const row = this.store.get(id);
    return row ? toDomainTaskName(row) : null;
  }

  async findByProjectId(projectId: string): Promise<TaskName[]> {
    return Array.from(this.store.values())
      .filter((r) => r.project_id === projectId)
      .map(toDomainTaskName);
  }

  async findAll(): Promise<TaskName[]> {
    return Array.from(this.store.values()).map(toDomainTaskName);
  }

  async create(input: CreateTaskNameInput): Promise<TaskName> {
    const now = new Date();
    const id = input.id ?? generateId();
    const row: TaskNameSchema = {
      id,
      ...toTaskNameSchema({ ...input, createdAt: now, updatedAt: now }),
    };
    this.store.set(id, row);
    return toDomainTaskName(row);
  }

  async update(id: string, input: UpdateTaskNameInput): Promise<TaskName | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: TaskNameSchema = {
      ...existing,
      ...(input.name != null && { name: input.name }),
      ...(input.updatedAt != null && { updated_at: input.updatedAt }),
      updated_at: input.updatedAt ?? new Date(),
    };
    this.store.set(id, updated);
    return toDomainTaskName(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
