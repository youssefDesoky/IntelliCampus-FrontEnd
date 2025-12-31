import { useState } from "react";

export default function CurrentCourses({studentCourses}) {
    const [open, setOpen] = useState(true);

    const arrowIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4">
            <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
        </svg>
    );

    const professorIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 text-gray-500">
            <path d="M320 312C253.7 312 200 258.3 200 192C200 125.7 253.7 72 320 72C386.3 72 440 125.7 440 192C440 258.3 386.3 312 320 312zM289.5 368L350.5 368C360.2 368 368 375.8 368 385.5C368 389.7 366.5 393.7 363.8 396.9L336.4 428.9L367.4 544L368 544L402.6 405.5C404.8 396.8 413.7 391.5 422.1 394.7C484 418.3 528 478.3 528 548.5C528 563.6 515.7 575.9 500.6 575.9L139.4 576C124.3 576 112 563.7 112 548.6C112 478.4 156 418.4 217.9 394.8C226.3 391.6 235.2 396.9 237.4 405.6L272 544.1L272.6 544.1L303.6 429L276.2 397C273.5 393.8 272 389.8 272 385.6C272 375.9 279.8 368.1 289.5 368.1z" />
        </svg>
    );

    const clockIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 text-gray-500">
            <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
        </svg>
    );

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between cursor-none" onClick={() => setOpen(!open)}>
                <h2 className="text-lg font-semibold text-gray-800">Current Courses</h2>
                <button
                    aria-expanded={open}
                    className="cursor-none inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-transform"
                    title={open ? "Hide courses" : "Show courses"}
                >
                    <span className={`transform transition-transform duration-200 ${open ? "rotate-0" : "rotate-180"}`}>
                        {arrowIcon}
                    </span>
                </button>
            </div>

            {open && (
                <div className="grid grid-cols-2 mt-5">
                    {studentCourses.map((course) => (
                        <div key={course.id} className="relative bg-white rounded-md border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-none">
                            <div className="pr-10">
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">{course.title}</h3>
                                <div className="text-xs text-gray-500 mb-3">{course.id}</div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <span className="w-4 h-4">{professorIcon}</span>
                                    <span>{course.professor}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="w-4 h-4">{clockIcon}</span>
                                    <span>{course.schedule}</span>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4">
                                <span title="Your Rank" className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full `}>
                                    {course.rank} / {course.numOfStudents}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}