import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "var(--color-bg-fill-accent-default-light)",
  "var(--color-bg-fill-success-default-light)",
  "var(--color-bg-fill-purple-default-light)",
  "var(--color-bg-fill-warning-default-light)",
  "var(--color-bg-fill-info-default-light)",
];

export default function StudyTimeChart({ className = "", data = [] }) {
  const chartData = data.map((point) => ({
    subject: point.subject,
    hours: Number(point.hours ?? 0),
  }));

  return (
    <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-text-primary-default-light dark:text-text-primary-default-dark">Study Time per Subject</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} dataKey="hours" nameKey="subject" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={4}>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-bg-surface-primary-default-light)",
              border: "1px solid var(--color-border-primary-default-light)",
              borderRadius: "8px",
              color: "var(--color-text-primary-default-light)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "var(--color-text-secondary-default-light)" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
