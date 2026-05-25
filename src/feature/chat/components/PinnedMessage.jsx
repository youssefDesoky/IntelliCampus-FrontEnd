import { PinIcon } from "../../../components/ui/icons";

export default function PinnedMessage({ message }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light/70 dark:bg-bg-surface-secondary-default-dark/70 px-4 py-3">
            <div className="p-2 rounded-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark">
                <PinIcon size={18} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary-light dark:text-text-secondary-dark">Pinned Message</span>
                
                <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
                    {message}
                </p>
            </div>
        </div>
    );
}