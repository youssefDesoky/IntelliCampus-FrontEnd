import { useRouteLoaderData } from "react-router-dom";
import {
    UserIcon,
    UserCheckIcon,
    MailIconDark,
    PhoneIcon,
    LocationDotIcon,
    BuildingIcon,
    StarIcon,
    CheckIcon,
} from "../../../components/ui/icons";
import AccountControlsCard from "../../../feature/student/profile/AccountControlsCard";

function InfoField({ label, value }) {
    return (
        <div className="space-y-0.5">
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark block">{label}</span>
            <span className="font-medium text-text-primary-default-light dark:text-text-primary-default-dark">{value ?? "—"}</span>
        </div>
    );
}

export default function AdminProfile() {
    const user = useRouteLoaderData("root");

    return (
        <div className="px-4 lg:px-8 py-6 space-y-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] items-stretch">
                    {/* Left Column - Identity */}
                    <div className="flex h-full flex-col gap-6 lg:sticky lg:top-6 self-start">
                        <div className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light/80 dark:bg-bg-surface-primary-default-dark/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
                            <div className="relative h-32 shrink-0 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-bg-fill-accent-default-light via-bg-fill-accent-active-light to-blue-950" />
                                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                                <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl" />
                            </div>
                            <div className="relative -mt-14 px-6 z-10">
                                <div className="flex items-end gap-4">
                                    <div className="relative shrink-0">
                                        <div className="w-24 h-24 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-xl">
                                            <div className="w-full h-full rounded-2xl overflow-hidden bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <UserIcon size={30} className="text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-2 min-w-0 flex-1">
                                        <h2 className="text-xl font-extrabold tracking-tight truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                                            {user.fullName || user.name}
                                        </h2>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <UserCheckIcon size={12} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                                            <p className="text-xs font-semibold truncate text-text-accent-default-light dark:text-text-accent-default-dark">
                                                Administrator
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 mt-4 flex-1 flex flex-col justify-center space-y-3">
                                <div className="flex items-center gap-2.5 text-sm">
                                    <MailIconDark size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                                    <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <PhoneIcon size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                                    <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{user.phoneNumber || user.phone || "—"}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm">
                                    <LocationDotIcon size={14} className="text-text-accent-default-light dark:text-text-accent-default-dark shrink-0" />
                                    <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">{user.address || "—"}</span>
                                </div>
                            </div>
                        </div>
                        <AccountControlsCard className="shrink-0" />
                    </div>

                    {/* Right Column - Details */}
                    <div className="flex h-full flex-col gap-6">
                        {/* Admin Info */}
                        <div className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-linear-to-r from-bg-surface-secondary-default-light to-bg-surface-primary-default-light dark:from-bg-surface-secondary-default-dark dark:to-bg-surface-primary-default-dark">
                                <div>
                                    <h3 className="text-sm font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                                        Admin Information
                                    </h3>
                                    <p className="text-[11px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark mt-0.5">
                                        Account details
                                    </p>
                                </div>
                                <BuildingIcon size={16} className="text-text-accent-default-light dark:text-text-accent-default-dark" />
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InfoField label="Admin ID" value={user.adminCode || user.adminId || user._id} />
                                <InfoField label="Role" value={user.role || "Administrator"} />
                                <InfoField label="Department" value={user.departmentName || user.department} />
                                <InfoField label="Nationality" value={user.nationality} />
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                                { label: "Role", value: (user.roles || []).includes("superadmin") ? "Super Admin" : "Admin", color: "text-purple-500", icon: UserCheckIcon },
                                { label: "Status", value: "Active", color: "text-emerald-500", icon: CheckIcon },
                                { label: "Account Type", value: "Administrative", color: "text-blue-500", icon: StarIcon },
                            ].map((stat) => (
                                <div key={stat.label} className="flex items-center gap-3 p-4 rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color} bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark`}>
                                        <stat.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{stat.label}</p>
                                        <p className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
