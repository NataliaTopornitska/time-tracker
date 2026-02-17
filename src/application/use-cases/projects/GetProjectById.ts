import type { Project } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";

export class GetProjectByIdUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return this.projectRepository.findById(id);
  }
}
