import type { Project, CreateProjectInput } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    return this.projectRepository.create(input);
  }
}
