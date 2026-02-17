import type { TaskName } from "@/domain/entities";
import type { ITaskNameRepository } from "@/application/ports";

/**
 * Returns all task names for a project. Used for dropdown/select task.
 */
export class GetTaskNamesForProjectUseCase {
  constructor(private readonly taskNameRepository: ITaskNameRepository) {}

  async execute(projectId: string): Promise<TaskName[]> {
    return this.taskNameRepository.findByProjectId(projectId);
  }
}
