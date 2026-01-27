import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import Section from "../../../../ui/Section";
import CircularProgress from "../../../../ui/CircularProgress";
import PageHeader from "../../../../ui/PageHeader";

import useDeviceType from "../../../../hooks/useDeviceType";
import { BullHornIcon, UsersIcon, FolderOpenIconDark, UserCheckIcon, ChartBarIcon, CommentsIcon, FilePenIcon, BrainIcon } from "../../../../ui/icons";

export default function CourseLayout({courses}) {
    const { courseId } = useParams();    
    const { isMobile } = useDeviceType();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const location = useLocation();

    const course = courses.find(c => c.id === courseId || c.id.toString() === courseId);

    if (!course) {
        return <p>Course data not available.</p>;
    }

    const desktopLinkStyles = (isActive) => `block px-4 py-2 border-b-2 border-transparent ${
        isActive ? '' :
        ''
    }`;

    const mobileLinkStyles = (isActive) => `flex items-center justify-center w-10 h-10 rounded-full ring-2 ${
        isActive ? 'bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-icon-accent-active-light dark:text-icon-accent-active-dark ring-border-accent-active-light dark:ring-border-accent-active-dark' : 
        'bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-icon-accent-default-light dark:text-icon-accent-default-dark ring-border-primary-default-light dark:ring-border-primary-default-dark'
    }`;

    const links = [
        { to: "", end: true, icon: <BullHornIcon className="w-5 h-5" />, label: "Announcements" },
        { to: "materials", icon: <FolderOpenIconDark className="w-5 h-5" />, label: "Materials" },
        { to: "assignments", icon: <FilePenIcon className="w-5 h-5" />, label: "Assignments" },
        { to: "quizzes", icon: <BrainIcon className="w-5 h-5" />, label: "Quizzes" },
        { to: "attendance", icon: <UserCheckIcon className="w-5 h-5" />, label: "Attendance" },
        { to: "grades", icon: <ChartBarIcon className="w-5 h-5" />, label: "Grades" },
        { to: "community", icon: <UsersIcon className="w-5 h-5" />, label: "Community" },
        { to: "study-group", icon: <CommentsIcon className="w-5 h-5" />, label: "Study Group" },
    ];

    const isLinkActive = (linkTo) => {
        const basePath = `/courses/${courseId}`;
        const currentPath = location.pathname;
        if (linkTo === "") {
            return currentPath === basePath || currentPath === `${basePath}/`;
        }
        return currentPath === `${basePath}/${linkTo}`;
    };

    return (
        <>
            <Section className="border-b border-default-border-light dark:border-default-border-dark">
                <PageHeader
                    title={`${course.id}: ${course.title}`}
                    subtitle={<div className="flex flex-row items-center gap-2  ">{course.semester} <span className="w-1 h-1 rounded-full my-auto mx-1 bg-text-secondary-default-light dark:bg-text-secondary-default-dark"></span> {course.professor}</div>}
                >
                    <div className="flex flex-row items-center">
                        {!isMobile && <div className="flex flex-col items-center mr-8">
                            <p>Course Progress</p>
                            <h3 className="text-xl font-bold">{course.progress}% Complete</h3>
                        </div>}

                        <CircularProgress size={75} progress={course.progress} strokeWidth={10} />
                    </div>
                </PageHeader>

                {!isMobile && 
                    <menu className="flex flex-row gap-4 overflow-x-auto">
                        {links.map((link) => (
                            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => desktopLinkStyles(isActive)}>
                                {link.label}
                            </NavLink>
                        ))}
                    </menu>
                }                            
            </Section>

            <Section>
                <Outlet context={{ course }} />
                {isMobile && 
                    <nav className="fixed bottom-16 right-3">
                        <menu className="flex flex-col gap-2 mb-4">
                            {isMobileNavOpen && links
                                .filter(link => !isLinkActive(link.to))
                                .map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.end}
                                        onClick={() => setIsMobileNavOpen(false)}
                                        className={({ isActive }) => mobileLinkStyles(isActive)}
                                    >
                                        {link.icon}
                                    </NavLink>
                                ))
                            }
                        </menu>

                        <div>
                            {links
                                .filter(link => isLinkActive(link.to))
                                .map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        end={link.end}
                                        onClick={() => setIsMobileNavOpen(prev => !prev)}
                                        className={({ isActive }) => mobileLinkStyles(isActive)}
                                    >
                                        {link.icon}
                                    </NavLink>
                                ))
                            }
                        </div>
                    </nav>
                }
            </Section>
        </>
    );
}