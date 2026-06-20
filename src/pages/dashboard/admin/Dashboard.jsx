import BoxData from "../../../components/ui/BoxData";
import Section from "../../../components/ui/Section";
import {
  UsersIcon,
  UserTieIcon,
  BookIcon,
  HouseIcon,
  CalendarDaysIcon,
  LocationDotIcon,
  ChartBarIcon,
  ClockIcon,
} from "../../../components/ui/icons";
import {
  EnrollmentTrendChart,
  UserDistributionChart,
  DepartmentDistributionChart,
  CoursesPerDepartmentChart,
} from "../../../feature/admin/dashboard/charts";

const statsData = [
  {
    id: 1,
    title: "Total Students",
    value: "1,560",
    icon: <UsersIcon className="w-6 h-6 text-blue-600" />,
    iconStyle: "bg-blue-100 dark:bg-bg-surface-blue-default-dark",
  },
  {
    id: 2,
    title: "Instructors",
    value: 85,
    icon: <UserTieIcon className="w-6 h-6 text-emerald-600" />,
    iconStyle: "bg-green-100 dark:bg-bg-surface-green-default-dark",
  },
  {
    id: 3,
    title: "Courses",
    value: 79,
    icon: <BookIcon className="w-6 h-6 text-amber-600" />,
    iconStyle: "bg-yellow-100 dark:bg-bg-surface-yellow-default-dark",
  },
  {
    id: 4,
    title: "Departments",
    value: 6,
    icon: <HouseIcon className="w-6 h-6 text-rose-600" />,
    iconStyle: "bg-red-100 dark:bg-bg-surface-red-default-dark",
  },
  {
    id: 5,
    title: "Active Classes",
    value: 42,
    icon: <CalendarDaysIcon className="w-6 h-6 text-purple-600" />,
    iconStyle: "bg-purple-100 dark:bg-bg-surface-purple-default-dark",
  },
  {
    id: 6,
    title: "Rooms",
    value: 18,
    icon: <LocationDotIcon className="w-6 h-6 text-cyan-600" />,
    iconStyle: "bg-cyan-100 dark:bg-bg-surface-cyan-default-dark",
  },
];

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
            {getGreeting()}, Admin
          </h1>
          <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1 flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            {getFormattedDate()}
          </p>
        </div>
      </div>

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

      <Section>
        <div className="flex items-center gap-3 mb-6">
          <ChartBarIcon className="w-7 h-7 text-text-accent-default-light dark:text-text-accent-default-dark" />
          <h2 className="text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">Analytics Overview</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnrollmentTrendChart />
          <UserDistributionChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <DepartmentDistributionChart />
          <CoursesPerDepartmentChart />
        </div>
      </Section>
    </>
  );
}
