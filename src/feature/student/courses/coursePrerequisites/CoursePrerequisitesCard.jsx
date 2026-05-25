import { ArrowRightIcon, BookIcon, CheckIcon } from "../../../../components/ui/icons";

export default function CoursePrerequisitesCard({ course = {} }) {
    // Explicit safe fallbacks
    const {
        code = "TBD",
        creditHours = 0,
        title = "Untitled Course",
        prerequisites = []
    } = course;

    const safePrerequisites = Array.isArray(prerequisites) ? prerequisites : [];
    const hasPrerequisites = safePrerequisites.length > 0;

    return (
        <article className="group relative flex flex-col h-full min-w-0 overflow-hidden rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            
            <header className="relative bg-gradient-to-br from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark p-6 border-b border-border-primary-default-light/50 dark:border-border-primary-default-dark/50">
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-2xl font-black tracking-tight text-text-primary-default-light dark:text-text-primary-default-dark font-mono uppercase">
                        {code}
                    </h2>
                    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark px-3 py-1 text-xs font-bold text-white shadow-sm">
                        {creditHours} Credits
                    </span>
                </div>
                
                <h3 
                    className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark leading-snug line-clamp-2 transition-colors group-hover:text-text-accent-active-light dark:group-hover:text-text-accent-active-dark"
                    title={title}
                >
                    {title}
                </h3>
            </header>

            <div className="flex-1 p-6 flex flex-col justify-between">                
                <div className="w-full mb-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        <BookIcon size={16} aria-hidden="true" className="shrink-0 text-text-accent-active-light dark:text-text-accent-active-dark" />
                        <span>Required Pathway</span>
                    </div>
                </div>

                {hasPrerequisites ? (
                    <div className="w-full mt-auto">
                        <ul 
                            className="grid grid-flow-col gap-3" 
                            role="list" 
                            aria-label={`Prerequisites for ${title}`}
                            style={{
                                gridTemplateColumns: `repeat(${safePrerequisites.length}, minmax(0, 1fr))`
                            }}
                        >
                            {safePrerequisites.map((prereq, index) => {
                                const prereqId = prereq?.id || `fallback-id-${index}`;
                                const prereqTitle = prereq?.title || "Untitled Prerequisite";

                                return (
                                    <li key={prereqId} className="group/item flex items-center relative">
                                        
                                        {/* Horizontal Line Connector */}
                                        {safePrerequisites.length > 1 && (
                                            <div 
                                                className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border-primary-default-light dark:bg-border-primary-default-dark group-first/item:left-1/2 group-last/item:right-1/2" 
                                                aria-hidden="true" 
                                            />
                                        )}

                                        {/* Node Capsule */}
                                        <div className="relative z-10 w-full flex items-center gap-2.5 rounded-lg border border-border-primary-default-light/60 dark:border-border-primary-default-dark/60 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark py-2 px-3 transition-colors hover:border-text-accent-active-light/50 dark:hover:border-text-accent-active-dark/50 hover:bg-bg-surface-secondary-default-light/50 dark:hover:bg-bg-surface-secondary-default-dark/50 min-w-0">
                                            
                                            {/* Enlarged Node Dot */}
                                            <div className="h-3 w-3 rounded-full bg-text-accent-active-light dark:bg-text-accent-active-dark ring-[3px] ring-bg-surface-primary-default-light dark:ring-bg-surface-primary-default-dark transition-transform duration-300 group-hover/item:scale-125 shrink-0" aria-hidden="true" />
                                            
                                            {/* Text Details */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[9px] font-bold text-text-accent-active-light dark:text-text-accent-active-dark uppercase tracking-wider font-mono leading-none">
                                                    {prereqId}
                                                </p>
                                                <p className="text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate mt-1.5" title={prereqTitle}>
                                                    {prereqTitle}
                                                </p>
                                            </div>
                                        </div>

                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="mt-auto flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border-primary-default-light/50 dark:border-border-primary-default-dark/50 bg-bg-surface-secondary-default-light/30 dark:bg-bg-surface-secondary-default-dark/30 p-5 text-center transition-colors group-hover:border-emerald-500/30 dark:group-hover:border-emerald-400/30 group-hover:bg-emerald-50/50 dark:group-hover:bg-emerald-900/10">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckIcon size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                No Prerequisites
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}