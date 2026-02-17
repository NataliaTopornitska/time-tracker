import type { Project, CreateProjectInput, UpdateProjectInput } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";
import { prisma } from "@/lib/prisma";

function toDomain(row: {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    id: row.id,
    name: row.name,
    ...(row.description != null && { description: row.description }),
    ...(row.color != null && { color: row.color }),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PrismaProjectRepository implements IProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const row = await prisma.project.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<Project[]> {
    const rows = await prisma.project.findMany({
      orderBy: { name: "asc" },
    });
    return rows.map(toDomain);
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const row = await prisma.project.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        color: input.color ?? null,
      },
    });
    return toDomain(row);
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const row = await prisma.project.update({
      where: { id },
      data: {
        ...(input.name != null && { name: input.name }),
        ...(input.description != null && { description: input.description }),
        ...(input.color != null && { color: input.color }),
        ...(input.updatedAt != null && { updatedAt: input.updatedAt }),
      },
    }).catch(() => null);
    return row ? toDomain(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.project.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
