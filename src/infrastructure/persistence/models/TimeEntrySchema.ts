/**
 * Persistence model for TimeEntry.
 * Maps to DB table/ORM schema - separate from domain entity.
 */
export interface TimeEntrySchema {
  id: string;
  project_id: string;
  task_name_id: string;
  started_at: Date;
  ended_at: Date | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export function toDomainTimeEntry(row: TimeEntrySchema): {
  id: string;
  projectId: string;
  taskNameId: string;
  startedAt: Date;
  endedAt?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
} {
  return {
    id: row.id,
    projectId: row.project_id,
    taskNameId: row.task_name_id,
    startedAt: row.started_at,
    ...(row.ended_at != null && { endedAt: row.ended_at }),
    ...(row.description != null && { description: row.description }),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toTimeEntrySchema(domain: {
  projectId: string;
  taskNameId: string;
  startedAt: Date;
  endedAt?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}): Omit<TimeEntrySchema, "id"> {
  return {
    project_id: domain.projectId,
    task_name_id: domain.taskNameId,
    started_at: domain.startedAt,
    ended_at: domain.endedAt ?? null,
    description: domain.description ?? null,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
  };
}
