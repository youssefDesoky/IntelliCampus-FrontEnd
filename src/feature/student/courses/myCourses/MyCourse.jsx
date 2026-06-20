import { Link } from 'react-router-dom';
import ProgressBox from '../../../../components/ui/ProgressBox';

// Icons
import { 
    UserTieIcon, 
    UsersIcon,
    CalendarIcon, 
    LocationDotIcon, 
    CheckIcon, 
    XIcon, 
    ExclamationIcon, 
    StarIcon, 
    FileLinesIcon,
    ClipboardCheckIcon
} from '../../../../components/ui/icons';

/** Small amber label for fields the backend doesn't supply yet */
function MissingLabel({ field }) {
    return (
        <span className="text-xs text-amber-500 italic">⚠ {field} is missing</span>
    );
}

function getCourseTypeStyles(isElective) {
    return isElective 
      ? {
          borderLeft: "border-l-border-success-default-light dark:border-l-border-success-default-dark",
          bg: "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark",
          text: "text-text-success-default-light dark:text-text-success-default-dark",
        }
      : {
          borderLeft: "border-l-border-accent-default-light dark:border-l-border-accent-default-dark",
          bg: "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark",
          text: "text-text-accent-default-light dark:text-text-accent-default-dark",
        };
}

/** Reusable component for bottom statistics (Attendance, Grades, etc.) */
function StatItem({ icon: Icon, label, value, colorClass, missingField }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`p-2 rounded-md flex items-center justify-center ${colorClass}`}>
                {Icon}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">
                    {label}
                </span>
                {value != null ? (
                    <span className="text-sm font-semibold">{value}</span>
                ) : (
                    <MissingLabel field={missingField || label} />
                )}
            </div>
        </div>
    );
}

