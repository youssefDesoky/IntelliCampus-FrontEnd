import BottomBar from '../common/BottomBar';
import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HouseIcon, BookIcon, BellIconDark, StickyNoteIcon, CalendarDaysIcon } from '../../ui/icons';
import Button from '../../ui/Button';
import DropDownMenu from '../../ui/DropDownMenu';


export default function StudentBottomBar() {
    const [showCoursesPopup, setShowCoursesPopup] = useState(false);
    const buttonRef = useRef(null);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) && 
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowCoursesPopup(false);
            }
        };

        if (showCoursesPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCoursesPopup]);

    const { t } = useTranslation('student/aside');
    
    const linkCls = (isActive) => {
        const activePart = isActive ?
          `bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark active-link` :
          "border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark";
        
        return `flex items-center justify-center gap-3 p-2 rounded overflow-hidden ${activePart}`;
    };

    return (
        <BottomBar>
            <NavLink to="/" end className={({ isActive }) => linkCls(isActive)} title={t('dashboard')}>                
                <HouseIcon className="w-5 h-5" />
            </NavLink>

            <div className="relative">
                <Button 
                    title={t('courses')}
                    ref={buttonRef}
                    data-compact='true'
                    onClick={() => setShowCoursesPopup(!showCoursesPopup)}
                    className={`w-full flex items-center gap-3 p-2 rounded border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark`}
                >
                    <BookIcon className="w-5 h-5" />
                </Button>
              
                {showCoursesPopup && (
                    <DropDownMenu 
                        ref={popupRef} 
                        direction="top"
                        position="middle"
                    >
                        <li>
                            <NavLink 
                                to="/courses" 
                                end 
                                onClick={() => setShowCoursesPopup(false)}
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('allCourses')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses/registration" 
                                onClick={() => setShowCoursesPopup(false)}
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('courseRegistration')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses/prerequisites" 
                                onClick={() => setShowCoursesPopup(false)}
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('coursePrerequisites')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses/remarking-request" 
                                onClick={() => setShowCoursesPopup(false)}
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('courseRemarkingRequest')}</span>
                            </NavLink>
                        </li>
                    </DropDownMenu>
                )}
            </div>

            <NavLink to="/reminders" className={({ isActive }) => linkCls(isActive)} title={t('reminders')}>
                <BellIconDark className="w-5 h-5" />
            </NavLink>

            <NavLink to="/smart-notes" className={({ isActive }) => linkCls(isActive)} title={t('smartNotes')}>
                <StickyNoteIcon className="w-5 h-5" />
            </NavLink>

            <NavLink to="/schedule" className={({ isActive }) => linkCls(isActive)} title={t('schedule')}>
                <CalendarDaysIcon className="w-5 h-5" />
            </NavLink>
        </BottomBar>
    );
}