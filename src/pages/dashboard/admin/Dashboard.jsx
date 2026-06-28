import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import BoxData from "../../../components/ui/BoxData";
import Section from "../../../components/ui/Section";
import TextArea from "../../../components/ui/TextArea";
import Button from "../../../components/ui/Button";
import { ChartCard } from "../../../components/charts";
import {
  UsersIcon,
  UserTieIcon,
  BookIcon,
  HouseIcon,
  CalendarDaysIcon,
  LocationDotIcon,
  ChartBarIcon,
  ClockIcon,
  BullHornIcon,
  PaperPlaneIcon,
} from "../../../components/ui/icons";
import { fetchAdminDashboard, publishNews } from "../../../api/dashboard";

// ─── Stat card config ────────────────────────────────────────────────────────

const statIcons = {
  totalStudents: <UsersIcon className="w-6 h-6 text-blue-600" />,
  instructors:   <UserTieIcon className="w-6 h-6 text-emerald-600" />,
  courses:       <BookIcon className="w-6 h-6 text-amber-600" />,
  departments:   <HouseIcon className="w-6 h-6 text-rose-600" />,
  activeClasses: <CalendarDaysIcon className="w-6 h-6 text-purple-600" />,
  rooms:         <LocationDotIcon className="w-6 h-6 text-cyan-600" />,
};

const statIconStyles = {
  totalStudents: "bg-blue-100   dark:bg-bg-surface-blue-default-dark",
  instructors:   "bg-green-100  dark:bg-bg-surface-green-default-dark",
  courses:       "bg-yellow-100 dark:bg-bg-surface-yellow-default-dark",
  departments:   "bg-red-100    dark:bg-bg-surface-red-default-dark",
  activeClasses: "bg-purple-100 dark:bg-bg-surface-purple-default-dark",
  rooms:         "bg-cyan-100   dark:bg-bg-surface-cyan-default-dark",
};

const statLabels = {
  totalStudents: "Total Students",
  instructors:   "Instructors",
  courses:       "Courses",
  departments:   "Departments",
  activeClasses: "Active Classes",
  rooms:         "Rooms",
};

// ─── Mock chart fallback data ─────────────────────────────────────────────────

const MOCK_ENROLLMENT = [
  { month: "Sep", students: 380 },
  { month: "Oct", students: 420 },
  { month: "Nov", students: 405 },
  { month: "Dec", students: 365 },
  { month: "Jan", students: 450 },
  { month: "Feb", students: 478 },
  { month: "Mar", students: 490 },
  { month: "Apr", students: 462 },
];

const MOCK_GRADES = [
  { name: "A",  value: 280 },
  { name: "B",  value: 350 },
  { name: "C",  value: 220 },
  { name: "D",  value: 95  },
  { name: "F",  value: 55  },
];

const MOCK_TOP_COURSES = [
  { course: "CS101 – Intro to CS",       enrolled: 145 },
  { course: "MATH201 – Calculus II",     enrolled: 132 },
  { course: "ENG301 – Tech Writing",     enrolled: 118 },
  { course: "PHY101 – Physics I",        enrolled: 105 },
  { course: "BUS201 – Business Mgmt",    enrolled: 98  },
];

const MOCK_DEPT_STATUS = [
  { dept: "CS",   active: 12, completed: 28, upcoming: 5 },
  { dept: "Math", active: 8,  completed: 22, upcoming: 4 },
  { dept: "Eng",  active: 10, completed: 25, upcoming: 6 },
  { dept: "Bio",  active: 6,  completed: 18, upcoming: 3 },
  { dept: "Bus",  active: 9,  completed: 20, upcoming: 5 },
];

const GRADE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"];

