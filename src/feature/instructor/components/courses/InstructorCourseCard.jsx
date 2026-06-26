import { useNavigate } from "react-router-dom";
import {
  BookIcon,
  FilePenIcon,
  ClipboardCheckIcon,
  UserCheckIcon,
  ChartBarIcon,
  UsersIcon,
  DoorOpenIcon,
  LocationDotIcon,
} from "../../../../components/ui/icons";

const typeStyles = {
  elective: {
    label: "ELECTIVE",
    avatar: "bg-bg-surface-purple-default-light text-text-purple-default-light dark:bg-bg-surface-purple-default-dark dark:text-text-purple-default-dark",
    badge: "bg-bg-surface-purple-default-light text-text-purple-default-light border-border-purple-default-light dark:bg-bg-surface-purple-default-dark dark:text-text-purple-default-dark dark:border-border-purple-default-dark",
  },
  core: {
    label: "CORE",
    avatar: "bg-bg-surface-blue-default-light text-text-blue-default-light dark:bg-bg-surface-blue-default-dark dark:text-text-blue-default-dark",
    badge: "bg-bg-surface-blue-default-light text-text-blue-default-light border-border-blue-default-light dark:bg-bg-surface-blue-default-dark dark:text-text-blue-default-dark dark:border-border-blue-default-dark",
  },
};

export default function InstructorCourseCard({
  courseId,
  initials = "CS",
  code = "CS301-A",
  semester = "",
  type = "elective",
  title = "Course",
  room = "",
  totalStudents,
  onEnterClassroom,
}) {
  const navigate = useNavigate();
  const typeAccent = typeStyles[type] || typeStyles.elective;

  const quickLinks = [
    { label: "Materials", icon: BookIcon, path: `/instructor/courses/${courseId}/materials` },
    { label: "Assignments", icon: FilePenIcon, path: `/instructor/courses/${courseId}/assignments` },
    { label: "Quizzes", icon: ClipboardCheckIcon, path: `/instructor/courses/${courseId}/quizzes` },
    { label: "Attendance", icon: UserCheckIcon, path: `/instructor/courses/${courseId}/attendance` },
    { label: "Grades", icon: ChartBarIcon, path: `/instructor/courses/${courseId}/grades` },
  ];

  return (
    <div className="w-full rounded-2xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark p-4 sm:p-5 shadow-sm shadow-shadow-light/50 dark:shadow-shadow-dark/30">
      <div className="flex flex-col gap-4">
        {/* Top row: avatar + info */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div
            className={`hidden sm:flex w-14 h-14 rounded-xl items-center justify-center font-bold text-base flex-shrink-0 ${typeAccent.avatar}`}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark text-xs font-semibold">
                  {code}
                </span>
                {semester && (
                  <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark text-xs">
                    {semester}
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${typeAccent.badge}`}>
                  {typeAccent.label}
                </span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark mb-2 truncate">
              {title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
              {room && (
                <div className="flex items-center gap-1.5">
                  <LocationDotIcon className="w-3.5 h-3.5" />
                  <span>{room}</span>
                </div>
              )}
              {totalStudents != null && (
                <div className="flex items-center gap-1.5">
                  <UsersIcon className="w-3.5 h-3.5" />
                  <span>{totalStudents} Student{totalStudents !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end justify-center shrink-0">
            <button
              type="button"
              onClick={onEnterClassroom}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-bg-dark text-white whitespace-nowrap transition-opacity hover:opacity-90"
            >
              <DoorOpenIcon className="w-4 h-4" />
              Classroom
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border-tertiary-default-light dark:border-border-tertiary-default-dark">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark whitespace-nowrap transition-colors hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark"
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Mobile: enter classroom */}
        <div className="sm:hidden">
          <button
            type="button"
            onClick={onEnterClassroom}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-bg-dark text-white transition-opacity hover:opacity-90"
          >
            <DoorOpenIcon className="w-4 h-4" />
            Enter Classroom
          </button>
        </div>
      </div>
    </div>
  );
}
