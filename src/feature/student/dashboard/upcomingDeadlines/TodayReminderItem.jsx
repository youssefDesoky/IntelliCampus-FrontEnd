import { format } from "date-fns";

export default function TodayReminderItem({ reminder }) {
    return (
        <li className="p-4 border border-l-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out border-border-primary-default-light dark:border-border-primary-default-dark border-l-border-accent-default-light dark:border-l-border-accent-default-dark">
            <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold">{reminder.title}</h3>
                <p className="text-xs font-medium text-text-tertiary-default-light dark:text-text-tertiary-default-dark">{reminder.priority}</p>
            </div>

            <div className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark flex items-center">
                <span>{reminder.category}</span>
                <span className="mx-2 w-2 h-1 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark"></span>
                <span>{reminder.dueAt ? format(new Date(reminder.dueAt), "hh:mm a") : reminder.dueDate}</span>
            </div>
        </li>
    );
}
