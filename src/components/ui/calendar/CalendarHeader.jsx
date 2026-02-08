import { format } from "date-fns";
import { AngleDownIcon } from "../icons";


export default function CalendarHeader({ currentMonth, onPrev, onNext }) {
    return (
        <div className="flex items-center justify-between px-2 mb-6">
            <span className="text-xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                {format(currentMonth, "MMMM yyyy")}
            </span>

            <div className="flex gap-4">
                <button
                    onClick={onPrev}
                    className="p-1 rounded-full hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark text-text-accent-default-light dark:text-text-accent-default-dark"
                >
                    <AngleDownIcon className="w-6 h-6 rotate-90" />
                </button>

                <button
                    onClick={onNext}
                    className="p-1 rounded-full hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark text-text-accent-default-light dark:text-text-accent-default-dark"
                >
                    <AngleDownIcon className="w-6 h-6 -rotate-90" />
                </button>
            </div>
        </div>
  );
}
