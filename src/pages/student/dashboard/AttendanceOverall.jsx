import { NavLink } from "react-router-dom";
import Section from "../../../components/ui/Section";

export default function AttendanceOverall({className, studentAttendance}) {
    return (
        <Section className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg ${className}`}>
            <h2 className="text-2xl font-semibold mb-4">Attendance</h2>

            <div className="relative w-48 h-48 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        className="text-gray-300 dark:text-gray-700"
                    />

                    {/* Progress circle */}
                    <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={(1 - studentAttendance / 100) * 2 * Math.PI * 80}
                        strokeLinecap="round"
                        className={`text-${studentAttendance >= 75 ? 'blue' : studentAttendance >= 50 ? 'yellow' : 'red'}-500 transition-all duration-500`}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold">{studentAttendance}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overall</p>
                </div>
            </div>


            <div className="mb-4 py-4 text-sm border-y border-default-border-light text-gray-700 dark:text-gray-300 dark:border-default-border-dark">
                <div className="flex justify-between mb-2">
                    <p>Present</p>
                    <p>41</p>
                </div>

                <div className="flex justify-between mb-2">
                    <p>Absent</p>
                    <p>9</p>
                </div>

                <div className="flex justify-between">
                    <p>Total Classes</p>
                    <p>50</p>
                </div>
            </div>

            <NavLink 
                to="/attendance" 
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-none"
            >
                View Detailed Attendance
            </NavLink>
        </Section>
    );
}