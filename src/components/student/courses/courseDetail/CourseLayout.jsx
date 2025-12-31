import { NavLink, Outlet, useParams } from "react-router-dom";

import Section from "../../../../ui/Section";
import CircleSpan from "../../../../ui/CircleSpan";
import CircularProgress from "../../../../ui/CircularProgress";

import { OpenInNewTabIcon } from "../../../../ui/icons";

export default function CourseLayout({courses}) {
    const { courseId } = useParams();    
    const course = courses.find(c => c.id === courseId || c.id.toString() === courseId);

    if (!course) {
        return <p>Course data not available.</p>;
    }

    const linkCls = (isActive) => `block px-4 py-2 border-b-2 border-transparent hover:text-secondary-text-light dark:hover:text-secondary-text-dark hover:border-hover-border-light dark:hover:border-hover-border-dark ${
        isActive ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold' : 'text-muted-text-light dark:text-muted-text-dark'
    }`;

    return (
        <>
            <Section>
                <div className="flex flex-row justify-between items-center mb-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold">{course.id}: {course.title}</h2>
                        
                        <div className="flex flex-row items-center gap-2 text-sm text-muted-text-light dark:text-muted-text-dark">
                            <p>{course.semester}</p>
                            <CircleSpan />
                            <p>{course.professor}</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="flex flex-col items-center mr-8">
                            <p>Course Progress</p>
                            <h3 className="text-xl font-bold">{course.progress}% Complete</h3>
                        </div>

                        <CircularProgress size={75} progress={course.progress} strokeWidth={10} />
                    </div>
                </div>

                <div className="border-b border-default-border-light dark:border-default-border-dark pt-6">
                    <nav>
                        <menu className="flex flex-row gap-4 overflow-x-auto">
                            <li> 
                                <NavLink to="" end className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Announcements</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="materials" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Materials</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="assignments" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Assignments</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="quizzes" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Quizzes</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="attendance" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Attendance</span>
                                </NavLink>
                            </li>
                            
                            <li>
                                <NavLink to="grades" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Grades</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="community" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Community</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="study-group" className={({ isActive }) => linkCls(isActive)}>
                                    <span className="text-base font-semibold">Study Group</span>
                                </NavLink>
                            </li>
                        </menu>
                    </nav>
                </div>
            </Section>

            <Section>
                <Outlet context={{ course }} />
            </Section>
        </>
    );
}