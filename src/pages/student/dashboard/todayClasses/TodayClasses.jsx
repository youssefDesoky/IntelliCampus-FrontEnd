import { NavLink } from "react-router-dom";
import ClassItem from "./ClassItem";

// Icons
import ArrowRightIcon from "../../../../components/icons/ArrowRightIcon";
import CalendarCheckIcon from "../../../../components/icons/CalendarCheckIcon";

export default function TodayClasses({className, todayClasses}) {
    return (
        <div className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg ${className}`}>
            <div id="today-classes-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Today's Classes</h2>
                
                <NavLink to="/schedule" className="text-blue-600 hover:underline flex items-center gap-2 font-medium">
                    View Full Schedule
                    <ArrowRightIcon className="w-4 h-4" />
                </NavLink>
            </div>

            <div type="class-items" className="grid grid-cols-2 gap-4">
                {todayClasses.length === 0 ? (
                    <div className="mb-4 col-span-2 h-full border border-default-border-light dark:border-default-border-dark rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-muted-text-light dark:text-muted-text-dark">
                            <CalendarCheckIcon className="w-12 h-12 mb-4" />
                            <p className="text-center">No more classes scheduled for today. Enjoy your free time!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {todayClasses.map((classItem) => (<ClassItem key={classItem.id} classInfo={classItem} />))}
                        {todayClasses.length % 2 !== 0 && (
                            <div className="mb-4 border border-default-border-light dark:border-default-border-dark rounded-lg">
                                <div className="flex flex-col items-center justify-center h-full p-6 text-muted-text-light dark:text-muted-text-dark">
                                    <CalendarCheckIcon className="w-12 h-12 mb-4" />
                                    <p className="text-center">No more classes scheduled for today. Enjoy your free time!</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}