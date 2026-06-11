import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { semester: "Sem 1", gpa: 3.2 },
  { semester: "Sem 2", gpa: 3.4 },
  { semester: "Sem 3", gpa: 3.6 },
  { semester: "Sem 4", gpa: 3.8 },
];

export default function GPATrendChart({ className = "" }) {
  return (
    <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-text-primary-default-light dark:text-text-primary-default-dark">GPA Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border-primary-default-light dark:stroke-border-primary-default-dark" />
          <XAxis dataKey="semester" className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <YAxis domain={[2, 4]} className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-bg-surface-primary-default-light)",
              border: "1px solid var(--color-border-primary-default-light)",
              borderRadius: "8px",
              color: "var(--color-text-primary-default-light)",
            }}
          />
          <Line type="monotone" dataKey="gpa" stroke="var(--color-bg-fill-success-default-light)" strokeWidth={3} dot={{ fill: "var(--color-bg-fill-success-default-light)", r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
