import React, { useEffect, useState } from "react";

export default function Aside({ children, className = "", minWidth = 75, maxWidth = 256 }) {
  const [width, setWidth] = useState(maxWidth);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${width}px`
    );
  }, [width]);

  useEffect(() => {
    const el = document.getElementById("toggle-sidebar");

    if (!el) return;

    const handler = () => {
      setWidth((w) => (w === maxWidth ? minWidth : maxWidth));
    };

    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [minWidth, maxWidth]);

  return (
    <aside id="sidebar" className={`relative p-4 flex flex-col ${className} transition-colors duration-300 ease-in-out`} style={{ width: `${width}px` }}> {/* transition-all duration-300 ease-in-out */}
      <nav className="flex-1 space-y-1">
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
      </nav>
    </aside>
  );
}
