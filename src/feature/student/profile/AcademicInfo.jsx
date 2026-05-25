import BaseComponent from "../../../components/ui/BaseComponent";
import { UserIcon, BookIcon, CalendarDaysIcon, MailIconDark, HashIcon } from "../../../components/ui/icons";

const fieldConfig = {
    studentId: { icon: HashIcon, colSpan: "sm:col-span-1" },
    specialization: { icon: BookIcon, colSpan: "sm:col-span-1" },
    year: { icon: CalendarDaysIcon, colSpan: "sm:col-span-1" },
    semester: { icon: CalendarDaysIcon, colSpan: "sm:col-span-1" },
    email: { icon: MailIconDark, colSpan: "sm:col-span-2" },
    phone: { icon: UserIcon, colSpan: "sm:col-span-2" }, // Stretched to balance the contact layer blocks
};

const defaultIcon = BookIcon;

export default function AcademicInfo({ user, className = "" }) {
    return (
        <BaseComponent
            title="Academic Registration"
            description="Verified enrollment criteria and administrative access paths."
            className={className}
            contentClassName="space-y-0"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {user.AcademicInformation.map((info, index) => {
                    const config = fieldConfig[info.name] || { icon: defaultIcon, colSpan: "sm:col-span-1" };
                    const Icon = config.icon;
                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-accent-default-light dark:hover:border-border-accent-default-dark transition-all group ${config.colSpan}`}
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-accent-active-light dark:text-text-accent-active-dark shadow-xs group-hover:scale-105 transition-transform">
                                <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{info.label}</p>
                                <p className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-0.5 truncate">{info.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </BaseComponent>
    );
}