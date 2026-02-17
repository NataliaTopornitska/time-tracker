export type ReportPeriod = "day" | "week" | "month";

export interface ReportProjectRow {
  projectId: string;
  projectName: string;
  totalMinutes: number;
  entryCount: number;
}

export interface ReportData {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  byProject: ReportProjectRow[];
  totalMinutes: number;
}
