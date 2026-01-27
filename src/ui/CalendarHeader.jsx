import { format } from "date-fns";
import { AngleDownIcon } from "./icons";


export default function CalendarHeader({ currentMonth, onPrev, onNext }) {
    return (
        <div className="flex items-center justify-between px-2 mb-6">
            <span className="text-xl font-bold text-primary-text-light dark:text-primary-text-dark">
                {format(currentMonth, "MMMM yyyy")}
            </span>

            <div className="flex gap-4">
                <button
                    onClick={onPrev}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-accent-light dark:text-accent-dark"
                >
                    <AngleDownIcon className="w-6 h-6 rotate-90" />
                </button>

                <button
                    onClick={onNext}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-accent-light dark:text-accent-dark"
                >
                    <AngleDownIcon className="w-6 h-6 -rotate-90" />
                </button>
            </div>
        </div>
  );
}
