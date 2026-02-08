import { Form } from "react-router-dom";
import { KeyIcon, SignOutIcon } from "../../../components/ui/icons"

const notificationSettings = [
    { id: 'email-notification', label: 'Email Notification' },
    { id: 'in-app-notification', label: 'In-app Notification' },
    { id: 'push-notification', label: 'Push Notification' },
];
import Section from "../../../components/ui/Section";

export default function Settings({ className="" }) {
    return (
        <Section className={`rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <h2 className="text-lg font-semibold flex items-center gap-2">Settings</h2>
            
            <div className="space-y-4 mt-6">
                {notificationSettings.map(({ id, label }) => (
                    <div key={id} className="flex items-center justify-between">
                        <p>{label}</p>
                        <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id={id} className="sr-only peer" />
                            <div className="w-11 h-6 bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-border-accent-default-light dark:peer-focus:ring-border-accent-default-dark rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-bg-fill-primary-default-light dark:peer-checked:after:border-bg-fill-primary-default-dark after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-bg-fill-primary-default-light dark:after:bg-bg-fill-primary-default-dark after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border-primary-default-dark peer-checked:bg-bg-fill-accent-default-light dark:peer-checked:bg-bg-fill-accent-default-dark"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="my-6 border-t border-border-primary-default-light dark:border-border-primary-default-dark"/>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <KeyIcon size={24} />
                    <p >Change Password</p>
                </div>

                <div className="flex items-center gap-4">
                    <Form method="post" action="/logout">
                        <button>
                            <SignOutIcon size={24} />
                            Logout
                        </button>
                    </Form>
                </div>
            </div>
        </Section>
    );
}