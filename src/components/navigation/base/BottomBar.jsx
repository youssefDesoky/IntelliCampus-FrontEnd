import { NavLink } from "react-router-dom";

const linkCls = (isActive) => {
    const activePart = isActive ?
        `bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark text-text-accent-active-light dark:text-text-accent-active-dark active-link` :
        "border border-transparent text-text-secondary-active-light dark:text-text-secondary-active-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark";
    
    return `flex items-center justify-center gap-3 p-2 rounded overflow-hidden ${activePart}`;
};

export default function BottomBar({ links=[], children }) {  
    const dashboardLink = links.find(link => link.to === "/");
    const otherLinks = links.filter(link => link.to !== "/");
    
    return (
        <nav 
            id="bottom-bar" 
            className={`fixed flex flex-row justify-around h-auto w-full bottom-0 left-0 z-50 p-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark`}
        >
            {dashboardLink && (
                <NavLink to={dashboardLink.to} end className={({ isActive }) => linkCls(isActive)} title={dashboardLink.label}>                
                    <dashboardLink.icon className="w-5 h-5" />
                </NavLink>
            )}

            {children}

            {otherLinks.map(({ to, label, icon: Icon }) => (
                <NavLink 
                    key={to} 
                    to={to} 
                    end 
                    className={({ isActive }) => linkCls(isActive)} 
                    title={label}
                >
                    {Icon && <Icon className="w-5 h-5" />}
                </NavLink>
            ))}
        </nav>
    );
}