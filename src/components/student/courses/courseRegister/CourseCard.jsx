import SelectBox from "../../../../ui/SelectBox";
import SpanRounded from "../../../../ui/SpanRounded";

import { CalendarIcon, LocationDotIcon, LockIconDark , PlusIcon, XIcon } from "../../../../ui/icons";


export default function CourseCard({course, cardType = "disabled"}) {
    return(
        <div className="min-w-90 h-55 course-card relative flex flex-col gap-4 p-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg shadow-sm shadow-shadow-light hover:shadow-md dark:shadow-shadow-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
            <button className={`absolute top-0 left-full transform -translate-x-full p-4 font-extrabold text-text-accent-active-light dark:text-text-accent-active-dark`}>
                { cardType === "disabled" ? 
                    <LockIconDark className="w-8 h-8 bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark rounded-full p-1.5"/> :
                    cardType === "available" ? <PlusIcon className="w-8 h-8 bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark rounded-full p-1.5"/> :
                    <XIcon className="w-8 h-8 bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark text-text-danger-active-light dark:text-text-danger-active-dark rounded-full p-1.5"/>
                }
            </button>

            <div className="space-y-2">
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

            <div className="sticky top-full h-8 pt-3 flex flex-row gap-2 justify-between items-center border-t border-t-border-primary-default-light dark:border-t-border-primary-default-dark w-full text-text-tertiary-active-light dark:text-text-tertiary-active-dark">
                { cardType === "selected" ?
                    <SelectBox
                        className="w-full flex justify-between"
                        label="Section"
                        options={[
                            { value: 's01', label: 'Section 01' },
                            { value: 's02', label: 'Section 02' },
                            { value: 's03', label: 'Section 03' },
                            { value: 's04', label: 'Section 04' },
                        ]}
                        selectedOption='s01'
                        yPadding="py-1"
                    />
                    : 
                    <div className="text-sm">
                        {course.preRequisites ? 
                            course.preRequisites.map(coursePreReq => <p>{coursePreReq.id}</p>)
                            : <p>No prerequisites are needed</p>}
                    </div>
                }
            </div> 
        </div>
    );
}