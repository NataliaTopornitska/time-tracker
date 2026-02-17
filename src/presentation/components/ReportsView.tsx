import type { ReportData, ReportPeriod } from "@/application/use-cases";

export interface ReportsViewProps {
  report: ReportData | null;
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  onExportClick: () => void;
  isLoading?: boolean;
  formatMinutes?: (minutes: number) => string;
}

function defaultFormatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function ReportsView({
  report,
  period,
  onPeriodChange,
  onExportClick,
  isLoading = false,
  formatMinutes = defaultFormatMinutes,
}: ReportsViewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Period</span>
          <select
            value={period}
            onChange={(e) =>
              onPeriodChange(e.target.value as ReportPeriod)
            }
            aria-label="Report period"
            className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        <button
          type="button"
          onClick={onExportClick}
          disabled={isLoading}
          className="rounded-lg bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <div className="p-4">
        {isLoading && (
          <p className="text-sm text-gray-500">Loading report…</p>
        )}
        {!isLoading && !report && (
          <p className="text-sm text-gray-500">Select a period to view report.</p>
        )}
        {!isLoading && report && (
          <>
            <p className="mb-4 text-sm text-gray-500">
              {report.startDate.slice(0, 10)} – {report.endDate.slice(0, 10)}
            </p>
            {report.byProject.length === 0 ? (
              <p className="text-sm text-gray-500">No time entries in this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-600">
                      <th className="pb-2 font-medium">Project</th>
                      <th className="pb-2 font-medium text-right">Time</th>
                      <th className="pb-2 font-medium text-right">Entries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.byProject.map((row) => (
                      <tr
                        key={row.projectId}
                        className="border-b border-gray-100"
                      >
                        <td className="py-2 font-medium text-gray-900">
                          {row.projectName}
                        </td>
                        <td className="py-2 text-right tabular-nums text-gray-700">
                          {formatMinutes(row.totalMinutes)}
                        </td>
                        <td className="py-2 text-right tabular-nums text-gray-500">
                          {row.entryCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 font-medium">
                      <td className="pt-2">Total</td>
                      <td className="pt-2 text-right tabular-nums">
                        {formatMinutes(report.totalMinutes)}
                      </td>
                      <td className="pt-2 text-right">—</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
