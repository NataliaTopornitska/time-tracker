import type { TimeEntry } from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";
import type { IProjectRepository } from "@/application/ports";

export interface TimeEntriesGroupByProject {
  projectId: string;
  projectName: string;
  entries: TimeEntry[];
  totalMinutes: number;
}

export class GroupTimeEntriesByProjectUseCase {
  constructor(
    private readonly timeEntryRepository: ITimeEntryRepository,
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(): Promise<TimeEntriesGroupByProject[]> {
    const entries = await this.timeEntryRepository.findAll();
    const projects = await this.projectRepository.findAll();
    const projectNames = new Map(projects.map((p) => [p.id, p.name]));

    const byProject = new Map<string, TimeEntry[]>();
    for (const entry of entries) {
      const list = byProject.get(entry.projectId) ?? [];
      list.push(entry);
      byProject.set(entry.projectId, list);
    }

    function durationMinutes(entry: TimeEntry): number {
      const start = new Date(entry.startedAt).getTime();
      const end = entry.endedAt
        ? new Date(entry.endedAt).getTime()
        : Date.now();
      return Math.floor((end - start) / 60_000);
    }

    const result: TimeEntriesGroupByProject[] = [];
    for (const [projectId, projectEntries] of byProject) {
      const totalMinutes = projectEntries.reduce(
        (sum, e) => sum + durationMinutes(e),
        0
      );
      result.push({
        projectId,
        projectName: projectNames.get(projectId) ?? projectId,
        entries: projectEntries,
        totalMinutes,
      });
    }

    result.sort((a, b) => a.projectName.localeCompare(b.projectName));
    return result;
  }
}
