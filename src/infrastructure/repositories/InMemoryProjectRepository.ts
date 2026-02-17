import type { Project, CreateProjectInput, UpdateProjectInput } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";
import {
  toDomainProject,
  toProjectSchema,
  type ProjectSchema,
} from "@/infrastructure/persistence/models/ProjectSchema";

function generateId(): string {
  return crypto.randomUUID();
}

export class InMemoryProjectRepository implements IProjectRepository {
  private store = new Map<string, ProjectSchema>();

  async findById(id: string): Promise<Project | null> {
    const row = this.store.get(id);
    return row ? toDomainProject(row) : null;
  }

  async findAll(): Promise<Project[]> {
    return Array.from(this.store.values()).map(toDomainProject);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const now = new Date();
    const id = input.id ?? generateId();
    const row: ProjectSchema = {
      id,
      ...toProjectSchema({ ...input, createdAt: now, updatedAt: now }),
    };
    this.store.set(id, row);
    return toDomainProject(row);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const existing = this.store.get(id);
    if (!existing) return null;
    const updated: ProjectSchema = {
      ...existing,
      ...(input.name != null && { name: input.name }),
      ...(input.description != null && { description: input.description }),
      ...(input.color != null && { color: input.color }),
      ...(input.updatedAt != null && { updated_at: input.updatedAt }),
      updated_at: input.updatedAt ?? new Date(),
    };
    this.store.set(id, updated);
    return toDomainProject(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
