import { FilePenIcon } from "../../../../components/ui/icons";
import { ChartCard } from "../../../../components/charts";

const TYPE_COLORS = {
  Quiz: "var(--color-bg-fill-purple-default-light)",
  Assignment: "var(--color-bg-fill-accent-default-light)",
  Midterm: "var(--color-bg-fill-warning-default-light)",
  Final: "var(--color-bg-fill-danger-default-light)",
  Exam: "var(--color-bg-fill-info-default-light)",
  Project: "var(--color-bg-fill-success-default-light)",
};

const TYPE_ORDER = ["Quiz", "Assignment", "Midterm", "Project", "Exam", "Final"];

export default function CourseWorkBreakdownChart({ className = "", data = {}, downloadUrl }) {
  const { totalMarks = 0, breakdown = [], undeclaredMarks = 0 } = data;

  const sorted = [...breakdown].sort(
    (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)
  );

  const hasData = totalMarks > 0;

  const segments = hasData
    ? [
        ...sorted.map((d) => ({
          label: d.type,
          value: d.marks,
          pct: (d.marks / totalMarks) * 100,
          color: TYPE_COLORS[d.type] || "var(--color-bg-fill-accent-default-light)",
        })),
        ...(undeclaredMarks > 0
          ? [
              {
                label: "Undeclared",
                value: undeclaredMarks,
                pct: (undeclaredMarks / totalMarks) * 100,
                color: "var(--color-bg-fill-tertiary-disabled-light)",
              },
            ]
          : []),
      ]
    : [];

  return (
    <ChartCard title="Course Work Breakdown" icon={<FilePenIcon size={20} />} className={className} downloadUrl={downloadUrl}
      chartType="bar" chartData={hasData ? segments : []} categoryField="label" series={[{ field: "value", name: "Marks" }, { field: "pct", name: "Percentage" }]}>
      {!hasData ? (
        <p className="text-center text-text-tertiary-default-light dark:text-text-tertiary-default-dark py-8">No course work data available</p>
      ) : (
        <div className="space-y-6">
          <div className="flex h-10 w-full overflow-hidden rounded-lg">
              {segments.map((seg) => (
                <div
                  key={seg.label}
                  className="relative flex items-center justify-center text-xs font-semibold text-white transition-colors duration-200 hover:opacity-90"
                  style={{
                    width: `${seg.pct}%`,
                    backgroundColor: seg.color,
                    minWidth: seg.pct > 10 ? undefined : 0,
                  }}
                  title={`${seg.label}: ${seg.value} marks (${seg.pct.toFixed(1)}%)`}
                >
                  {seg.pct > 10 && (
                    <span className="truncate px-1">
                      {seg.label} ({seg.value})
                    </span>
                  )}
                </div>
              ))}
            </div>

          <div className="grid grid-cols-2 gap-3">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className="flex flex-col items-center p-3 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
              >
                <span
                  className="w-6 h-1 rounded-full mb-2"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                  {seg.value}
                </span>
                <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                  marks
                </span>
                <span className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">
                  {seg.label} &middot; {seg.pct.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartCard>
  );
}
