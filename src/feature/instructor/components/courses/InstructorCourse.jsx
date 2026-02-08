import { Link } from 'react-router-dom';

import Button from '../../../../components/ui/Button';
import ProgressBox from '../../../../components/ui/ProgressBox';

// Icons
import { 
    BellIconLight, 
    EllipsisVerticalIcon, 
    UsersIcon, 
    CalendarIcon, 
    LocationDotIcon, 
    StarIcon,
    ClipboardCheckIcon
} from '../../../../components/ui/icons';

/** Small amber label for fields the backend doesn't supply yet */
function MissingLabel({ field }) {
    return (
        <span className="text-xs text-amber-500 italic">⚠ {field} is missing from backend</span>
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

export default function InstructorCourse({course, viewMode, isMobile}) {
    const typeStyles = getCourseTypeStyles(course.isElective);
    const weeksCompleted = course.weeksCompleted ?? 0;
    const totalWeeks = course.weeks?.length ?? 0;
    const progress = totalWeeks > 0 ? Math.round((weeksCompleted / totalWeeks) * 100) : 0;

    return(
        <div className={`grid-cols-5 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark grid gap-4 rounded-lg ${isMobile || viewMode === "grid" ? "p-4 border-l-4" : "p-6 border-l-6"} mb-4 shadow-sm shadow-shadow-light relative hover:shadow-lg dark:hover:shadow-shadow-dark ${typeStyles.borderLeft}`}>
            <div className={`${isMobile || viewMode === "grid" ? "col-span-5" : "col-span-4"}`}>
                <div className={`flex ${isMobile || viewMode === "grid" ? "flex-row-reverse" : "flex-col"} justify-between mb-2`}>
                    <div className="flex gap-3 items-center mb-2">
                        <span className={`px-2 py-1 rounded-full border text-text-primary-active-light dark:text-text-primary-active-dark text-xs font-semibold ${isMobile ? "hidden" : ""}`}>{course.courseId}</span>
                        {course.semester != null
                            ? <span className="text-text-secondary-active-light dark:text-text-secondary-active-dark text-xs font-normal">{course.semester}</span>
                            : <MissingLabel field="semester" />
                        }
                    </div>

                    <h2 className={`${isMobile ? "text-lg" : "text-xl"} font-bold mb-2`}>{course.courseName}</h2>
                </div>
                
                <div className={`flex flex-row gap-4 text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-4`}>
                    <div className="flex gap-1">
                        {!isMobile && <CalendarIcon className={`w-5 h-5 place-self-center`} />}
                        {course.schedule != null
                            ? <span className={`text-sm`}>{course.schedule}</span>
                            : <MissingLabel field="schedule" />
                        }
                    </div>

                    <div className="h-auto w-px bg-text-secondary-active-light dark:bg-text-secondary-active-dark" />

                    <div className="flex gap-1">
                        {!isMobile && <LocationDotIcon className={`w-5 h-5 place-self-center`} />}
                        {course.room != null
                            ? <span className={`text-sm`}>{course.room}</span>
                            : <MissingLabel field="room" />
                        }
                    </div>
                </div>

                {course.weeksCompleted != null && course.weeks != null
                    ? (
                        <ProgressBox progress={progress} backgroundColor={typeStyles.bg} height={isMobile || viewMode === "grid" ? "h-2" : "h-2.5"}>
                            <p className={`text-sm font-medium ${typeStyles.text}`}>Course Progress</p>
                            <span className={`text-sm font-semibold ${typeStyles.text}`}>{progress}%</span>
                        </ProgressBox>
                    )
                    : <MissingLabel field="progress (weeksCompleted & weeks)" />
                }

                <div className={`flex flex-row ${isMobile || viewMode === "grid" ? "gap-3" : "gap-6"} text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mt-6`}>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark rounded-md flex items-center justify-center">
                            <UsersIcon className="w-5 h-5 inline-block" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Students</span>
                            {course.numOfStudents != null
                                ? <span className="text-sm font-semibold">{course.numOfStudents}</span>
                                : <MissingLabel field="numOfStudents" />
                            }
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark rounded-md flex items-center justify-center">
                            <ClipboardCheckIcon className="w-5 h-5 inline-block" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Attendance</span>
                            {course.attendance != null
                                ? <span className="text-sm font-semibold">{course.attendance}</span>
                                : <MissingLabel field="attendance" />
                            }
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark rounded-md flex items-center justify-center">
                            <StarIcon className="w-5 h-5 inline-block" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Grade</span>
                            {course.grade != null
                                ? <span className="text-sm font-semibold">{course.grade}</span>
                                : <MissingLabel field="grade" />
                            }
                        </div>
                    </div>
                </div>

                {course.isElective == null && (
                    <div className="mt-3">
                        <MissingLabel field="isElective" />
                    </div>
                )}
            </div>

            <div className={`${isMobile || viewMode === "grid" ? "col-span-5 border-t border-t-border-accent-default-light dark:border-t-border-accent-default-dark pt-4 flex-row justify-between mt-1" : "col-span-1 flex-col items-end"} flex gap-4`}>
                <div className={`${isMobile || viewMode === "grid" ? "flex-row" : "flex-col"} flex gap-2`}>
                    <Link 
                        to={`/instructor/courses/${course.courseId}`}
                        className={`bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark place-content-center font-bold ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} rounded-md border border-border-accent-default-light dark:border-border-accent-default-dark`}
                    >
                        {isMobile ? "Classroom" : "Enter Classroom"}
                    </Link>
                </div>

                <div className="flex flex-row gap-2">
                    <Button className="border border-border-primary-default-light dark:border-border-primary-default-dark p-2 rounded-md">
                        <BellIconLight className="w-5 h-5" />
                    </Button>
                    <Button className="border border-border-primary-default-light dark:border-border-primary-default-dark p-2 rounded-md">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
