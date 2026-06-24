import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function GradeDistributionChart({ className = "", data = [] }) {
  const chartData = data.map((point) => ({
    course: point.course,
    grade: Number(point.grade ?? 0),
  }));

  return (
    <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-text-primary-default-light dark:text-text-primary-default-dark">Grade Distribution</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border-primary-default-light dark:stroke-border-primary-default-dark" />
          <XAxis dataKey="course" className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <YAxis domain={[0, 100]} className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-bg-surface-primary-default-light)",
              border: "1px solid var(--color-border-primary-default-light)",
              borderRadius: "8px",
              color: "var(--color-text-primary-default-light)",
            }}
          />
          <Bar dataKey="grade" fill="var(--color-bg-fill-purple-default-light)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
