import { useState } from "react";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import {
    HashIcon,
    BookIcon,
    CalendarDaysIcon,
    EyeIcon,
    DownloadIcon,
    XIcon,
} from "../../../components/ui/icons";

const academicInfo = [
    { name: "studentId",      label: "Student ID",     value: "S12345678",                      icon: HashIcon },
    { name: "specialization", label: "Specialization", value: "Information Systems",             icon: BookIcon },
    { name: "year",           label: "Academic Year",  value: "Senior – 4th Year",               icon: CalendarDaysIcon },
    { name: "semester",       label: "Semester",       value: "Spring 2026",                    icon: CalendarDaysIcon },
    { name: "bylaw",          label: "Bylaw",          value: "Student Bylaw 2026",              icon: BookIcon },
];

const bylawDocumentUrl = "/documents/san3aa_documentation.pdf";

export default function AcademicInfoCard() {
    const [isBylawOpen, setIsBylawOpen] = useState(false);

    return (
        <>
            <div className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark">
                    <div>
                        <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                            Academic Registration
                        </h3>
                        <p className="text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                            Verified enrollment data · Spring 2026
                        </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-400/10 text-green-500 border border-green-400/20">
                        Active
                    </span>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {academicInfo.map((field) => {
                        const Icon = field.icon;
                        const isBylaw = field.name === "bylaw";

                        return (
                            <div
                                key={field.name}
                                className={`flex items-center gap-3.5 p-3.5 rounded-2xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-all group ${isBylaw ? "sm:col-span-2" : ""}`}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark group-hover:scale-105 transition-transform">
                                    <Icon size={15} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                                        {field.label}
                                    </p>
                                    <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-0.5 truncate">
                                        {field.value}
                                    </p>
                                </div>
                                {isBylaw && (
                                    <button
                                        type="button"
                                        onClick={() => setIsBylawOpen(true)}
                                        className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-accent-active-light dark:hover:text-text-accent-active-dark transition-colors"
                                        aria-label="Open bylaw"
                                    >
                                        <EyeIcon size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {isBylawOpen && (
                <ModelOverlay onClose={() => setIsBylawOpen(false)} maxWidth="max-w-5xl">
                    <div className="w-full overflow-hidden rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl">
                        <div className="flex items-center justify-between border-b border-border-primary-default-light dark:border-border-primary-default-dark px-5 py-4">
                            <div>
                                <h4 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Student Bylaw</h4>
                                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">Policy document preview</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={bylawDocumentUrl}
                                    download
                                    className="inline-flex items-center gap-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark px-3.5 py-2 text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                                >
                                    <DownloadIcon size={14} />
                                    Download
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setIsBylawOpen(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                                    aria-label="Close bylaw preview"
                                >
                                    <XIcon size={14} />
                                </button>
                            </div>
                        </div>
                        <MaterialPreview
                            type={0}
                            title="student-bylaw.pdf"
                            viewUrl={bylawDocumentUrl}
                            downloadUrl={bylawDocumentUrl}
                        />
                    </div>
                </ModelOverlay>
            )}
        </>
    );
}
