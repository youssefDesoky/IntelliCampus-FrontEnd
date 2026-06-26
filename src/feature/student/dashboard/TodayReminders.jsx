import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import TodayReminderItem from "./upcomingDeadlines/TodayReminderItem";

import { BellIconDark, ArrowRightIcon } from "../../../components/ui/icons";
import { fetchRemindersByDay } from "../remindersApi";

export default function TodayReminders({ className }) {
    const { data: reminders = [], isLoading, error } = useQuery({
        queryKey: ["todayReminders"],
        queryFn: () => fetchRemindersByDay(new Date()),
        staleTime: 60 * 1000,
    });

    return (
        <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
            <div id="today-reminders-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Today's Reminders</h2>
                <BellIconDark className="w-6 h-6" />
            </div>

            <menu className="flex flex-col gap-3 mb-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                        <BellIconDark className="w-12 h-12 mb-4" />
                        <p className="text-center">Loading reminders...</p>
                    </div>
                ) : reminders.length === 0 ? (
                    <div className="mb-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            <BellIconDark className="w-12 h-12 mb-4" />
                            <p className="text-center">No reminders for today</p>
                        </div>
                    </div>
                ) : (
                    reminders.map((reminder, index) => (
                        <TodayReminderItem key={reminder.id ?? index} reminder={reminder} />
                    ))
                )}
            </menu>

            <NavLink to="/reminders" className="text-text-accent-default-light dark:text-text-accent-default-dark hover:underline flex items-center gap-2 justify-center font-medium">
                View All Reminders
                <ArrowRightIcon className="w-4 h-4" />
            </NavLink>
        </div>
    );
}
