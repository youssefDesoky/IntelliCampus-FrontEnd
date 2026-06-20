import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { role: "Students", count: 1560 },
  { role: "Instructors", count: 85 },
  { role: "Admins", count: 12 },
];

const COLORS = [
  "var(--color-bg-fill-accent-default-light)",
  "var(--color-bg-fill-success-default-light)",
  "var(--color-bg-fill-warning-default-light)",
];

export default function UserDistributionChart({ className = "" }) {
  return (
    <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-text-primary-default-light dark:text-text-primary-default-dark">User Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="role" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4}>
            {data.map((_, index) => (
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
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
