import type { IProjectRepository } from "@/application/ports";

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.projectRepository.delete(id);
  }
}
