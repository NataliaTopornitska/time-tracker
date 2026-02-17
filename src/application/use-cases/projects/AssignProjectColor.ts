import type { Project } from "@/domain/entities";
import type { IProjectRepository } from "@/application/ports";

/**
 * Assign (or update) color for a project. Delegates to repository update.
 */
export class AssignProjectColorUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string, color: string): Promise<Project | null> {
    return this.projectRepository.update(id, {
      color,
      updatedAt: new Date(),
    });
  }
}
