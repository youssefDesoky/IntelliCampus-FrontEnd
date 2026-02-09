import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { getNavigationLinks } from '../../../data/student/navigationLinks';

import BottomBar from '../base/BottomBar';

import Button from '../../ui/Button';
import DropdownMenu from '../../ui/DropdownMenu';
import { BookIcon } from '../../ui/icons';


    
const linkCls = (isActive) => {
    const activePart = isActive ?
        `bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark active-link` :
        "border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark";
    
    return `flex items-center justify-center gap-3 p-2 rounded overflow-hidden ${activePart}`;
};


export default function StudentBottomBar() {
    const popupRef = useRef(null);
    const buttonRef = useRef(null);
    const { t } = useTranslation('student/aside');
    const [showCoursesPopup, setShowCoursesPopup] = useState(false);

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

    return (
        <BottomBar links={getNavigationLinks(t)}>
            <div className="relative">
                <button 
                    ref={buttonRef}
                    onClick={() => setShowCoursesPopup(!showCoursesPopup)}
                    className={`w-full flex items-center gap-3 p-2 rounded border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark`}
                >
                    <BookIcon className="w-5 h-5" />
                </button>
              
                {showCoursesPopup && (
                    <DropdownMenu 
                        ref={popupRef} 
                        direction="top"
                        position="middle"
                    >
                        <li>
                            <NavLink 
                                to="/courses" 
                                end 
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('allCourses')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses/registration" 
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('courseRegistration')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses/prerequisites" 
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('coursePrerequisites')}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses/remarking-request" 
                                className={({ isActive }) => linkCls(isActive)}
                            >
                                <span className="text-sm font-semibold whitespace-nowrap">{t('courseRemarkingRequest')}</span>
                            </NavLink>
                        </li>
                    </DropdownMenu>
                )}
            </div>
        </BottomBar>
    );
}