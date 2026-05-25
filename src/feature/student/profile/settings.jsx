import { useState } from "react";
import { Form } from "react-router-dom";
import BaseComponent from "../../../components/ui/BaseComponent";
import { KeyIcon, SignOutIcon, BellIconDark, MailIconDark, BellSlashIconLight } from "../../../components/ui/icons";

const notifications = [
    { id: "email-notification", label: "Email Digests", icon: MailIconDark, defaultChecked: true },
    { id: "in-app-notification", label: "In-App Alerts", icon: BellIconDark, defaultChecked: false },
    { id: "push-notification", label: "Mobile Push", icon: BellSlashIconLight, defaultChecked: false },
];

export default function Settings({ className = "" }) {
    const [preferences, setPreferences] = useState(() =>
        notifications.reduce((accumulator, item) => {
            accumulator[item.id] = item.defaultChecked;
            return accumulator;
        }, {})
    );

    const togglePreference = (preferenceId) => {
        setPreferences((current) => ({
            ...current,
            [preferenceId]: !current[preferenceId],
        }));
    };

    return (
        <BaseComponent
            title="Preferences"
            description="Manage your channels and security details."
            className={className}
            contentClassName="space-y-5"
        >
            {/* Notifications Preferences Stacked Vertically */}
            <div className="flex flex-col gap-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary-default-light dark:text-text-tertiary-default-dark mb-1">
                    Notification Channels
                </p>
                {notifications.map(({ id, label, icon: Icon }) => (
                    <div key={id} className="flex items-center justify-between rounded-xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-3.5 py-2.5 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-surface-primary-default-light text-text-accent-active-light dark:bg-bg-surface-primary-default-dark dark:text-text-accent-active-dark shadow-xs">
                                <Icon size={14} />
                            </div>
                            <span className="text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                {label}
                            </span>
                        </div>
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

            {/* Systematic Session Actions */}
            <div className="pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark flex flex-col gap-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-primary-default-light px-4 py-2.5 text-xs font-semibold text-text-primary-default-light transition-colors hover:bg-bg-surface-secondary-default-light dark:border-border-primary-default-dark dark:text-text-primary-default-dark dark:hover:bg-bg-surface-secondary-default-dark">
                    <KeyIcon size={14} />
                    Change Password
                </button>

                <Form method="post" action="/logout" className="w-full">
                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                        <SignOutIcon size={14} />
                        Logout Account
                    </button>
                </Form>
            </div>
        </BaseComponent>
    );
}