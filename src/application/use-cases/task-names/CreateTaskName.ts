import type { TaskName, CreateTaskNameInput } from "@/domain/entities";
import type { ITaskNameRepository } from "@/application/ports";

export class CreateTaskNameUseCase {
  constructor(private readonly taskNameRepository: ITaskNameRepository) {}

  async execute(input: CreateTaskNameInput): Promise<TaskName> {
    return this.taskNameRepository.create(input);
  }
}
