/**
 * Domain entity: TaskName
 * Represents a named task (e.g. "Code review", "Meeting") - pure domain model.
 */
export interface TaskName {
  id: string;
  name: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskNameInput = Omit<TaskName, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type UpdateTaskNameInput = Partial<Omit<TaskName, "id" | "projectId" | "createdAt">>;
