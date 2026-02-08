import SelectBox from "../../../../components/ui/SelectBox";
import SpanRounded from "../../../../components/ui/SpanRounded";

import { 
    CalendarIcon, 
    LocationDotIcon, 
    LockIconDark , 
    PlusIcon, 
    XIcon 
} from "../../../../components/ui/icons";


export default function CourseCard({course, cardType = "disabled"}) {
    return(
        <div className="min-w-90 h-55 course-card relative flex flex-col justify-between gap-4 p-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg shadow-sm shadow-shadow-light hover:shadow-md dark:shadow-shadow-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
            <button className={`absolute top-0 left-full transform -translate-x-full p-4 font-extrabold text-text-accent-active-light dark:text-text-accent-active-dark`}>
                { cardType === "disabled" ? 
                    <LockIconDark className="w-8 h-8 rounded-full p-1.5 bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark"/> :
                    cardType === "available" ? <PlusIcon className="w-8 h-8 rounded-full p-1.5 bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark"/> :
                    <XIcon className="w-8 h-8 rounded-full p-1.5 text-text-danger-active-light dark:text-text-danger-active-dark hover:bg-bg-surface-danger-hover-light dark:hover:bg-bg-surface-danger-hover-dark hover:text-text-danger-hover-light dark:hover:text-text-danger-hover-dark"/>
                }
            </button>

            <div className="flex-1 flex flex-col justify-center space-y-2">
                <div className="flex flex-row gap-4">
                    <SpanRounded>{course.id}</SpanRounded>
                    <SpanRounded>{course.creditHours} Credits</SpanRounded>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-text-primary-active-light dark:text-text-primary-active-dark truncate">{course.title}</h3>
                    <p className="text-md font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark">{course.professor}</p>
                    <div className="flex flex-row gap-6 text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        <span className="text-sm flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-icon-primary-default-light dark:text-icon-primary-default-dark" />
                            {course.schedule}
                        </span>
                        
                        <span className="text-sm flex items-center gap-2">
                            <LocationDotIcon className="w-5 h-5 text-icon-primary-default-light dark:text-icon-primary-default-dark" />
                            {course.room}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-3 flex flex-row gap-8 justify-between items-center border-t border-t-border-primary-default-light dark:border-t-border-primary-default-dark w-full text-text-tertiary-active-light dark:text-text-tertiary-active-dark">
                { cardType === "selected" ? (
                    <>
                        <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark whitespace-nowrap">
                            Select Section:
                        </p>
                        <SelectBox
                            className="shrink-0 w-40 md:w-50"
                            label=""
                            options={[
                                { value: 's01', label: 'Section 01' },
                                { value: 's02', label: 'Section 02' },
                                { value: 's03', label: 'Section 03' },
                                { value: 's04', label: 'Section 04' },
                            ]}
                            selectedOption={{ value: 's01', label: 'Section 01' }}
                            yPadding="py-1.5"
                            compact={true}
                            showLabel={false}
                        />
                    </>
                ) : (
                    <p className="text-sm">
                        {course.preRequisites 
                            ? course.preRequisites.map((coursePreReq, index) => (
                                <span key={coursePreReq.id}>
                                    {coursePreReq.id}{index < course.preRequisites.length - 1 && " - "}
                                </span>
                            ))
                            : "No prerequisites are needed"}
                    </p>
                )}
            </div> 
        </div>
    );
}