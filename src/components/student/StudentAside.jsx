import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Aside from "../common/Aside";
import { HouseIcon, BookIcon, BellIconDark, StickyNoteIcon, CalendarDaysIcon, AngleDownIcon } from "../../ui/icons";
import Button from "../../ui/Button";
import useSidebar from "../../hooks/useSidebar";

export default function StudentAside({height}) {
    const { t } = useTranslation('student/aside');
    const [isCoursesOpen, setIsCoursesOpen] = useState(false);

    const { width } = useSidebar();

    const linkCls = (isActive) => {
        const activePart = isActive ?
          `bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark ${width >= 15 ? "transform translate-x-2" : ""} active-link` :
          "border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark";
        
        return `flex items-center gap-3 p-2 rounded overflow-hidden ${activePart}`;
    };

    return (
        <Aside height={height}>
            <NavLink to="/" end className={({ isActive }) => linkCls(isActive)}>                
                <HouseIcon className="w-5 h-5 shrink-0" />
                <span className="text-base font-semibold whitespace-nowrap">{t('dashboard')}</span>
            </NavLink>

            <div className={`${isCoursesOpen ? "border-l-4 border-border-accent-default-light dark:border-border-accent-default-dark pl-2" : "border-transparent"}`}>
                <Button 
                    onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                    className={`w-full flex items-center gap-3 p-2 rounded overflow-hidden border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark`}
                >
                    <BookIcon className="w-5 h-5 shrink-0" />
                    <span className="text-base font-semibold whitespace-nowrap">{t('courses')}</span>
                    <AngleDownIcon className={`w-4 h-4 ml-auto shrink-0 transition-transform duration-300 ${isCoursesOpen ? "rotate-0" : "-rotate-90"}`} />
                </Button>
              
                <menu className={`${isCoursesOpen ? "flex" : "hidden"} flex-col ml-2 mt-2 mb-2 gap-2 w-[85%] text-sm`}>
                    <li>
                        <NavLink to="/courses" end className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold whitespace-nowrap">{t('allCourses')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses/registration" className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold whitespace-nowrap">{t('courseRegistration')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses/prerequisites" className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold whitespace-nowrap">{t('coursePrerequisites')}</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses/remarking-request" className={({ isActive }) => linkCls(isActive)}>
                            <span className="text-base font-semibold whitespace-nowrap">{t('courseRemarkingRequest')}</span>
                        </NavLink>
                    </li>
                </menu>
            </div>

            <NavLink to="/reminders" className={({ isActive }) => linkCls(isActive)}>
                <BellIconDark className="w-5 h-5 shrink-0" />
                <span className="text-base font-semibold whitespace-nowrap">{t('reminders')}</span>
            </NavLink>

            <NavLink to="/smart-notes" className={({ isActive }) => linkCls(isActive)}>
                <StickyNoteIcon className="w-5 h-5 shrink-0" />
                <span className="text-base font-semibold whitespace-nowrap">{t('smartNotes')}</span>
            </NavLink>

            <NavLink to="/schedule" className={({ isActive }) => linkCls(isActive)}>
                <CalendarDaysIcon className="w-5 h-5 shrink-0" />
                <span className="text-base font-semibold whitespace-nowrap">{t('schedule')}</span>
            </NavLink>
        </Aside>
    );
}