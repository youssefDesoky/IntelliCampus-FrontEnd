import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Form } from "react-router-dom";
import defaultImage from "../../../assets/defaultImage.jpg";
import { fetchMyNotifications, markNotificationAsRead, markAllNotificationsAsRead, subscribeNotificationsChanged } from "../../../api/notifications";

import DropdownMenu from "../../ui/DropdownMenu";
import ToggleViewMode from "../../ui/ToggleViewMode";
import ToggleTheme from "../../ui/ToggleTheme";

import { IntelliCampusIcon, BellIconLight, TranslateIcon, SignOutIcon, UserIcon, InboxIcon } from "../../ui/icons";
import { useError } from '../../../contexts/ErrorContext.jsx';


const viewLabels = { student: 'Student', instructor: 'Instructor', admin: 'Admin' };

export default function Header({ avatar, notifications: initialNotifications, isMobile, availableViews = [], activeView, onViewChange }) {
    const { i18n } = useTranslation('common/header');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications || []);
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
    
    const notificationsRef = useRef(null);
    const profileMenuRef = useRef(null);
    const eventSourceRef = useRef(null);
    const { showError } = useError();

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

    // Connect to SSE stream for real-time notifications
    useEffect(() => {
        try {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            const eventSource = new EventSource('/api/notifications/stream', { withCredentials: true });
            eventSourceRef.current = eventSource;

            eventSource.onmessage = (event) => {
                try {
                    const notification = JSON.parse(event.data);
                    setNotifications(prevNotifications => {
                        const exists = prevNotifications.some(n => n.userNotificationId === notification.userNotificationId);
                        if (exists) return prevNotifications;
                        return [notification, ...prevNotifications];
                    });
                } catch (err) {
                    showError(err.message);
                }
            };

            eventSource.onerror = () => {
                eventSource.close();
                eventSourceRef.current = null;
                setTimeout(() => {
                    const newEventSource = new EventSource('/api/notifications/stream', { withCredentials: true });
                    eventSourceRef.current = newEventSource;
                    newEventSource.onmessage = eventSource.onmessage;
                    newEventSource.onerror = eventSource.onerror;
                }, 3000);
            };

            return () => {
                eventSource.close();
            };
        } catch (err) {
            showError(err.message);
        }
    }, [showError]);

    useEffect(() => {
        const refreshNotifications = async () => {
            try {
                const fresh = await fetchMyNotifications();
                setNotifications(fresh || []);
            } catch (err) {
                showError(err.message);
            }
        };

        return subscribeNotificationsChanged(refreshNotifications);
    }, [showError]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            const fresh = await fetchMyNotifications();
            setNotifications(fresh || []);
        } catch (err) {
            showError(err.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            setIsMarkingAllRead(true);
            await markAllNotificationsAsRead();
            const fresh = await fetchMyNotifications();
            setNotifications(fresh || []);
        } catch (err) {
            showError(err.message);
        } finally {
            setIsMarkingAllRead(false);
        }
    };

    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    const unreadCount = safeNotifications.filter(n => !n.isRead).length;

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

                {availableViews.length > 1 && (
                    <div className="hidden sm:flex items-center gap-1">
                        <ToggleViewMode
                            isFirstMode={activeView === availableViews[0]}
                            onFirstModeSelect={() => onViewChange(availableViews[0])}
                            onSecondModeSelect={() => onViewChange(availableViews[1])}
                            firstModeLabel={viewLabels[availableViews[0]] || availableViews[0]}
                            secondModeLabel={viewLabels[availableViews[1]] || availableViews[1]}
                        />
                    </div>
                )}

                <Link
                  to="/inbox"
                  className="transition-colors duration-200 p-2 rounded-md text-text-secondary-active-light hover:text-text-secondary-hover-light hover:bg-bg-fill-primary-hover-light dark:text-text-secondary-active-dark dark:hover:text-text-primary-active-dark dark:hover:bg-bg-fill-primary-hover-dark"
                >
                  <InboxIcon className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                </Link>

                <div id="notifications-button" className="relative" ref={notificationsRef}>
                    <button 
                        className="transition-colors duration-200 p-2 rounded-md relative text-text-secondary-active-light hover:text-text-secondary-hover-light hover:bg-bg-fill-primary-hover-light dark:text-text-secondary-active-dark dark:hover:text-text-primary-active-dark dark:hover:bg-bg-fill-primary-hover-dark" 
                        onClick={() => setIsNotificationsOpen(prev => !prev)}
                    >
                        {unreadCount > 0 && (
                            <span className="fixed flex size-2.5 ml-2.5 -mt-0.75">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark"></span>
                                <span className="relative inline-flex size-2.5 rounded-full bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark"></span>
                            </span>
                        )}
                        <BellIconLight className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} />
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {/* Header with Mark All as Read */}
                            <div className="sticky top-0 p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark flex items-center justify-between">
                                <h3 className="font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        disabled={isMarkingAllRead}
                                        className="text-xs text-text-blue-default-light dark:text-text-blue-default-dark hover:underline disabled:opacity-50"
                                    >
                                        {isMarkingAllRead ? 'Marking...' : 'Mark all as read'}
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <ul>
                                {(() => {
                                    return safeNotifications.length > 0 ? (
                                        safeNotifications.map((notification, index) => (
                                            <li 
                                                key={notification.userNotificationId || index}
                                                className={`border-b border-border-primary-default-light dark:border-border-primary-default-dark p-4 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors ${
                                                    !notification.isRead ? 'bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark' : ''
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark">
                                                            {notification.typeLabel || 'Notification'}
                                                        </p>
                                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">
                                                            {notification.message || JSON.stringify(notification)}
                                                        </p>
                                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-2 opacity-70">
                                                            {notification.timeAgo}
                                                        </p>
                                                    </div>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.userNotificationId)}
                                                            className="flex-shrink-0 px-2 py-1 text-xs bg-text-blue-default-light dark:bg-text-blue-default-dark text-white rounded hover:opacity-80 transition-opacity"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-4 text-center text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            No notifications
                                        </li>
                                    );
                                })()}
                            </ul>
                        </div>
                    )}
                </div>

                <ToggleTheme />
                
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

                                {availableViews.length > 1 && (
                                    <li className="mb-2 px-3">
                                        <div className="flex items-center gap-2 py-1">
                                            <span className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wider">View:</span>
                                            <select
                                                value={activeView}
                                                onChange={(e) => onViewChange(e.target.value)}
                                                className="text-sm font-semibold bg-transparent border border-border-primary-default-light dark:border-border-primary-default-dark rounded px-2 py-1 outline-none"
                                            >
                                                {availableViews.map(v => (
                                                    <option key={v} value={v}>{viewLabels[v] || v}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </li>
                                )}

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