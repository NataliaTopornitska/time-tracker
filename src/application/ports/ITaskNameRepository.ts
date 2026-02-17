import type { TaskName, CreateTaskNameInput, UpdateTaskNameInput } from "@/domain/entities";

export interface ITaskNameRepository {
  findById(id: string): Promise<TaskName | null>;
  findByProjectId(projectId: string): Promise<TaskName[]>;
  findAll(): Promise<TaskName[]>;
  create(input: CreateTaskNameInput): Promise<TaskName>;
  update(id: string, input: UpdateTaskNameInput): Promise<TaskName | null>;
  delete(id: string): Promise<boolean>;
}
