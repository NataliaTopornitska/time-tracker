import { NextRequest, NextResponse } from "next/server";
import {
  projectRepository,
  timeEntryRepository,
} from "@/infrastructure/container";
import {
  GenerateReportByPeriodUseCase,
  ExportReportToCsvUseCase,
} from "@/application/use-cases";
import type { ReportPeriod } from "@/application/use-cases";

const generateReport = new GenerateReportByPeriodUseCase(
  timeEntryRepository,
  projectRepository
);
const exportToCsv = new ExportReportToCsvUseCase();

const PERIODS: ReportPeriod[] = ["day", "week", "month"];

/**
 * GET /api/reports/export?period=day|week|month&date=YYYY-MM-DD
 * Returns CSV file download for the report in the given period.
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
  const csv = exportToCsv.execute(report);

  const filename = `report-${period}-${report.startDate.slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
