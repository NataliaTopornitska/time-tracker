import type {
  TaskName,
  CreateTaskNameInput,
  UpdateTaskNameInput,
} from "@/domain/entities";
import type { ITaskNameRepository } from "@/application/ports";
import { prisma } from "@/lib/prisma";

function toDomain(row: {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}): TaskName {
  return {
    id: row.id,
    name: row.name,
    projectId: row.projectId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaTaskNameRepository implements ITaskNameRepository {
  async findById(id: string): Promise<TaskName | null> {
    const row = await prisma.taskName.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findByProjectId(projectId: string): Promise<TaskName[]> {
    const rows = await prisma.taskName.findMany({
      where: { projectId },
      orderBy: { name: "asc" },
    });
    return rows.map(toDomain);
  }

  async findAll(): Promise<TaskName[]> {
    const rows = await prisma.taskName.findMany({
      orderBy: [{ projectId: "asc" }, { name: "asc" }],
    });
    return rows.map(toDomain);
  }

  async create(input: CreateTaskNameInput): Promise<TaskName> {
    const row = await prisma.taskName.create({
      data: {
        name: input.name,
        projectId: input.projectId,
      },
    });
    return toDomain(row);
  }

  async update(id: string, input: UpdateTaskNameInput): Promise<TaskName | null> {
    const row = await prisma.taskName
      .update({
        where: { id },
        data: {
          ...(input.name != null && { name: input.name }),
          ...(input.updatedAt != null && { updatedAt: input.updatedAt }),
        },
      })
      .catch(() => null);
    return row ? toDomain(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.taskName.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
