/**
 * Persistence model for TaskName.
 * Maps to DB table/ORM schema - separate from domain entity.
 */
export interface TaskNameSchema {
  id: string;
  name: string;
  project_id: string;
  created_at: Date;
  updated_at: Date;
}

export function toDomainTaskName(row: TaskNameSchema): {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: row.id,
    name: row.name,
    projectId: row.project_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toTaskNameSchema(domain: {
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}): Omit<TaskNameSchema, "id"> {
  return {
    name: domain.name,
    project_id: domain.projectId,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
  };
}
