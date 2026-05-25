import { ClockIcon, LocationDotIcon, UserTieIcon } from "../../../../components/ui/icons";

export default function ClassItem({classInfo}) {
    const title = classInfo?.title || classInfo?.name || "Upcoming Class";
    const time = classInfo?.time || "10:00 AM - 11:00 AM";
    const startsIn = classInfo?.startsIn || "in 30 minutes";
    const room = classInfo?.room || "Room TBA";
    const professor = classInfo?.professor || "Instructor TBA";
    const duration = classInfo?.duration || "90 mins";
    const professorAvatar = classInfo?.professorAvatar || "/images/students/youssefAhmed/profile.png";

    const rawStatus = String(classInfo?.status || classInfo?.state || "").toLowerCase();
    const startsInText = String(startsIn).toLowerCase();

    let classStatus = "upcoming";
    if (rawStatus.includes("cancel")) {
        classStatus = "cancelled";
    } else if (rawStatus.includes("complete") || rawStatus.includes("done") || rawStatus.includes("end")) {
        classStatus = "completed";
    } else if (rawStatus.includes("ongoing") || rawStatus.includes("live") || rawStatus.includes("progress") || rawStatus.includes("start")) {
        classStatus = "ongoing";
    } else if (!rawStatus) {
        if (startsInText.includes("now") || startsInText.includes("ongoing") || startsInText.includes("started")) {
            classStatus = "ongoing";
        } else if (startsInText.includes("end") || startsInText.includes("complete") || startsInText.includes("done")) {
            classStatus = "completed";
        } else if (startsInText.includes("cancel")) {
            classStatus = "cancelled";
        }
    }

    const statusMeta = {
        upcoming: {
            label: "Upcoming",
            classes: "bg-bg-surface-blue-default-light/60 dark:bg-bg-surface-blue-default-dark/60 text-text-secondary-default-light dark:text-text-secondary-default-dark",
        },
        ongoing: {
            label: "Ongoing",
            classes: "bg-bg-fill-warning-default-light/20 dark:bg-bg-fill-warning-default-dark/20 text-text-warning-default-light dark:text-text-warning-default-dark",
        },
        completed: {
            label: "Completed",
            classes: "bg-bg-surface-success-default-light/20 dark:bg-bg-surface-success-default-dark/20 text-text-success-default-light dark:text-text-success-default-dark",
        },
        cancelled: {
            label: "Cancelled",
            classes: "bg-bg-surface-danger-default-light/20 dark:bg-bg-surface-danger-default-dark/20 text-text-danger-default-light dark:text-text-danger-default-dark",
        },
    };

    const selectedStatus = statusMeta[classStatus] || statusMeta.upcoming;
    const unifiedStatusLabel = classStatus === "upcoming" ? startsIn : selectedStatus.label;

    return (
        <article
            type="class-item"
            className="group relative mb-2 overflow-hidden rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-bg-fill-accent-default-light/40 dark:hover:border-bg-fill-accent-default-dark/40"
        >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-bg-fill-accent-default-light to-bg-fill-info-default-light dark:from-bg-fill-accent-default-dark dark:to-bg-fill-info-default-dark" />

            <div className="pl-5 pr-4 md:pl-6 md:pr-5 py-5 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/40 dark:bg-bg-surface-secondary-default-dark/40">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Class Time</p>
                        <p className="mt-1 text-base md:text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{time}</p>
                    </div>

                    <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${selectedStatus.classes}`}>
                        {unifiedStatusLabel}
                    </span>
                </div>

                <h3 className="mt-3 text-xl md:text-2xl font-bold leading-tight text-text-primary-default-light dark:text-text-primary-default-dark">{title}</h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
                    <span className="inline-flex w-full items-center gap-1.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark px-2.5 py-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        <LocationDotIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{room}</span>
                    </span>
                    <span className="inline-flex w-full items-center gap-1.5 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark px-2.5 py-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        <ClockIcon className="h-4.5 w-4.5 shrink-0" />
                        <span>Duration: {duration}</span>
                    </span>
                </div>
            </div>

            <div className="pl-5 pr-4 md:pl-6 md:pr-5 py-4 flex items-center gap-3 bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80">
                <img
                    src={professorAvatar}
                    alt={professor}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-bg-surface-blue-default-light dark:ring-bg-surface-blue-default-dark"
                />
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary-default-light dark:text-text-tertiary-default-dark">Instructor</p>
                    <h4 className="mt-0.5 truncate font-semibold text-text-primary-default-light dark:text-text-primary-default-dark inline-flex items-center gap-2">
                        <UserTieIcon className="h-4 w-4" />
                        {professor}
                    </h4>
                </div>
            </div>
        </article>
    );
}