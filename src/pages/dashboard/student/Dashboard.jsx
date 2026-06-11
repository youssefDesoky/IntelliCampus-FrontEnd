import BoxData from "../../../components/ui/BoxData";
import Section from "../../../components/ui/Section";
import { NavLink } from "react-router-dom";
import { BookIcon, FileLinesIcon, ClipboardCheckIcon, ChartLineIcon, ClockIcon, BullHornIcon, ArrowRightIcon, ChartBarIcon } from "../../../components/ui/icons";

import StudyTimer from "../../../feature/student/dashboard/StudyTimer";
import TodayReminders from "../../../feature/student/dashboard/TodayReminders";
import {
  AttendanceTrendChart,
  GPATrendChart,
  GradeDistributionChart,
  StudyTimeChart,
  AssignmentCompletionChart,
} from "../../../feature/student/dashboard/charts";

const statsData = [
  {
    id: 1,
    title: "Active Courses",
    value: 6,
    icon: <BookIcon className="w-6 h-6 text-blue-600" />,
    iconStyle: "bg-blue-100 dark:bg-bg-surface-blue-default-dark",
  },
  {
    id: 2,
    title: "Pending Assignments",
    value: 4,
    icon: <FileLinesIcon className="w-6 h-6 text-emerald-600" />,
    iconStyle: "bg-green-100 dark:bg-bg-surface-green-default-dark",
  },
  {
    id: 3,
    title: "Attendance Rate",
    value: "92%",
    icon: <ClipboardCheckIcon className="w-6 h-6 text-amber-600" />,
    iconStyle: "bg-yellow-100 dark:bg-bg-surface-yellow-default-dark",
  },
  {
    id: 4,
    title: "Current GPA",
    value: "3.8",
    icon: <ChartLineIcon className="w-6 h-6 text-rose-600" />,
    iconStyle: "bg-red-100 dark:bg-bg-surface-red-default-dark",
  },
];

const studentData = {
  name: "John Doe",
  news: [
    { id: 1, title: "Calculus Midterm Scope Published", time: "Posted 2 hours ago", course: "Calculus I" },
    { id: 2, title: "Psychology Quiz moved to Thursday", time: "Posted today", course: "Introduction to Psychology" },
    { id: 3, title: "Office hours updated this week", time: "Posted yesterday", course: "Calculus I" },
  ],
  reminders: [
    { id: 1, text: "Submit assignment for Calculus I", time: "Today at 5:00 PM" },
    { id: 2, text: "Prepare for Psychology quiz", time: "Tomorrow at 9:00 AM" },
  ],
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Dashboard() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
            {getGreeting()}, {studentData.name}
          </h1>
          <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1 flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            {getFormattedDate()}
          </p>
        </div>
      </div>

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
            {studentData.news.map((item) => (
              <li
                key={item.id}
                className="p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
              >
                <p className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{item.title}</p>
                <p className="text-xs mt-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">{item.course}</p>
                <p className="text-xs mt-2 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{item.time}</p>
              </li>
            ))}
          </menu>

          <NavLink to="/courses" className="mt-auto text-text-accent-default-light dark:text-text-accent-default-dark hover:underline flex items-center gap-2 justify-center font-medium">
            View All News
            <ArrowRightIcon className="w-4 h-4" />
          </NavLink>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <TodayReminders reminders={studentData.reminders} />
          <StudyTimer />
        </div>
      </Section>

      <Section>
        <div className="flex items-center gap-3 mb-6">
          <ChartBarIcon className="w-7 h-7 text-text-accent-default-light dark:text-text-accent-default-dark" />
          <h2 className="text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <AttendanceTrendChart className="lg:col-span-6" />
          <GPATrendChart className="lg:col-span-6" />
        </div>

        <div className="mt-6">
          <AssignmentCompletionChart />
        </div>
      </Section>
    </>
  );
}