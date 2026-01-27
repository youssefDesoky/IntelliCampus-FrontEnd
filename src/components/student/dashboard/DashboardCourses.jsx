import { NavLink } from "react-router-dom";

import DashboardCourse from "./courses/DashboardCourse.jsx";
import Button from "../../../ui/Button.jsx";

// Icons
import { ListIcon, Grid3ColIcon, ArrowRightIcon } from "../../../ui/icons";

export default function DashboardCourses({ studentCourses, className = "" }) {
    return (
        <div className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg ${className}`}>
            <div id="dashboard-my-courses-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">My Courses</h2>
                
                <div className="flex items-center gap-4">
                    <div className="flex flex-row items-center gap-1 bg-gray-50 p-1 border border-gray-200 rounded-md">
                        <Button className="px-2 py-1 flex items-center gap-2 bg-blue-500 rounded-md text-sm font-medium text-white" test="active">
                            <Grid3ColIcon className="w-5 h-5" />
                        </Button>

                        <Button className="px-2 py-1 flex items-center gap-2 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
                            <ListIcon className="w-5 h-5" />
                        </Button>
                    </div>
                    <NavLink to="/courses" className="text-blue-600 hover:underline flex items-center gap-2 font-medium">
                        View All
                        <ArrowRightIcon className="w-4 h-4" />
                    </NavLink>
                </div>
            </div>

            <div type="class-items" className="grid grid-cols-3 gap-4">
                {studentCourses.map((course) => (
                    <DashboardCourse key={course.id} courseData={course} />
                ))}
            </div>
        </div>
    );
}