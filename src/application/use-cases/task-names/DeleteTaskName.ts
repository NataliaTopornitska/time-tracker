import type { ITaskNameRepository } from "@/application/ports";

export class DeleteTaskNameUseCase {
  constructor(private readonly taskNameRepository: ITaskNameRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.taskNameRepository.delete(id);
  }
}
