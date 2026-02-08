import { useState } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";

const mobileLinkStyles = (isActive) => `flex items-center justify-center w-10 h-10 rounded-full ring-2 ${
    isActive ? 'bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-icon-accent-active-light dark:text-icon-accent-active-dark ring-border-accent-active-light dark:ring-border-accent-active-dark' : 
    'bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-icon-accent-default-light dark:text-icon-accent-default-dark ring-border-primary-default-light dark:ring-border-primary-default-dark'
}`;

export default function CourseMobileNavBar({ links }) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const location = useLocation();
    const { courseId } = useParams();

    const isLinkActive = (linkTo) => {
        const basePath = `/courses/${courseId}`;
        const currentPath = location.pathname;
        if (linkTo === "") {
            return currentPath === basePath || currentPath === `${basePath}/`;
        }
        return currentPath === `${basePath}/${linkTo}`;
    };

    return (
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
    );
}