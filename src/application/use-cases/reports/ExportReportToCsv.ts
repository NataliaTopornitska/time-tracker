import type { ReportData } from "./types";

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export class ExportReportToCsvUseCase {
  execute(report: ReportData): string {
    const rows: string[][] = [
      ["Period", report.period],
      ["Start date", report.startDate],
      ["End date", report.endDate],
      ["Total minutes", String(report.totalMinutes)],
      [],
      ["Project", "Total (minutes)", "Entries"],
    ];
    for (const row of report.byProject) {
      rows.push([
        row.projectName,
        String(row.totalMinutes),
        String(row.entryCount),
      ]);
    }
    return rows.map((r) => r.map(escapeCsvCell).join(",")).join("\r\n");
  }
}
