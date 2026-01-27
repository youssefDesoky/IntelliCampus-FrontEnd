import SpanRounded from "../../../../ui/SpanRounded";

export default function CoursePrerequisitesCard({ course }) {
    return (
        <div className="min-w-90 course-card relative flex flex-col gap-4 p-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg shadow-sm shadow-shadow-light hover:shadow-md dark:shadow-shadow-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
            <div className="space-y-2">
                <div className="flex flex-row gap-4">
                    <SpanRounded>{course.id}</SpanRounded>
                    <SpanRounded>{course.creditHours} Credits</SpanRounded>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-text-primary-active-light dark:text-text-primary-active-dark truncate">{course.title}</h3>
                    <p className="text-md font-medium text-text-secondary-active-light dark:text-text-secondary-active-dark">Prerequisite: {course.prerequisites.map(prerequisite => prerequisite.id + " " + prerequisite.title).join(", ")}</p>
                </div>
            </div>
        </div>
    );
}