import type { TaskName } from "@/domain/entities";
import type { ITaskNameRepository } from "@/application/ports";

export interface GetTaskNameSuggestionsInput {
  projectId: string | null;
  query: string;
  limit?: number;
}

/**
 * Returns task names matching the query (by name), optionally scoped to a project.
 * Used for autocomplete; no business logic beyond filtering.
 */
export class GetTaskNameSuggestionsUseCase {
  constructor(private readonly taskNameRepository: ITaskNameRepository) {}

  async execute(input: GetTaskNameSuggestionsInput): Promise<TaskName[]> {
    const { projectId, query, limit = 20 } = input;
    const tasks = projectId
      ? await this.taskNameRepository.findByProjectId(projectId)
      : await this.taskNameRepository.findAll();
    const q = query.trim().toLowerCase();
    const filtered =
      q === ""
        ? tasks
        : tasks.filter((t) => t.name.toLowerCase().includes(q));
    return limit > 0 ? filtered.slice(0, limit) : filtered;
  }
}
