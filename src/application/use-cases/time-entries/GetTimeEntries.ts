import type { TimeEntry } from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";

export class GetTimeEntriesUseCase {
  constructor(private readonly timeEntryRepository: ITimeEntryRepository) {}

  async execute(projectId?: string): Promise<TimeEntry[]> {
    if (projectId) {
      return this.timeEntryRepository.findByProjectId(projectId);
    }
    return this.timeEntryRepository.findAll();
  }
}
