import { InfoIcon } from "../../../../components/ui/icons";

export default function CoursesRegistrationNote() {
    return (
        <div className="p-4 border border-border-accent-default-light dark:border-border-accent-default-dark bg-bg-surface-accent-default-light/30 dark:bg-bg-surface-accent-default-dark/30 rounded-md">
            <div className="relative px-7">
                <span className="absolute top-0 left-0 rounded-full">
                    <InfoIcon className="w-5 h-5 text-bg-fill-primary-active-light dark:text-bg-fill-primary-active-dark" />
                </span>
                <h4 className="mb-1 font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark">Registration Deadline</h4>
                <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">You have until <strong>January 15, 2024</strong> to finalize your course selection.</p>
            </div>
        </div>
    );
}