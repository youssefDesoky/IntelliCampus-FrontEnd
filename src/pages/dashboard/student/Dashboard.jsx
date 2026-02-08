
import BoxData from "../../../components/ui/BoxData";
import Section from "../../../components/ui/Section";
import PageHeader from "../../../components/ui/PageHeader";
import { BookIcon, FileLinesIcon, ClipboardCheckIcon, ChartLineIcon } from "../../../components/ui/icons";

import StudyTimer from "../../../feature/student/dashboard/StudyTimer";
import TodayClasses from "../../../feature/student/dashboard/TodayClasses";
import TodayReminders from "../../../feature/student/dashboard/TodayReminders";
import DashboardCourses from "../../../feature/student/dashboard/DashboardCourses";
import AttendanceOverall from "../../../feature/student/dashboard/AttendanceOverall";
import DashboardCommunity from "../../../feature/student/dashboard/DashboardCommunity";
import DashboardSmartNotes from "../../../feature/student/dashboard/DashboardSmartNotes";

import QuickUpload from "../../../components/ui/QuickUpload";

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

          {/* <AttendanceOverall className="mt-6 h-[55%]" studentAttendance={studentData.attendanceOverall} /> */}
          <QuickUpload className="mt-6 h-[55%]" />
        </div>
      </Section>

      <Section className="grid grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col gap-6 justify-between col-span-1">
          <TodayReminders reminders={studentData.reminders} className="h-[45%]" />
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