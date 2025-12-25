export default function TodayReminderItem({reminder}) {
    return (
        <li className="p-4 border border-l-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out border-default-border-light dark:border-default-border-dark border-l-blue-600 dark:border-l-blue-600">
            <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-semibold">{reminder.title}</h3>
                <p className="text-xs font-medium text-muted-text-light dark:text-muted-text-dark">{reminder.status}</p>
            </div>

            <div className="text-xs text-muted-text-light dark:text-muted-text-dark flex items-center">
                <span>{reminder.category}</span>
                <span className="mx-2 w-2 h-1 rounded-lg bg-muted-bg-light"></span>
                <span>{reminder.dueDate}</span>
            </div>
        </li>
    );
}