import type {
  TimeEntry,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
} from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";
import { prisma } from "@/lib/prisma";

function toDomain(row: {
  id: string;
  projectId: string;
  taskNameId: string;
  startedAt: Date;
  endedAt: Date | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): TimeEntry {
  return {
    id: row.id,
    projectId: row.projectId,
    taskNameId: row.taskNameId,
    startedAt: row.startedAt,
    ...(row.endedAt != null && { endedAt: row.endedAt }),
    ...(row.description != null && { description: row.description }),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaTimeEntryRepository implements ITimeEntryRepository {
  async findById(id: string): Promise<TimeEntry | null> {
    const row = await prisma.timeEntry.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<TimeEntry[]> {
    const rows = await prisma.timeEntry.findMany({
      orderBy: { startedAt: "desc" },
    });
    return rows.map(toDomain);
  }

  async findByProjectId(projectId: string): Promise<TimeEntry[]> {
    const rows = await prisma.timeEntry.findMany({
      where: { projectId },
      orderBy: { startedAt: "desc" },
    });
    return rows.map(toDomain);
  }

  async findActive(): Promise<TimeEntry | null> {
    const row = await prisma.timeEntry.findFirst({
      where: { endedAt: null },
    });
    return row ? toDomain(row) : null;
  }

  async create(input: CreateTimeEntryInput): Promise<TimeEntry> {
    const row = await prisma.timeEntry.create({
      data: {
        projectId: input.projectId,
        taskNameId: input.taskNameId,
        startedAt: input.startedAt ?? new Date(),
        endedAt: input.endedAt ?? null,
        description: input.description ?? null,
      },
    });
    return toDomain(row);
  }

  async update(
    id: string,
    input: UpdateTimeEntryInput
  ): Promise<TimeEntry | null> {
    const row = await prisma.timeEntry
      .update({
        where: { id },
        data: {
          ...(input.projectId != null && { projectId: input.projectId }),
          ...(input.taskNameId != null && { taskNameId: input.taskNameId }),
          ...(input.startedAt != null && { startedAt: input.startedAt }),
          ...(input.endedAt != null && { endedAt: input.endedAt }),
          ...(input.description != null && { description: input.description }),
          ...(input.updatedAt != null && { updatedAt: input.updatedAt }),
        },
      })
      .catch(() => null);
    return row ? toDomain(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.timeEntry.deleteMany({ where: { id } });
    return result.count > 0;
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
}
