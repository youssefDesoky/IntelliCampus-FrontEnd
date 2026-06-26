import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AssignmentCompletionChart({ className = "", data = [] }) {
  const chartData = data.map((point) => ({
    course: point.course,
    completed: Number(point.completed ?? 0),
    pending: Number(point.pending ?? 0),
  }));

  return (
    <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-text-primary-default-light dark:text-text-primary-default-dark">Assignment Completion</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border-primary-default-light dark:stroke-border-primary-default-dark" />
          <XAxis dataKey="course" className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <YAxis className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-bg-surface-primary-default-light)",
              border: "1px solid var(--color-border-primary-default-light)",
              borderRadius: "8px",
              color: "var(--color-text-primary-default-light)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "var(--color-text-secondary-default-light)" }} />
          <Bar dataKey="completed" fill="var(--color-bg-fill-success-default-light)" radius={[4, 4, 0, 0]} name="Completed" />
          <Bar dataKey="pending" fill="var(--color-bg-fill-warning-default-light)" radius={[4, 4, 0, 0]} name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
