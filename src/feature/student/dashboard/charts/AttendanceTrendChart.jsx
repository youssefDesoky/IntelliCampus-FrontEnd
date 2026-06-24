import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AttendanceTrendChart({ className = "", data = [] }) {
  const chartData = data.map((point) => ({
    week: point.week,
    attendance: Number(point.attendance ?? 0),
  }));

  return (
    <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-text-primary-default-light dark:text-text-primary-default-dark">Weekly Attendance Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border-primary-default-light dark:stroke-border-primary-default-dark" />
          <XAxis dataKey="week" className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <YAxis domain={[0, 100]} className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-bg-surface-primary-default-light)",
              border: "1px solid var(--color-border-primary-default-light)",
              borderRadius: "8px",
              color: "var(--color-text-primary-default-light)",
            }}
          />
          <Line type="monotone" dataKey="attendance" stroke="var(--color-bg-fill-accent-default-light)" strokeWidth={3} dot={{ fill: "var(--color-bg-fill-accent-default-light)", r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
