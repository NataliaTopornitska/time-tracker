import type { Project, UpdateProjectInput } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string, input: UpdateProjectInput): Promise<Project | null> {
    return this.projectRepository.update(id, {
      ...input,
      updatedAt: new Date(),
    });
  }
}
