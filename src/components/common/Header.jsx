import { useTranslation } from "react-i18next";

import { NavLink } from "react-router-dom";

import Button from "../../ui/Button";
import ToggleViewMode from "../../ui/ToggleViewMode";

// Icons
import { IntelliCampusIcon, BellIconLight, MoonIcon, SunIcon } from "../../ui/icons";

export default function Header({ height, userData }) {
    const { i18n } = useTranslation('common/header');
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
    };

    return (
        <header className={`w-full h-[${height || 80}px] fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10 border-b border-default-border-light bg-surface-bg-light text-primary-text-light dark:border-default-border-dark dark:bg-surface-bg-dark dark:text-primary-text-dark`}>
            <div id="header-logo" >
              {/* Need To Change Color using variables */}
                <NavLink to="/" className="flex flex-row items-center gap-2">
                    <IntelliCampusIcon className="w-12 h-12" />
                    <div className="text-lg font-bold flex flex-col leading-none logo-title">
                        <span
                            className="inline-block overflow-hidden w-0 text-blue-900 typewriter"
                            style={{ "--w": "6ch", "--steps": "6", "--d": "1.2s", "--delay": "0s" }}
                        >
                            Intelli
                        </span>
                        <span
                            className="inline-block overflow-hidden w-0 text-blue-500 typewriter"
                            style={{ "--w": "7ch", "--steps": "7", "--d": "1.2s", "--delay": "1.25s" }}
                        >
                            Campus
                        </span>
                    </div>
                </NavLink>
            </div>

            <div className="flex items-center gap-4">
                <ToggleViewMode 
                    id="header-localization"
                    isVertical={false}
                    firstMode={i18n.language === 'en'}
                    secondMode={i18n.language === 'ar'}
                    onFirstModeSelect={() => changeLanguage('en')}
                    onSecondModeSelect={() => changeLanguage('ar')}
                    firstModeLabel="EN"
                    secondModeLabel="AR"
                />

                <div id="notifications-button" className="relative">
                    <Button className="transition-colors duration-200 p-2 rounded-md relative text-secondary-text-light hover:text-primary-text-light hover:bg-hover-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-hover-dark">
                        <span className="fixed flex size-3 ml-3 -mt-1">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-accent-light dark:bg-accent-dark"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-accent-light dark:bg-accent-dark"></span>
                        </span>
                        <BellIconLight className="w-6 h-6" />
                    </Button>
                </div>

                <div id="theme-toggle">
                    <Button
                        id="dark-mode-btn"
                        className="transition-colors duration-200 p-2 rounded-md relative text-secondary-text-light hover:text-primary-text-light hover:bg-hover-light dark:hover:bg-hover-dark"
                        onClick={() => { 
                            document.documentElement.setAttribute("data-theme", "dark");
                            document.getElementById("dark-mode-btn").classList.add("hidden");
                            document.getElementById("light-mode-btn").classList.remove("hidden");
                            localStorage.setItem("theme", "dark");
                        }}
                    >
                        <MoonIcon className="w-6 h-6" />
                    </Button>

                    <Button
                        id="light-mode-btn"
                        className="hidden transition-colors duration-200 p-2 rounded-md relative dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-hover-dark"
                        onClick={() => { 
                            document.documentElement.setAttribute("data-theme", "light");
                            document.getElementById("light-mode-btn").classList.add("hidden");
                            document.getElementById("dark-mode-btn").classList.remove("hidden");
                            localStorage.setItem("theme", "light");
                        }}
                    >
                        <SunIcon className="w-6 h-6" />
                    </Button>
                </div>
                
                <NavLink to="/profile" className="block w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform duration-200 border-accent-light dark:border-accent-dark">
                    <div className="w-full h-full rounded-full overflow-hidden">
                        <img src={userData.profileImage} alt={userData.name} className="w-full h-full object-cover" />
                    </div>
                </NavLink>
            </div>
        </header>
    );
}