import { NavLink } from "react-router-dom";

import TodayReminderItem from "./upcomingDeadlines/TodayReminderItem";

// Icons
import {BellIconDark, ArrowRightIcon} from "../../../ui/icons";

export default function TodayReminders({ reminders, className }) {
    return (
        <div className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg ${className}`}>
            <div id="today-reminders-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Today's Reminders</h2>
                <BellIconDark className="w-6 h-6" />
            </div>

            <menu className="flex flex-col gap-3 mb-8">
                {reminders.length === 0 ? (
                    <div className="mb-4 border border-default-border-light dark:border-default-border-dark rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-muted-text-light dark:text-muted-text-dark">
                            <BellIconDark className="w-12 h-12 mb-4" />
                            <p className="text-center">No reminders for today</p>
                        </div>
                    </div>
                ) : (
                    reminders.map((reminder, index) => (
                        <TodayReminderItem key={index} reminder={reminder} />
                    ))
                )}
            </menu>

            <NavLink to="/reminders" className="text-blue-600 hover:underline flex items-center gap-2 justify-center font-medium">
                View All Reminders
                <ArrowRightIcon className="w-4 h-4" />
            </NavLink>
        </div>
    );
}