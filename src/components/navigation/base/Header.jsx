import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Form } from "react-router-dom";
import defaultImage from "../../../assets/defaultImage.jpg";

import Button from "../../ui/Button";
import DropdownMenu from "../../ui/DropdownMenu";
import ToggleViewMode from "../../ui/ToggleViewMode";

import { IntelliCampusIcon, BellIconLight, MoonIcon, SunIcon, TranslateIcon, SignOutIcon, UserIcon } from "../../ui/icons";


export default function Header({ avatar, notifications, isMobile }) {
    const { i18n } = useTranslation('common/header');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [currTheme, setCurrTheme] = useState(localStorage.getItem('theme') || 'light');
    
    const notificationsRef = useRef(null);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClick = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
    };

    return (
        <header 
            className={`${isMobile ? 'p-2 h-15' : 'p-4 h-20'} sticky w-screen top-0 left-0 right-0 flex items-center justify-between z-50 border-b border-border-primary-default-light bg-bg-surface-primary-default-light text-text-primary-active-light dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark dark:text-text-primary-active-dark`}
        >
            <div id="header-logo" >
               {/* Need To Change Color using variables */}
                <Link to="/" className="flex flex-row items-center gap-2">
                    <IntelliCampusIcon className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`} />
                    <div className={`text-lg font-bold flex flex-col leading-none logo-title`}>
                        <span
                            className="inline-block overflow-hidden w-0 text-text-blue-default-light dark:text-text-blue-default-dark typewriter"
                            style={{ "--w": "6ch", "--steps": "6", "--d": "1.2s", "--delay": "0s" }}
                        >
                            Intelli
                        </span>
                        <span
                            className="inline-block overflow-hidden w-0 text-text-accent-default-light dark:text-text-accent-default-dark typewriter"
                            style={{ "--w": "7ch", "--steps": "7", "--d": "1.2s", "--delay": "1.25s" }}
                        >
                            Campus
                        </span>
                    </div>
                </Link>
            </div>

            <div className={`flex items-center gap-4`}>
                {!isMobile && 
                    <ToggleViewMode 
                        id="header-localization"
                        isFirstMode={i18n.language === 'en'}
                        onFirstModeSelect={() => changeLanguage('en')}
                        onSecondModeSelect={() => changeLanguage('ar')}
                        firstModeLabel="EN"
                        secondModeLabel="AR"
                        buttonStyle={`px-2 py-1 text-sm font-medium rounded-md `}
                    />
                }

                <div id="notifications-button" className="relative" ref={notificationsRef}>
                    <button 
                        className="transition-colors duration-200 p-2 rounded-md relative text-text-secondary-active-light hover:text-text-secondary-hover-light hover:bg-bg-fill-primary-hover-light dark:text-text-secondary-active-dark dark:hover:text-text-primary-active-dark dark:hover:bg-bg-fill-primary-hover-dark" 
                        onClick={() => setIsNotificationsOpen(prev => !prev)}
                    >
                        <span className="fixed flex size-2.5 ml-2.5 -mt-0.75">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark"></span>
                            <span className="relative inline-flex size-2.5 rounded-full bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark"></span>
                        </span>
                        <BellIconLight className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                    </button>

                    {isNotificationsOpen && (
                        <DropdownMenu 
                            direction="bottom"
                            position="middle"
                        >
                            {notifications.map((notification, index) => (
                                <li key={index} className={index === 0 ? "mb-2" : "border-t border-border-primary-default-light dark:border-border-primary-default-dark pt-2"}>
                                    <p className="text-sm">{notification.message}</p>
                                </li>
                            ))}
                        </DropdownMenu>)}
                </div>

                <div id="theme-toggle">
                    <button
                        id="dark-mode-btn"
                        className={`${currTheme === 'dark' ? 'hidden' : ''} p-2 rounded-md relative text-text-secondary-active-light hover:text-text-primary-active-light hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark`}
                        onClick={() => { 
                            document.documentElement.setAttribute("data-theme", "dark");
                            localStorage.setItem("theme", "dark");
                            setCurrTheme('dark');
                        }}
                    >
                        <MoonIcon className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                    </button>

                    <button
                        id="light-mode-btn"
                        className={`${currTheme === 'light' ? 'hidden' : ''} p-2 rounded-md relative text-text-secondary-active-light hover:text-text-primary-active-light hover:bg-bg-fill-primary-hover-light dark:text-text-secondary-active-dark dark:hover:text-text-primary-active-dark dark:hover:bg-bg-fill-primary-hover-dark`}
                        onClick={() => { 
                            document.documentElement.setAttribute("data-theme", "light");
                            localStorage.setItem("theme", "light");
                            setCurrTheme('light');
                        }}
                    >
                        <SunIcon className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                    </button>
                </div>
                
                {!isMobile &&
                    <Link to="/profile" className={`w-12 h-12 block rounded-full border-2 hover:scale-110 border-border-accent-default-light dark:border-border-accent-default-dark`}>
                        <div className="w-full h-full rounded-full overflow-hidden">
                            <img src={avatar || defaultImage} alt="user profile" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                }

                {isMobile && 
                    <div id="header-children-mobile" className="relative" ref={profileMenuRef}>
                        <button 
                            className={`w-10 h-10 block rounded-full overflow-hidden border-2 hover:scale-110 border-border-accent-default-light dark:border-border-accent-default-dark`}
                            onClick={() => setIsProfileMenuOpen(prev => !prev)}
                        >
                            <img src={avatar || defaultImage} alt="user profile" className="w-full h-full object-cover" />
                        </button>

                        { isProfileMenuOpen &&
                            <DropdownMenu 
                                direction="bottom"
                                position="end"
                            >
                                <li className="mb-2">
                                    <NavLink to="/profile" className="w-full text-left flex items-center gap-2">
                                        <UserIcon size={20} />
                                        <span className="text-sm font-semibold whitespace-nowrap">My Profile</span>
                                    </NavLink>
                                </li>
                                
                                <li className="mb-2">                          
                                    <button 
                                        onClick={() => changeLanguage(i18n.language === 'en' ? 'ar' : 'en')} 
                                        className="w-full text-left flex items-center gap-2">
                                        <TranslateIcon size={20} />
                                        <span className="text-sm font-semibold whitespace-nowrap">Language</span>
                                    </button>
                                </li>

                                <li >
                                    <Form method="post" action="/logout">
                                        <button className="w-full text-left flex items-center gap-2">
                                            <SignOutIcon size={20} />
                                            <span className="text-sm font-semibold whitespace-nowrap">Logout</span>
                                        </button>
                                    </Form>
                                </li>
                            </DropdownMenu>
                        }
                    </div>
                }
            </div>
        </header>
    );
}