import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

// Icons
import IntelliCampusLogo from "../icons/IntelliCampusIcon";
import BellIconLight from "../icons/BellIconLight";
import MoonIcon from "../icons/MoonIcon";
import SunIcon from "../icons/SunIcon";

export default function Header({style, userData}) {
    return (
        <header className={`${style} transition-colors duration-300 ease-in-out`}>
            <div id="header-logo" >
              {/* Need To Change Color using variables */}
                <NavLink to="/" className="flex flex-row items-center gap-2 cursor-none" data-cursor="clickable">
                    <IntelliCampusLogo className="w-12 h-12" />
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
                <div id="header-localization" className="flex flex-row items-center gap-1 p-1 border-2 rounded-md border-muted-border-light bg-muted-bg-light dark:border-muted-border-dark dark:bg-muted-bg-dark">
                    <button className="px-2 py-1 cursor-none text-sm font-medium rounded-md bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark">EN</button>
                  
                    <button className="px-2 py-1 cursor-none text-sm font-medium rounded-md transition-colors duration-200 text-secondary-text-light hover:text-primary-text-light hover:bg-muted-hover-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-muted-hover-dark">AR</button>
                </div>

                <div id="notifications-button" className="relative">
                    <button className="transition-colors duration-200 p-2 rounded-md relative cursor-none text-secondary-text-light hover:text-primary-text-light hover:bg-hover-light dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-hover-dark" data-cursor="clickable">
                        <span className="fixed flex size-3 ml-3 -mt-1">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-accent-light dark:bg-accent-dark"></span>
                            <span className="relative inline-flex size-3 rounded-full bg-accent-light dark:bg-accent-dark"></span>
                        </span>
                        <BellIconLight className="w-6 h-6" />
                    </button>
                </div>

                <div id="theme-toggle">
                    <button
                        id="dark-mode-btn"
                        className="transition-colors duration-200 p-2 rounded-md relative cursor-none text-secondary-text-light hover:text-primary-text-light hover:bg-hover-light dark:hover:bg-hover-dark"
                        onClick={() => { 
                            document.documentElement.setAttribute("data-theme", "dark");
                            document.getElementById("dark-mode-btn").classList.add("hidden");
                            document.getElementById("light-mode-btn").classList.remove("hidden");
                        }}
                    >
                        <MoonIcon className="w-6 h-6" />
                    </button>

                    <button
                        id="light-mode-btn"
                        className="hidden transition-colors duration-200 p-2 rounded-md relative cursor-none dark:text-secondary-text-dark dark:hover:text-primary-text-dark dark:hover:bg-hover-dark"
                        onClick={() => { 
                            document.documentElement.setAttribute("data-theme", "light");
                            document.getElementById("light-mode-btn").classList.add("hidden");
                            document.getElementById("dark-mode-btn").classList.remove("hidden");
                        }}
                    >
                        <SunIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <NavLink to="/profile" className="block w-12 h-12 rounded-full border-2 cursor-none hover:scale-110 transition-transform duration-200 border-accent-light dark:border-accent-dark">
                    <div className="w-full h-full rounded-full overflow-hidden">
                        <img src={userData.profileImage} alt={userData.name} className="w-full h-full object-cover" />
                    </div>
                </NavLink>
            </div>
        </header>
    );
}