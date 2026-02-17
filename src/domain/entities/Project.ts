/**
 * Domain entity: Project
 * Pure domain model - no persistence concerns.
 */
export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type UpdateProjectInput = Partial<Omit<Project, "id" | "createdAt">>;
