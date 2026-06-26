import Button from "../../../../../components/ui/Button";
import BaseComponent from "../../../../../components/ui/BaseComponent";
import { PaperclipIcon } from "../../../../../components/ui/icons";

export default function AttendanceExcuseCard({ onRequestExcuse }) {
    return (
        <BaseComponent
            className="hidden sm:flex lg:col-span-1 h-full flex-col"
            contentClassName="flex flex-1 flex-col justify-center"
            title="Quick Action"
            description="Submit an attendance excuse request"
            componentButton={
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark">
                    Fast track
                </span>
            }
        >
            <div className="flex flex-col items-center text-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shadow-sm">
                    <PaperclipIcon size={26} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                </div>

                <div>
                    <p className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
                        Need to excuse an absence?
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary-light dark:text-text-secondary-dark">
                        Attach a supporting document and explain your reason. We&apos;ll review it promptly.
                    </p>
                </div>

                <Button
                    variant="primary"
                    startIcon={<PaperclipIcon size={18} />}
                    className="w-full justify-center"
                    onClick={onRequestExcuse}
                >
                    Request Excuse
                </Button>
            </div>
        </BaseComponent>
    );
}
