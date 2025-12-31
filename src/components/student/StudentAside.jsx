import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

// Translation
import { useTranslation } from "react-i18next";

// Components
import Aside from "../common/Aside";

// Icons
import { HouseIcon, BookIcon, BellIconDark, StickyNoteIcon, UsersIcon, CalendarDaysIcon, AngleDownIcon } from "../../ui/icons";
import Button from "../../ui/Button";

export default function StudentAside({height}) {
    const { t } = useTranslation('student/aside');
    const [isCoursesOpen, setIsCoursesOpen] = useState(false);
    const navigate = useNavigate();

    const sidebarWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width"));

    const linkCls = (isActive) => {
        const activePart = isActive ?
          `transition-transform duration-200 ease-in-out bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark ${sidebarWidth >= 175 ? "transform translate-x-2" : ""} active-link` :
          "transition-colors duration-200 border border-transparent text-secondary-text-light hover:bg-hover-light hover:text-accent-text-light hover:border-muted-border-light dark:text-secondary-text-dark dark:hover:bg-hover-dark dark:hover:text-accent-text-dark dark:hover:border-muted-border-dark";
        
        return `flex items-center gap-3 p-2 rounded ${activePart}`;
    };

    return (
        <Aside height={height}>
            <NavLink to="/" end className={({ isActive }) => linkCls(isActive)}>                
                <HouseIcon className="w-5 h-5" />
                <span className="text-base font-semibold">{t('dashboard')}</span>
            </NavLink>

            <div className={`transition-none ${isCoursesOpen ? "border-l-4 border-accent-light dark:border-accent-dark pl-2" : "border-transparent"}`}>
                <Button 
                    onClick={() => {
                        navigate("/courses");
                        setIsCoursesOpen(!isCoursesOpen)
                    }} 
                    className={`w-full flex items-center gap-3 p-2 rounded transition-colors duration-200 border border-transparent text-secondary-text-light hover:bg-hover-light hover:text-accent-text-light hover:border-muted-border-light dark:text-secondary-text-dark dark:hover:bg-hover-dark dark:hover:text-accent-text-dark dark:hover:border-muted-border-dark`}
                >
                    <BookIcon className="w-5 h-5" />
                    <span className="text-base font-semibold">{t('courses')}</span>
                    <AngleDownIcon className={`w-4 h-4 ml-auto transition-transform duration-300 ${isCoursesOpen ? "rotate-0" : "-rotate-90"}`} />
                </Button>
              
                <menu className={`${isCoursesOpen ? "flex" : "hidden"} flex-col ml-2 mt-2 mb-2 gap-2 w-[85%] text-sm transition-all duration-300`}>
                    <li>
                        <NavLink to="/courses" end className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold">{t('allCourses')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses/registration" className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold">{t('courseRegistration')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses/prerequisites" className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold">{t('coursePrerequisites')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses/remarking-request" className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold">{t('courseRemarkingRequest')}</span>
                        </NavLink>
                    </li>
                </menu>
            </div>

            <NavLink to="/reminders" className={({ isActive }) => linkCls(isActive)}>
                <BellIconDark className="w-5 h-5" />
                <span className="text-base font-semibold">{t('reminders')}</span>
            </NavLink>

            <NavLink to="/smart-notes" className={({ isActive }) => linkCls(isActive)}>
                <StickyNoteIcon className="w-5 h-5" />
                <span className="text-base font-semibold">{t('smartNotes')}</span>
            </NavLink>

            {/* <NavLink to="/community" className={({ isActive }) => linkCls(isActive)}>
                <UsersIcon className="w-5 h-5" />
                <span className="text-base font-semibold">{t('community')}</span>
            </NavLink> */}

            <NavLink to="/schedule" className={({ isActive }) => linkCls(isActive)}>
                <CalendarDaysIcon className="w-5 h-5" />
                <span className="text-base font-semibold">{t('schedule')}</span>
            </NavLink>
        </Aside>
    );
}