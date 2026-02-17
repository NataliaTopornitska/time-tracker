import { NextRequest, NextResponse } from "next/server";
import {
  projectRepository,
  timeEntryRepository,
} from "@/infrastructure/container";
import { GenerateReportByPeriodUseCase } from "@/application/use-cases";
import type { ReportPeriod } from "@/application/use-cases";

const generateReport = new GenerateReportByPeriodUseCase(
  timeEntryRepository,
  projectRepository
);

const PERIODS: ReportPeriod[] = ["day", "week", "month"];

/**
 * GET /api/reports?period=day|week|month&date=YYYY-MM-DD
 * Returns report data (aggregated by project) for the given period.
 * date is optional; defaults to today.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const periodParam = searchParams.get("period");
  const dateParam = searchParams.get("date");

  const period = PERIODS.includes(periodParam as ReportPeriod)
    ? (periodParam as ReportPeriod)
    : "day";

  let refDate: Date | undefined;
  if (dateParam) {
    const d = new Date(dateParam);
    if (!Number.isNaN(d.getTime())) refDate = d;
  }

  const report = await generateReport.execute(period, refDate);
  return NextResponse.json(report);
}