export default function MyCourse({ course, role, viewMode, isMobile }) {
    const isInstructor = role === 'instructor';
    const isCompact = isMobile || viewMode === "grid";
    const typeStyles = getCourseTypeStyles(course.isElective);

    // --- Progress Calculation ---
    let progress = null;
    let isProgressMissing = false;

    if (isInstructor) {
        if (course.weeksCompleted != null && course.weeks != null) {
            const totalWeeks = course.weeks?.length ?? 0;
            progress = totalWeeks > 0 ? Math.round((course.weeksCompleted / totalWeeks) * 100) : 0;
        } else {
            isProgressMissing = true;
        }
    } else {
        if (course.progress != null) {
            progress = course.progress;
        } else if (course.weeks > 0 && course.weeksCompleted != null) {
            progress = Math.round((course.weeksCompleted / course.weeks) * 100);
        } else {
            isProgressMissing = true;
        }
    }

    // --- Determine Completion Status ---
    // Derived from progress, but can be updated to `course.status === 'completed'` if the backend supports it
    const isCompleted = progress === 100;

    // --- Student Attendance Icon Logic ---
    const getStudentAttendanceData = (attendance) => {
        if (attendance == null) return { icon: null, color: "bg-gray-200" };
        if (attendance > 75) return { icon: <CheckIcon className="w-5 h-5" />, color: "bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark" };
        if (attendance >= 50) return { icon: <ExclamationIcon className="w-5 h-5" />, color: "bg-bg-surface-warning-default-light dark:bg-bg-surface-warning-default-dark" };
        return { icon: <XIcon className="w-5 h-5" />, color: "bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark" };
    };
    const studentAttendance = getStudentAttendanceData(course.attendance);

    return (
        <div className={`grid grid-cols-5 gap-4 rounded-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-sm shadow-shadow-light relative hover:shadow-lg dark:hover:shadow-shadow-dark mb-4 ${isCompact ? "p-4 border-l-4" : "p-6 border-l-6"} ${typeStyles.borderLeft}`}>
            
            {/* Left Content Area */}
            <div className={`${isCompact ? "col-span-5" : "col-span-4"}`}>
                
                {/* Header (Code, Semester, Status Badge) */}
                <div className={`flex ${isCompact ? "flex-row-reverse" : "flex-col"} justify-between mb-2`}>
                    <div className="flex gap-2.5 items-center mb-2 flex-wrap">
                        {!isMobile && (
                            <span className="px-2 py-1 rounded-full border text-text-primary-active-light dark:text-text-primary-active-dark text-xs font-semibold">
                                {isInstructor ? course.courseCode : course.courseId}
                            </span>
                        )}
                        {course.semester != null 
                            ? <span className="text-text-secondary-active-light dark:text-text-secondary-active-dark text-xs font-normal">{course.semester}</span>
                            : <MissingLabel field="semester" />
                        }

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                            isCompleted 
                                ? "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark text-text-success-default-light dark:text-text-success-default-dark"
                                : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark border border-border-secondary-default-light dark:border-border-secondary-default-dark"
                        }`}>
                            {isCompleted ? "Completed" : "In Progress"}
                        </span>
                    </div>
                    <h2 className={`${isMobile ? "text-lg" : "text-xl"} font-bold mb-2`}>{course.courseName}</h2>
                </div>
                
                {/* Meta Info (Professor / Schedule & Room) */}
                <div className={`flex flex-row gap-4 ${!isInstructor ? "text-center" : ""} text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-4`}>
                    {!isInstructor ? (
                        <div className="flex gap-1">
                            {!isMobile && <UserTieIcon className="w-5 h-5 place-self-center" />}
                            {course.professorName != null ? <span className="text-sm">{course.professorName}</span> : <MissingLabel field="professorName" />}
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-1">
                                {!isMobile && <CalendarIcon className="w-5 h-5 place-self-center" />}
                                {course.schedule != null ? <span className="text-sm">{course.schedule}</span> : <MissingLabel field="schedule" />}
                            </div>
                            <div className="h-auto w-px bg-text-secondary-active-light dark:bg-text-secondary-active-dark" />
                        </>
                    )}

                    <div className="flex gap-1">
                        {!isMobile && <LocationDotIcon className="w-5 h-5 place-self-center" />}
                        {course.room != null ? <span className="text-sm">{course.room}</span> : <MissingLabel field="room" />}
                    </div>
                </div>

                {/* Progress Box */}
                {!isProgressMissing ? (
                    <ProgressBox progress={progress} backgroundColor={typeStyles.bg} height={isCompact ? "h-2" : "h-2.5"}>
                        <p className={`text-sm font-medium ${typeStyles.text}`}>Course Progress</p>
                        <span className={`text-sm font-semibold ${typeStyles.text}`}>{progress}%</span>
                    </ProgressBox>
                ) : (
                    <MissingLabel field={isInstructor ? "progress (weeksCompleted & weeks)" : "progress"} />
                )}

                {/* Statistics Row */}
                <div className={`flex flex-row ${isCompact ? "gap-3" : "gap-6"} text-sm mt-6`}>
                    {isInstructor ? (
                        <>
                            <StatItem icon={<UsersIcon className="w-5 h-5" />} label="Students" value={course.numOfStudents} colorClass="bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark" />
                            <StatItem icon={<ClipboardCheckIcon className="w-5 h-5" />} label="Attendance" value={course.attendance} colorClass="bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark" />
                            <StatItem icon={<StarIcon className="w-5 h-5" />} label="Grade" value={course.grade} colorClass="bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark" />
                        </>
                    ) : (
                        <>
                            <StatItem 
                                icon={studentAttendance.icon} 
                                label="Attendance" 
                                value={course.attendance != null ? `${course.attendance}%` : null} 
                                colorClass={studentAttendance.color} 
                            />
                            <StatItem 
                                icon={<FileLinesIcon className="w-5 h-5" />} 
                                label="Assignments" 
                                value={course.assignments != null ? `${course.assignments.filter(a => a.status === "Submitted").length}/${course.assignments.length}` : null} 
                                colorClass="bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark" 
                            />
                            <StatItem 
                                icon={<StarIcon className="w-5 h-5" />} 
                                label="Grade" 
                                value={course.grade} 
                                colorClass="bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark" 
                            />
                        </>
                    )}
                </div>

                {course.isElective == null && (
                    <div className="mt-3"><MissingLabel field="isElective" /></div>
                )}
            </div>

            {/* Right Action Area */}
            <div className={`flex gap-4 ${isCompact ? "col-span-5 border-t border-t-border-accent-default-light dark:border-t-border-accent-default-dark pt-4 mt-1" : "col-span-1 flex-col items-end"}`}>
                <div className={`flex gap-2 w-full ${isCompact ? "flex-row justify-end" : "flex-col items-end"}`}>
                    <Link 
                        to={isInstructor ? `/instructor/courses/${course.courseId}` : `/courses/${course.courseId}`}
                        className={`bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark place-content-center font-bold rounded-md border border-border-accent-default-light dark:border-border-accent-default-dark text-center ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`}
                    >
                        {isMobile ? "Classroom" : "Enter Classroom"}
                    </Link>

                    {!isInstructor && (
                        <Link 
                            to={`/courses/${course.courseId}/materials`}
                            className={`bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark place-content-center font-bold rounded-md border border-border-secondary-default-light dark:border-border-secondary-default-dark text-center ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"}`}
                        >
                            {isMobile ? "Materials" : "View Materials"}
                        </Link>
                    )}
                </div>
            </div>
            
        </div>
    );
}