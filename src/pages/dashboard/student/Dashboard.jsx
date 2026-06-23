import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import BoxData from "../../../components/ui/BoxData";
import Section from "../../../components/ui/Section";
import { BookIcon, FileLinesIcon, ClipboardCheckIcon, ChartLineIcon, BullHornIcon, ArrowRightIcon, ChartBarIcon } from "../../../components/ui/icons";

import StudyTimer from "../../../feature/student/dashboard/StudyTimer";
import TodayReminders from "../../../feature/student/dashboard/TodayReminders";
import {
  AttendanceTrendChart,
  GPATrendChart,
} from "../../../feature/student/dashboard/charts";
import { fetchStudentDashboard } from "../../../api/dashboard";

const statIcons = {
  activeCourses: <BookIcon className="w-6 h-6 text-blue-600" />,
  pendingAssignments: <FileLinesIcon className="w-6 h-6 text-emerald-600" />,
  attendanceRate: <ClipboardCheckIcon className="w-6 h-6 text-amber-600" />,
  currentGpa: <ChartLineIcon className="w-6 h-6 text-rose-600" />,
};

const statIconStyles = {
  activeCourses: "bg-blue-100 dark:bg-bg-surface-blue-default-dark",
  pendingAssignments: "bg-green-100 dark:bg-bg-surface-green-default-dark",
  attendanceRate: "bg-yellow-100 dark:bg-bg-surface-yellow-default-dark",
  currentGpa: "bg-red-100 dark:bg-bg-surface-red-default-dark",
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await fetchStudentDashboard();
        if (!cancelled) {
          setDashboard(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = dashboard?.stats ?? {};
  const statsData = [
    {
      id: 1,
      title: "Active Courses",
      value: stats.activeCourses ?? 0,
      icon: statIcons.activeCourses,
      iconStyle: statIconStyles.activeCourses,
    },
    {
      id: 2,
      title: "Pending Assignments",
      value: stats.pendingAssignments ?? 0,
      icon: statIcons.pendingAssignments,
      iconStyle: statIconStyles.pendingAssignments,
    },
    {
      id: 3,
      title: "Attendance Rate",
      value: `${stats.attendanceRate ?? 0}%`,
      icon: statIcons.attendanceRate,
      iconStyle: statIconStyles.attendanceRate,
    },
    {
      id: 4,
      title: "Current GPA",
      value: stats.currentGpa ?? "0.0",
      icon: statIcons.currentGpa,
      iconStyle: statIconStyles.currentGpa,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-text-secondary-default-light dark:text-text-secondary-default-dark">
        Loading dashboard…
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
      <Section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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

      <Section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <BullHornIcon className="w-6 h-6" />
          </div>

          <menu className="flex flex-col gap-3 mb-6">
            {dashboard.latestNews?.length > 0 ? (
              dashboard.latestNews.map((item) => (
                <li
                  key={item.id}
                  className="p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
                >
                  <p className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{item.title}</p>
                  <p className="text-xs mt-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">{item.course}</p>
                  <p className="text-xs mt-2 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                    {item.date ? `Posted ${formatDistanceToNow(new Date(item.date), { addSuffix: true })}` : "Posted recently"}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-center text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                No news available
              </li>
            )}
          </menu>

          <NavLink to="/courses" className="mt-auto text-text-accent-default-light dark:text-text-accent-default-dark hover:underline flex items-center gap-2 justify-center font-medium">
            View All News
            <ArrowRightIcon className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <TodayReminders />
          <StudyTimer />
        </div>
      </Section>

      <Section>
        <div className="flex items-center gap-3 mb-6">
          <ChartBarIcon className="w-7 h-7 text-text-accent-default-light dark:text-text-accent-default-dark" />
          <h2 className="text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <AttendanceTrendChart className="lg:col-span-6" data={dashboard.attendanceTrend ?? []} />
          <GPATrendChart className="lg:col-span-6" data={dashboard.gpaTrend ?? []} />
        </div>
      </Section>
    </>
  );
}
