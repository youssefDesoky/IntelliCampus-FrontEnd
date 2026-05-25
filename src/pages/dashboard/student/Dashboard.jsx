
import BoxData from "../../../components/ui/BoxData";
import Section from "../../../components/ui/Section";
import PageHeader from "../../../components/ui/PageHeader";
import { NavLink } from "react-router-dom";
import { BookIcon, FileLinesIcon, ClipboardCheckIcon, ChartLineIcon, BullHornIcon, ArrowRightIcon } from "../../../components/ui/icons";

import StudyTimer from "../../../feature/student/dashboard/StudyTimer";
import TodayClasses from "../../../feature/student/dashboard/TodayClasses";
import TodayReminders from "../../../feature/student/dashboard/TodayReminders";
import AttendanceOverall from "../../../feature/student/dashboard/AttendanceOverall";
import DashboardStudyGroup from "../../../feature/student/dashboard/DashboardStudyGroup";

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
  courses: [
    { id: 1, name: "Calculus I", time: "10:00 AM - 11:30 AM" },
    { id: 2, name: "Introduction to Psychology", time: "12:00 PM - 1:30 PM" },
  ],
  reminders: [
    { id: 1, text: "Submit assignment for Calculus I", time: "Today at 5:00 PM" },
    { id: 2, text: "Prepare for Psychology quiz", time: "Tomorrow at 9:00 AM" },
  ],
  announcements: [
    { id: 1, title: "Calculus Midterm Scope Published", time: "Posted 2 hours ago", course: "Calculus I" },
    { id: 2, title: "Psychology Quiz moved to Thursday", time: "Posted today", course: "Introduction to Psychology" },
    { id: 3, title: "Office hours updated this week", time: "Posted yesterday", course: "Calculus I" },
  ],
  attendanceOverall: 80,
  notes: [
    { id: 1, title: "Calculus Notes", content: "Limits, Derivatives, Integrals..." },
    { id: 2, title: "Psychology Notes", content: "Cognitive Development, Behaviorism..." },
  ],
};

export default function Dashboard() {
  return (
    <>
      <PageHeader title={`${studentData.name}'s Dashboard`} subtitle="Here's what's happening with your courses today" />
  
      <Section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
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

      <Section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 mb-6">
        <TodayClasses className="lg:col-span-8" todayClasses={studentData.courses} columnLayout />

        <div className="lg:col-span-4 p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Announcements</h2>
            <BullHornIcon className="w-6 h-6" />
          </div>

          <menu className="flex flex-col gap-3 mb-6">
            {studentData.announcements.map((announcement) => (
              <li
                key={announcement.id}
                className="p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"
              >
                <p className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{announcement.title}</p>
                <p className="text-xs mt-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">{announcement.course}</p>
                <p className="text-xs mt-2 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{announcement.time}</p>
              </li>
            ))}
          </menu>

          <NavLink to="/courses" className="mt-auto text-text-accent-default-light dark:text-text-accent-default-dark hover:underline flex items-center gap-2 justify-center font-medium">
            View All Announcements
            <ArrowRightIcon className="w-4 h-4" />
          </NavLink>
        </div>
      </Section>

      <Section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <DashboardStudyGroup className="lg:col-span-8" />

        <div className="lg:col-span-4 flex flex-col gap-6">
          <TodayReminders reminders={studentData.reminders} className="min-h-72" />
          <StudyTimer className="min-h-88" />
          <AttendanceOverall className="min-h-88" studentAttendance={studentData.attendanceOverall} />
        </div>
      </Section>

    </>
  );
}