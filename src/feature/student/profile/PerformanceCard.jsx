const performanceStats = [
    {
        label: "Cumulative GPA",
        value: "3.8 / 4.0",
        trend: "+0.1 ",
        positive: true,
        percentage: "95%",
        colSpan: 1
    },
    {
        label: "Current Courses",
        value: "6",
        trend: "Enrolled",
        positive: true,
        percentage: "60%",
        colSpan: 1
    },
    {
        label: "Completed Courses",
        value: "28",
        trend: "Total",
        positive: true,
        colSpan: 1,
        percentage: "100%",
        subStats: [
            { label: "Zero Hours", value: "3 Courses" },
            { label: "2 Hours", value: "10 Courses" },
            { label: "3 Hours", value: "15 Courses" },
        ]
    },
    {
        label: "Credits Earned",
        value: "118 / 130",
        trend: "12 remaining",
        colSpan: 1,
        positive: null,
        percentage: "90%",
        subStats: [
            { label: "University Required (2 Hrs)", value: "14 Credits" },
            { label: "Specialization Required (3 Hrs)", value: "104 Credits" }
        ]
    },
];

export default function PerformanceCard() {
    return (
        <div className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark">
                <div>
                    <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                        Academic Performance
                    </h3>
                    <p className="text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                        Current standing · cumulative
                    </p>
                </div>
                <button className="text-[11px] font-semibold text-text-accent-active-light dark:text-text-accent-active-dark hover:underline">
                    Full transcript
                </button>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {performanceStats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-colors group flex flex-col ${
                            stat.colSpan === 2 ? 'sm:col-span-2' : 'sm:col-span-1'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${
                                        stat.positive === true
                                            ? "bg-green-400"
                                            : stat.positive === false
                                            ? "bg-red-400"
                                            : "bg-text-tertiary-default-light dark:bg-text-tertiary-default-dark opacity-40"
                                    }`}
                                />
                                <div className="min-w-0">
                                    <span className="block text-[11px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                        {stat.label}
                                    </span>
                                    <span className="block text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark leading-tight">
                                        {stat.value}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    stat.positive === true
                                        ? "bg-green-400/10 text-green-500 border border-green-400/20"
                                        : stat.positive === false
                                        ? "bg-red-400/10 text-red-400 border border-red-400/20"
                                        : "bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark"
                                }`}
                            >
                                {stat.trend}
                            </span>
                        </div>

                        {stat.subStats && (
                            <div className="mb-3 grid grid-cols-1 gap-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-2.5">
                                {stat.subStats.map((sub) => (
                                    <div key={sub.label} className="flex justify-between text-xs">
                                        <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{sub.label}</span>
                                        <span className="font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">{sub.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="h-1.5 mt-auto rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark overflow-hidden">
                            <div
                                className={`h-full rounded-full ${
                                    stat.positive === true
                                        ? "bg-green-400"
                                        : stat.positive === false
                                        ? "bg-red-400"
                                        : "bg-text-accent-active-light dark:bg-text-accent-active-dark"
                                }`}
                                style={{ width: stat.percentage || '0%' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
