// Translations
import { useTranslation } from 'react-i18next';

import React, {  useLayoutEffect, useState } from "react";

import Button from "../../ui/Button";

// Icons
import { SidebarIcon, SignOutIcon } from "../../ui/icons";

export default function Aside({ children, height, minWidth = 75, maxWidth = 256 }) {
  const { t } = useTranslation('common/aside');

  const [width, setWidth] = useState(() => {
    const savedWidth = localStorage.getItem('sidebar-width');
    return savedWidth ? parseInt(savedWidth) : maxWidth;
  });

  useLayoutEffect(() => {
    localStorage.setItem('sidebar-width', width);
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [width]);

  const toggleSidebar = () => {
    setWidth((w) => (w === maxWidth ? minWidth : maxWidth));
  }

  return (
    <aside 
      id="sidebar" 
      className={`fixed p-4 flex flex-col w-64 left-0 border-r border-default-border-light bg-surface-bg-light dark:border-default-border-dark dark:bg-surface-bg-dark dark:text-primary-text-dark`}
      style={{ height: `calc(100vh - ${height || 80}px)`,  top: `${height || 80}px`, width: `${width}px` }}
    >

      <nav className="flex-1 space-y-2">
        {/* Need To Change Color using variables */}
        <div id="toggle-sidebar" className="flex flex-row-reverse z-50 mb-8 pb-2 border-b border-default-border-light dark:border-default-border-dark">
          <Button 
            className="p-2 hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out"
            onClick={() => { toggleSidebar(); }}
          >
            <SidebarIcon className="w-5 h-5" />
          </Button>
        </div>

        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          const compact = width < 175;
          const childChildren = React.Children.toArray(child.props.children);

          const safeIcon =
            React.isValidElement(childChildren[0])
              ? childChildren[0]
              : React.createElement(
                  "span",
                  { className: "flex items-center justify-center" },
                  childChildren[0]
                );

          const origClass = child.props.className;

          const newClass =
            typeof origClass === "function"
              ? (state) => {
                  let res = origClass(state) || "";
                  if (!compact) {
                    // Restore translate-x-2 if active-link and not present
                    if (res.includes("active-link") && !res.includes("translate-x-2")) {
                      res = (res.replace(/translate-x-0 justify-center/g, "") + " translate-x-2").trim();
                    } else {
                      res = res.replace(/translate-x-0 justify-center/g, "").trim();
                    }
                    return res;
                  }
                  // Compact: remove translate-x-2, add center classes
                  return (res.replace(/translate-x-2/g, "") + " translate-x-0 justify-center").trim();
                }
              : (() => {
                  const base = origClass || "";
                  if (compact) {
                    // Compact: remove translate-x-2, add center classes
                    return (base.replace(/translate-x-2/g, "") + " translate-x-0 justify-center").trim();
                  }
                  // Maximized: restore translate-x-2 if active-link and not present
                  if (base.includes("active-link") && !base.includes("translate-x-2")) {
                    return (base.replace(/translate-x-0 justify-center/g, "") + " translate-x-2").trim();
                  }
                  return base.replace(/translate-x-0 justify-center/g, "").trim();
                })();

          return React.cloneElement(
            child,
            { className: newClass },
            compact ? safeIcon : child.props.children
          );
        })}

        <div className="border-t border-default-border-light dark:border-default-border-dark mt-8" />

        <Button
          id="sidebar-logout"
          className="mt-2 p-2 w-full flex items-center gap-3 border border-transparent rounded-md hover:border-muted-border-light dark:hover:border-muted-border-dark text-red-400 dark:text-red-600 hover:bg-muted-bg-light dark:hover:bg-muted-bg-dark transition-all duration-200 ease-in-out"
        >
          <SignOutIcon className="w-5 h-5" />
          {! (width < 175) && <span className="text-base font-semibold">{t('logout')}</span>}
        </Button>
      </nav>
    </aside>
  );
}
