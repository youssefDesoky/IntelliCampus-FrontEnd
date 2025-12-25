
import Section from "../../../components/ui/Section";
import PageHeader from "../../../components/ui/PageHeader";

import BoxData from "../../../components/ui/BoxData";
import TodayClasses from "./todayClasses/TodayClasses";
import StudyTimer from "./StudyTimer";
import AttendanceOverall from "./AttendanceOverall";
import TodayReminders from "./upcomingDeadlines/TodayReminders";
import DashboardSmartNotes from "./smartNotes/DashboardSmartNotes";
import DashboardCommunity from "./community/DashboardCommunity";

// Icons
import BookIcon from "../../../components/icons/BookIcon";
import FileLinesIcon from "../../../components/icons/FileLinesIcon";
import ClipboardCheckIcon from "../../../components/icons/ClipboardCheckIcon";
import ChartLineIcon from "../../../components/icons/ChartLineIcon";

import { NavLink } from "react-router-dom";
import DashboardCourses from "./courses/DashboardCourses";


const statsData = [
  {
    id: 1,
    title: "Active Courses",
    value: 6,
    icon: <BookIcon className="w-6 h-6 bg-blue-100 text-blue-500" />,
  },
  {
    id: 2,
    title: "Pending Assignments",
    value: 4,
    icon: <FileLinesIcon className="w-6 h-6 bg-green-100 text-green-500" />,
  },
  {
    id: 3,
    title: "Attendance Rate",
    value: "92%",
    icon: <ClipboardCheckIcon className="w-6 h-6 bg-yellow-100 text-yellow-500" />,
  },
  {
    id: 4,
    title: "Current GPA",
    value: "3.8",
    icon: <ChartLineIcon className="w-6 h-6 bg-red-100 text-red-500" />,
  },
];

export default function Dashboard({studentData}) {
  return (
    <>
      <PageHeader title={`${studentData.name}'s Dashboard`} subtitle="Here's what's happening with your courses today" />
  
      <Section className="grid grid-cols-4 gap-6 mb-6">
        {statsData.map((stat) => (
          <BoxData 
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </Section>

      <Section className="grid grid-cols-4 gap-6 mt-6 mb-6">
        <TodayClasses className="col-span-3" todayClasses={studentData.courses} />

        <div className="flex flex-col justify-between">
          <StudyTimer className="h-[45%]" />

          <AttendanceOverall className="mt-6 h-[55%]" studentAttendance={studentData.attendanceOverall} />
        </div>
      </Section>

      <Section className="grid grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-6 justify-between col-span-1">
          <TodayReminders reminders={studentData.reminders["today"]} className="h-[45%]" />
          <DashboardSmartNotes studentNotes={studentData.notes} className="h-[55%]" />
        </div>

        <DashboardCommunity className="col-span-3" />
      </Section>

      <Section className="mb-6">
        <DashboardCourses studentCourses={studentData.courses} />  
      </Section>
    </>
  );
}