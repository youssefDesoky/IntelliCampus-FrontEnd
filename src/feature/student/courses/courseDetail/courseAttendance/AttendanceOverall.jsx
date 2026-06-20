import CircularProgress from "../../../../../components/ui/CircularProgress";
import BaseComponent from "../../../../../components/ui/BaseComponent";

export default function AttendanceOverall({ attendance }) {
    const { percentage, attendedSessions, missedSessions } = attendance;

    const attendanceSummary = percentage >= 75
        ? "Your attendance is strong. Keep the pace steady."
        : percentage >= 50
        ? "Your attendance is fine, but it needs more consistency."
        : "Attendance is falling behind. Try to attend more sessions.";

    const attendanceStatus = percentage >= 85
        ? "Excellent"
        : percentage >= 75
        ? "Good"
        : percentage >= 50
        ? "Needs focus"
        : "At risk";

    const attendanceStatusClass = percentage >= 85
        ? "bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark text-text-success-active-light dark:text-text-success-active-dark"
        : percentage >= 75
        ? "bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark"
        : percentage >= 50
        ? "bg-bg-surface-amber-default-light dark:bg-bg-surface-amber-default-dark text-text-warning-active-light dark:text-text-warning-active-dark"
        : "bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark text-text-danger-active-light dark:text-text-danger-active-dark";

    return (
        <BaseComponent
            className="lg:col-span-1 h-full flex flex-col"
            contentClassName="flex flex-1 flex-col justify-center"
            title="Overall Attendance"
            description="Your attendance snapshot for the current course."
            componentButton={
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${attendanceStatusClass}`}>
                    {attendanceStatus}
                </span>
            }
        >
            <div className="flex flex-col items-center text-center gap-5">
                <CircularProgress progress={percentage} size={140} />
                <p className="text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">{attendanceSummary}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-text-secondary-light dark:text-text-secondary-dark mb-1">Attended</p>
                    <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{attendedSessions}</p>
                </div>
                <div className="rounded-xl bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-text-secondary-light dark:text-text-secondary-dark mb-1">Missed</p>
                    <p className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{missedSessions}</p>
                </div>
            </div>
        </BaseComponent>
    );
}