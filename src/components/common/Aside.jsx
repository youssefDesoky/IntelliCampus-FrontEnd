// Translations
import { useTranslation } from "react-i18next";
import Button from "../../ui/Button";
import { SidebarIcon, SignOutIcon } from "../../ui/icons";
import React from "react";
import useSidebar from "../../hooks/useSidebar";

export default function Aside({ children, height }) {
  const { t } = useTranslation('common/aside');
  const { width, isCompact, toggleSidebar } = useSidebar();

  const effectiveCompact = isCompact;

  return (
    <aside 
      id="sidebar" 
      className={`${localStorage.getItem('lang') === 'ar' ? 'lg:right-0' : 'lg:left-0'} lg:flex-col lg:border-r fixed z-50 p-4 flex border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark bottom-0 lg:bottom-auto border-t lg:border-t-0`}
      style={{ 
        height: `calc(100vh - ${ height }px)`,  
        top: `${ height }px`, 
        width: `${width}%`
      }}
    >
      <nav className="flex-1 space-y-2 flex flex-col justify-start">
        <div
          id="toggle-sidebar"
          className="flex flex-row justify-end z-60 mb-8 pb-2 border-b border-border-primary-default-light dark:border-border-primary-default-dark"
        >
          <Button 
            className="p-2 hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark"
            onClick={toggleSidebar}
          >
            <SidebarIcon className="w-5 h-5" />
          </Button>
        </div>


        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          const origClass = child.props.className;

          const newClass =
            typeof origClass === "function"
              ? (state) => {
                  let res = origClass(state) || "";
                  if (!effectiveCompact) {
                    if (res.includes("active-link") && !res.includes("translate-x-2")) {
                      res = (res.replace(/translate-x-0/g, "") + " translate-x-2").trim();
                    } else {
                      res = res.replace(/translate-x-0/g, "").trim();
                    }
                    return res;
                  }
                  return (res.replace(/translate-x-2/g, "") + " translate-x-0").trim();
                }
              : (() => {
                  const base = origClass || "";
                  if (effectiveCompact) {
                    return (base.replace(/translate-x-2/g, "") + " translate-x-0").trim();
                  }
                  if (base.includes("active-link") && !base.includes("translate-x-2")) {
                    return (base.replace(/translate-x-0/g, "") + " translate-x-2").trim();
                  }
                  return base.replace(/translate-x-0 /g, "").trim();
                })();

          return React.cloneElement(
            child,
            { 
              className: newClass,
              'data-compact': effectiveCompact ? 'true' : 'false'
            }
          );
        })}

        <div className="z-60 mt-8 pt-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
          <Button
            id="sidebar-logout"
            data-compact={effectiveCompact ? 'true' : 'false'}
            className={`w-full p-2 flex items-center gap-3 border border-transparent rounded-md hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark text-red-400 dark:text-red-600 hover:text-red-500 dark:hover:text-red-700 hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark ${effectiveCompact ? 'justify-center' : ''}`}
          >
            <SignOutIcon className="w-5 h-5 shrink-0" />
            <span className="text-base font-semibold whitespace-nowrap overflow-hidden">{t('logout')}</span>
          </Button>
        </div>
      </nav>
    </aside>
  );
}
