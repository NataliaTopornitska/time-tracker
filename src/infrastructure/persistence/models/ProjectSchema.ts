/**
 * Persistence model for Project.
 * Maps to DB table/ORM schema - separate from domain entity.
 */
export interface ProjectSchema {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: Date;
  updated_at: Date;
}

export function toDomainProject(row: ProjectSchema): {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: row.id,
    name: row.name,
    ...(row.description != null && { description: row.description }),
    ...(row.color != null && { color: row.color }),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProjectSchema(domain: {
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}): Omit<ProjectSchema, "id"> {
  return {
    name: domain.name,
    description: domain.description ?? null,
    color: domain.color ?? null,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
  };
}
