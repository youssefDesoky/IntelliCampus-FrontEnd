import { Link } from 'react-router-dom';

import Button from '../../../../components/ui/Button';
import ProgressBox from '../../../../components/ui/ProgressBox';

// Icons
import { 
    BellIconLight, 
    EllipsisVerticalIcon, 
    UserTieIcon, 
    CalendarIcon, 
    LocationDotIcon, 
    CheckIcon, 
    XIcon, 
    ExclamationIcon, 
    StarIcon, 
    FileLinesIcon
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

export default function MyCourse({course, viewMode, isMobile}) {
    const typeStyles = getCourseTypeStyles(course.isElective);

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
                
                <div className={`flex flex-row gap-4 text-center text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mb-4`}>
                    <div className="flex gap-1">
                        {!isMobile && <UserTieIcon className={`w-5 h-5 place-self-center`} />}
                        {course.professor != null
                            ? <span className={`text-sm`}>{course.professor}</span>
                            : <MissingLabel field="professor" />
                        }
                    </div>
                    
                    <div className="flex gap-1 px-2 border-x border-text-secondary-active-light dark:border-text-secondary-active-dark">
                        {!isMobile && <CalendarIcon className={`w-5 h-5 place-self-center`} />}
                        {course.schedule != null
                            ? <span className={`text-sm`}>{course.schedule}</span>
                            : <MissingLabel field="schedule" />
                        }
                    </div>

                    <div className="flex gap-1">
                        {!isMobile && <LocationDotIcon className={`w-5 h-5 place-self-center`} />}
                        {course.room != null
                            ? <span className={`text-sm`}>{course.room}</span>
                            : <MissingLabel field="room" />
                        }
                    </div>
                </div>

                {course.progress != null
                    ? (
                        <ProgressBox progress={course.progress} backgroundColor={typeStyles.bg} height={isMobile || viewMode === "grid" ? "h-2" : "h-2.5"}>
                            <p className={`text-sm font-medium ${typeStyles.text}`} >Course Progress</p>
                            <span className={`text-sm font-semibold ${typeStyles.text}`}>{course.progress}%</span>
                        </ProgressBox>
                    )
                    : <MissingLabel field="progress" />
                }

                <div className={`flex flex-row ${isMobile || viewMode === "grid" ? "gap-3" : "gap-6"} text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark mt-6`}>
                    <div className="flex items-center gap-2">
                        {course.attendance != null ? (
                            <>
                                <div className={`p-2 rounded-md flex items-center justify-center ${course.attendance > 75 ? 'bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark' : course.attendance >= 50 ? 'bg-bg-surface-warning-default-light dark:bg-bg-surface-warning-default-dark' : 'bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark'}`}>
                                    {course.attendance > 75 ? <CheckIcon className="w-5 h-5 inline-block" /> : course.attendance >= 50 ? <ExclamationIcon className="w-5 h-5 inline-block" /> : <XIcon className="w-5 h-5 inline-block" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Attendance</span>
                                    <span className="text-sm font-semibold">{course.attendance}%</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Attendance</span>
                                <MissingLabel field="attendance" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {course.assignments != null ? (
                            <>
                                <div className="p-2 bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark rounded-md flex items-center justify-center">
                                    <FileLinesIcon className="w-5 h-5 inline-block" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Assignments</span>
                                    <span className="text-sm font-semibold">
                                        {course.assignments.filter(a => a.status === "Submitted").length}
                                        /
                                        {course.assignments.length}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Assignments</span>
                                <MissingLabel field="assignments" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {course.grade != null ? (
                            <>
                                <div className="p-2 bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark rounded-md flex items-center justify-center">
                                    <StarIcon className="w-5 h-5 inline-block" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Grade</span>
                                    <span className="text-sm font-semibold">{course.grade}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col">
                                <span className="text-xs font-normal text-text-secondary-active-light dark:text-text-secondary-active-dark">Grade</span>
                                <MissingLabel field="grade" />
                            </div>
                        )}
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
                        to={`/courses/${course.courseId}`}
                        className={` bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark place-content-center font-bold ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} rounded-md border border-border-accent-default-light dark:border-border-accent-default-dark`}
                    >
                        {isMobile ? "Classroom" : "Enter Classroom"}
                    </Link>

                    <Link 
                        to={`/courses/${course.courseId}/materials`}
                        className={`bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark place-content-center font-bold ${isMobile ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm"} rounded-md border border-border-secondary-default-light dark:border-border-secondary-default-dark`}
                    >
                        {isMobile ? "Materials" : "View Materials"}
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