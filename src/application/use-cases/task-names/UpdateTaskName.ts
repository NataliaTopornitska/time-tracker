import type { TaskName, UpdateTaskNameInput } from "@/domain/entities";
import type { ITaskNameRepository } from "@/application/ports";

export class UpdateTaskNameUseCase {
  constructor(private readonly taskNameRepository: ITaskNameRepository) {}

  async execute(id: string, input: UpdateTaskNameInput): Promise<TaskName | null> {
    return this.taskNameRepository.update(id, {
      ...input,
      updatedAt: new Date(),
    });
  }
}
