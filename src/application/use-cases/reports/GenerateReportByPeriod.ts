import type { TimeEntry } from "@/domain/entities";
import type { ITimeEntryRepository } from "@/application/ports";
import type { IProjectRepository } from "@/application/ports";
import type { ReportData, ReportPeriod } from "./types";

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

function startOfWeek(d: Date): Date {
  const out = new Date(d);
  const day = out.getDay();
  const diff = out.getDate() - day + (day === 0 ? -6 : 1);
  out.setDate(diff);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const out = new Date(start);
  out.setDate(out.getDate() + 6);
  out.setHours(23, 59, 59, 999);
  return out;
}

function startOfMonth(d: Date): Date {
  const out = new Date(d);
  out.setDate(1);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfMonth(d: Date): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + 1, 0);
  out.setHours(23, 59, 59, 999);
  return out;
}

function getRange(period: ReportPeriod, ref: Date): { start: Date; end: Date } {
  switch (period) {
    case "day":
      return { start: startOfDay(ref), end: endOfDay(ref) };
    case "week":
      return { start: startOfWeek(ref), end: endOfWeek(ref) };
    case "month":
      return { start: startOfMonth(ref), end: endOfMonth(ref) };
    default:
      return { start: startOfDay(ref), end: endOfDay(ref) };
  }
}

function minutesInRange(entry: TimeEntry, rangeStart: Date, rangeEnd: Date): number {
  const start = new Date(entry.startedAt).getTime();
  const end = entry.endedAt
    ? new Date(entry.endedAt).getTime()
    : Date.now();
  const rs = rangeStart.getTime();
  const re = rangeEnd.getTime();
  const overlapStart = Math.max(start, rs);
  const overlapEnd = Math.min(end, re);
  if (overlapStart >= overlapEnd) return 0;
  return Math.floor((overlapEnd - overlapStart) / 60_000);
}

export class GenerateReportByPeriodUseCase {
  constructor(
    private readonly timeEntryRepository: ITimeEntryRepository,
    private readonly projectRepository: IProjectRepository
  ) {}

  async execute(
    period: ReportPeriod,
    refDate?: Date
  ): Promise<ReportData> {
    const ref = refDate ? new Date(refDate) : new Date();
    const { start, end } = getRange(period, ref);

    const entries = await this.timeEntryRepository.findAll();
    const projects = await this.projectRepository.findAll();
    const projectNames = new Map(projects.map((p) => [p.id, p.name]));

    const byProject = new Map<
      string,
      { totalMinutes: number; entryCount: number }
    >();

    for (const entry of entries) {
      const mins = minutesInRange(entry, start, end);
      if (mins <= 0) continue;
      const cur = byProject.get(entry.projectId) ?? {
        totalMinutes: 0,
        entryCount: 0,
      };
      cur.totalMinutes += mins;
      cur.entryCount += 1;
      byProject.set(entry.projectId, cur);
    }

    const byProjectList = Array.from(byProject.entries()).map(
      ([projectId, data]) => ({
        projectId,
        projectName: projectNames.get(projectId) ?? projectId,
        totalMinutes: data.totalMinutes,
        entryCount: data.entryCount,
      })
    );
    byProjectList.sort((a, b) => a.projectName.localeCompare(b.projectName));

    const totalMinutes = byProjectList.reduce((s, r) => s + r.totalMinutes, 0);

    return {
      period,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      byProject: byProjectList,
      totalMinutes,
    };
  }
}
