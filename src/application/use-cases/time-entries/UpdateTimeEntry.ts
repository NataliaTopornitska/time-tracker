import type { TimeEntry, UpdateTimeEntryInput } from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";

export class UpdateTimeEntryUseCase {
  constructor(private readonly timeEntryRepository: ITimeEntryRepository) {}

  async execute(id: string, input: UpdateTimeEntryInput): Promise<TimeEntry | null> {
    return this.timeEntryRepository.update(id, {
      ...input,
      updatedAt: new Date(),
    });
  }
}
