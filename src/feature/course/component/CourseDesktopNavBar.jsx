import { NavLink } from "react-router-dom";

const desktopLinkStyles = (isActive) => `block px-4 py-2 border-b-2 font-medium transition-all duration-200 ${
    isActive 
        ? 'border-border-accent-default-light dark:border-border-accent-default-dark text-text-accent-default-light dark:text-text-accent-default-dark' 
        : 'border-transparent hover:border-border-tertiary-hover-light dark:hover:border-border-tertiary-hover-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark'
}`;

export default function CourseDesktopNavBar({ links }) {
    return (
        <menu className="flex flex-row gap-4 overflow-x-auto border-b border-border-tertiary-default-light dark:border-border-tertiary-default-dark mb-4">
            {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => desktopLinkStyles(isActive)}>
                    {link.label}
                </NavLink>
            ))}
        </menu>
    );
}