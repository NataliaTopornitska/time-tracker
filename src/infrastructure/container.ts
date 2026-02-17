/**
 * Shared container for repository instances.
 * Uses Prisma (SQLite) for persistence.
 */
import {
  PrismaProjectRepository,
  PrismaTaskNameRepository,
  PrismaTimeEntryRepository,
} from "@/infrastructure/repositories";

export const projectRepository = new PrismaProjectRepository();
export const taskNameRepository = new PrismaTaskNameRepository();
export const timeEntryRepository = new PrismaTimeEntryRepository();