// ─── Utility ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── Shared chart primitives ──────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-lg text-xs">
      {label && (
        <p className="font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="font-medium" style={{ color: entry.color ?? entry.fill }}>
          {entry.name}:{" "}
          <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─── Chart components ─────────────────────────────────────────────────────────

function EnrollmentTrendChart({ data }) {
  return (
    <ChartCard
      title="Enrollment Trend"
      subtitle="Monthly student count — current academic year"
      chartType="area" chartData={data} categoryField="month" series={[{ field: "students", name: "Students" }]}
    >
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128,128,128,0.12)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="students"
            name="Students"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#enrollGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function GradeDistributionChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;
    const RAD = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RAD);
    const y = cy + r * Math.sin(-midAngle * RAD);
    return (
      <text
        x={x} y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={700}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartCard
      title="Grade Distribution"
      subtitle="A–F breakdown across all courses this semester"
      chartType="pie" chartData={data} categoryField="name" series={[{ field: "value", name: "Students" }]}
    >
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="55%" height={210}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={52}
              outerRadius={84}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={GRADE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-2.5">
          {data.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-2.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: GRADE_COLORS[i] }}
              />
              <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark flex-1">
                Grade {entry.name}
              </span>
              <span className="text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark tabular-nums">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                Total
              </span>
              <span className="text-xs font-bold text-text-primary-active-light dark:text-text-primary-active-dark tabular-nums">
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

function TopCoursesChart({ data }) {
  return (
    <ChartCard
      title="Top Enrolled Courses"
      subtitle="5 most popular courses this semester"
      chartType="bar" chartData={data} categoryField="course" series={[{ field: "enrolled", name: "Enrolled" }]}
    >
      <ResponsiveContainer width="100%" height={210}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="rgba(128,128,128,0.12)"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="course"
            tick={{ fontSize: 10, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            width={130}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="enrolled"
            name="Enrolled"
            radius={[0, 5, 5, 0]}
            fill="#8b5cf6"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function CourseStatusChart({ data }) {
  return (
    <ChartCard
      title="Course Status by Department"
      subtitle="Active, completed, and upcoming courses per department"
      chartType="bar" chartData={data} categoryField="dept" series={[{ field: "active", name: "Active" }, { field: "completed", name: "Completed" }, { field: "upcoming", name: "Upcoming" }]}
    >
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{ top: 0, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(128,128,128,0.12)"
          />
          <XAxis
            dataKey="dept"
            tick={{ fontSize: 11, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconSize={8}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
          />
          <Bar dataKey="active"    name="Active"    stackId="a" fill="#3b82f6" />
          <Bar dataKey="completed" name="Completed" stackId="a" fill="#22c55e" />
          <Bar dataKey="upcoming"  name="Upcoming"  stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── Academic Snapshot panel ──────────────────────────────────────────────────

const SNAPSHOT_METRICS = [
  { label: "Pass Rate",          value: "84%",      progress: 84, color: "#22c55e" },
  { label: "Course Completion",  value: "71%",      progress: 71, color: "#3b82f6" },
  { label: "Student Retention",  value: "92%",      progress: 92, color: "#8b5cf6" },
  { label: "Average GPA",        value: "3.1 / 4.0",progress: 77.5, color: "#f59e0b" },
];

function AcademicSnapshot({ stats }) {
  return (
    <div className="h-full p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl flex flex-col">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
          Academic Snapshot
        </h2>
        <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
          Key performance indicators — current semester
        </p>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {SNAPSHOT_METRICS.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                {m.label}
              </span>
              <span className="text-xs font-bold text-text-primary-default-light dark:text-text-primary-default-dark tabular-nums">
                {m.value}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${m.progress}%`, backgroundColor: m.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {stats.totalStudents > 0 && (
        <div className="mt-6 pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
          <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark leading-relaxed">
            Reflects{" "}
            <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
              {stats.totalStudents?.toLocaleString()}
            </span>{" "}
            students across{" "}
            <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
              {stats.departments}
            </span>{" "}
            departments.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [newsInput, setNewsInput] = useState("");

  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,
    staleTime: 5 * 60 * 1000,
  });

  const publishMutation = useMutation({
    mutationFn: publishNews,
    onSuccess: () => {
      setNewsInput("");
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });

  const handlePublish = (e) => {
    e.preventDefault();
    const trimmed = newsInput.trim();
    if (!trimmed) return;
    publishMutation.mutate(trimmed);
  };

  const stats = dashboard?.stats ?? {};

  const statsData = Object.entries(statLabels).map(([key, label], index) => ({
    id: index + 1,
    title: label,
    value: stats[key] ?? 0,
    icon: statIcons[key],
    iconStyle: statIconStyles[key],
  }));

  // Use API-provided chart data when available, fall back to representative mock data
  const enrollmentData  = dashboard?.charts?.enrollmentTrend    ?? MOCK_ENROLLMENT;
  const gradeData       = dashboard?.charts?.gradeDistribution  ?? MOCK_GRADES;
  const topCoursesData  = dashboard?.charts?.topCourses         ?? MOCK_TOP_COURSES;
  const deptStatusData  = dashboard?.charts?.departmentStatus   ?? MOCK_DEPT_STATUS;

  const textAreaClasses =
    "w-full px-4 py-2.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark focus:ring-2 focus:ring-border-accent-active-light dark:focus:ring-border-accent-active-dark focus:border-border-accent-active-light outline-none transition-all placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-text-error-default-light dark:text-text-error-default-dark">
        Failed to load dashboard. Please try again later.
      </div>
    );
  }

  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
            {getGreeting()}, Admin
          </h1>
          <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1 flex items-center gap-2 text-sm">
            <ClockIcon className="w-4 h-4" />
            {getFormattedDate()}
          </p>
        </div>

        {/* Quick-glance metric pills */}
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {[
            {
              label: "Pass Rate",
              value: "84%",
              className:
                "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-bg-surface-green-default-dark",
            },
            {
              label: "Retention",
              value: "92%",
              className:
                "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-bg-surface-blue-default-dark",
            },
            {
              label: "Avg GPA",
              value: "3.1",
              className:
                "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-bg-surface-yellow-default-dark",
            },
          ].map((pill) => (
            <span
              key={pill.label}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs ${pill.className}`}
            >
              <span className="text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                {pill.label}
              </span>
              <span className="font-bold">{pill.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────── */}
      <Section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {statsData.map((stat) => (
          <BoxData
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconStyle={stat.iconStyle}
          />
        ))}
      </Section>

      {/* ── Announcements + Academic Snapshot ─────────────────────────── */}
      <Section className="flex flex-col lg:grid lg:grid-cols-12 gap-6">

        {/* News feed */}
        <div className="lg:col-span-8 p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
                Latest Announcements
              </h2>
              <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                Broadcast to all students and instructors
              </p>
            </div>
            <BullHornIcon className="w-5 h-5 text-text-tertiary-default-light dark:text-text-tertiary-default-dark" />
          </div>

          <form onSubmit={handlePublish} className="mb-5">
            <TextArea
              minHeight={60}
              maxHeight={120}
              className={textAreaClasses}
              placeholder="Write an announcement..."
              value={newsInput}
              onChange={(e) => setNewsInput(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={publishMutation.isPending}
                loadingText="Publishing"
                startIcon={<PaperPlaneIcon className="w-4 h-4" />}
              >
                Publish
              </Button>
            </div>
          </form>

          <menu className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0 no-scrollbar">
            {dashboard.latestNews?.length > 0 ? (
              dashboard.latestNews.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
                >
                  {/* Colored accent bar */}
                  <div className="w-0.5 flex-shrink-0 rounded-full bg-text-accent-default-light dark:bg-text-accent-default-dark self-stretch" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                      {item.title}
                    </p>
                    {item.course && (
                      <p className="text-xs mt-0.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        {item.course}
                      </p>
                    )}
                    <p className="text-xs mt-2 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                      {item.date
                        ? `Posted ${formatDistanceToNow(new Date(item.date), { addSuffix: true })}`
                        : "Posted recently"}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-10 text-center">
                <BullHornIcon className="w-10 h-10 mx-auto mb-2 text-text-tertiary-default-light dark:text-text-tertiary-default-dark opacity-25" />
                <p className="text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                  No announcements yet. Publish one above.
                </p>
              </li>
            )}
          </menu>
        </div>

        {/* Academic KPI snapshot */}
        <div className="lg:col-span-4">
          <AcademicSnapshot stats={stats} />
        </div>
      </Section>

      {/* ── Analytics ─────────────────────────────────────────────────── */}
      <Section>
        <div className="flex items-center gap-3 mb-6">
          <ChartBarIcon className="w-6 h-6 text-text-accent-default-light dark:text-text-accent-default-dark" />
          <div>
            <h2 className="text-xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
              Analytics Overview
            </h2>
            <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
              Enrollment, grades, and course activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnrollmentTrendChart data={enrollmentData} />
          <GradeDistributionChart data={gradeData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TopCoursesChart data={topCoursesData} />
          <CourseStatusChart data={deptStatusData} />
        </div>
      </Section>
    </>
  );
}