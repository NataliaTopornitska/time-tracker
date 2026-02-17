import type { TimeEntry } from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";

export class StopTimeEntryUseCase {
  constructor(private readonly timeEntryRepository: ITimeEntryRepository) {}

  async execute(id: string): Promise<TimeEntry | null> {
    return this.timeEntryRepository.stopEntry(id);
  }
}
