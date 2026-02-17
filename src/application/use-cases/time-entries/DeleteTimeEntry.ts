import type { ITimeEntryRepository } from "@/application/ports";

export class DeleteTimeEntryUseCase {
  constructor(private readonly timeEntryRepository: ITimeEntryRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.timeEntryRepository.delete(id);
  }
}
