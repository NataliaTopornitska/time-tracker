import type { Project } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";

export class GetProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }
}
