import { useState } from "react";
import { KeyIcon, SignOutIcon } from "../../../components/ui/icons";

const profilePreferences = [
    { id: "email", label: "Email", enabled: true },
    { id: "notifications", label: "Notifications", enabled: false },
    { id: "push", label: "Push notifications", enabled: false },
];

export default function AccountControlsCard({ className = "" }) {
    const [preferences, setPreferences] = useState(
        profilePreferences.reduce((acc, item) => {
            acc[item.id] = item.enabled;
            return acc;
        }, {})
    );

    const togglePreference = (id) => {
        setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className={`rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden shadow-xl ${className}`}>
            <div className="px-6 py-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                    Account Controls
                </p>
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">
                    Manage contact and security preferences.
                </p>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 gap-2.5">
                    {profilePreferences.map(({ id, label }) => (
                        <div key={id} className="flex items-center justify-between rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-3.5 py-2.5">
                            <span className="text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                {label}
                            </span>
                            <label htmlFor={id} className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    id={id}
                                    className="peer sr-only"
                                    checked={preferences[id]}
                                    onChange={() => togglePreference(id)}
                                />
                                <div className="h-5 w-9 rounded-full bg-bg-fill-secondary-default-light transition-colors peer-checked:bg-bg-fill-accent-default-light peer-focus:outline-none dark:bg-bg-fill-secondary-default-dark dark:peer-checked:bg-bg-fill-accent-default-dark after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-bg-fill-primary-default-light after:transition-transform after:content-[''] peer-checked:after:translate-x-4 dark:after:bg-bg-fill-primary-default-dark" />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-5 pb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-4 py-2.5 text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark transition-all hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark hover:shadow-sm">
                    <KeyIcon size={14} />
                    Reset Password
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-950/20 hover:shadow-sm">
                    <SignOutIcon size={14} />
                    Logout
                </button>
            </div>
        </div>
    );
}
