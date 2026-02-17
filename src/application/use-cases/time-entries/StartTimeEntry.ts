import type { TimeEntry, CreateTimeEntryInput } from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";

export class StartTimeEntryUseCase {
  constructor(private readonly timeEntryRepository: ITimeEntryRepository) {}

  async execute(input: CreateTimeEntryInput): Promise<TimeEntry> {
    return this.timeEntryRepository.startEntry({
      ...input,
      startedAt: input.startedAt ?? new Date(),
    });
  }
}
