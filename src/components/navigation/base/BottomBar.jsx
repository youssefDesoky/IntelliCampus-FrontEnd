import { NavLink, useLocation } from "react-router-dom";

export default function BottomBar({ links = [], leftLinks = [], rightLinks = [], children }) {
    const { pathname } = useLocation();

    // ── Merge all links ──────────────────────────────────────────────
    const allLinks = [...leftLinks, ...links, ...rightLinks];

    const getIsActive = (to) =>
        to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

    // ── Find active & center index ───────────────────────────────────
    const activeIndex = allLinks.findIndex((l) => getIsActive(l.to));
    const centerIndex = Math.floor(allLinks.length / 2);

    // ── Reorder so the active link always lands at center slot ───────
    const reordered = [...allLinks];
    if (activeIndex !== -1 && activeIndex !== centerIndex) {
        const [activeLink] = reordered.splice(activeIndex, 1);
        reordered.splice(centerIndex, 0, activeLink);
    }

    return (
        <nav
            id="bottom-bar"
            className="fixed bottom-0 left-0 right-0 z-50 px-3"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
            <div className="flex items-center justify-around h-[62px] rounded-[18px] border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl px-1">

                {reordered.map(({ to, label, icon: Icon }, index) => {
                    const isActive = getIsActive(to);
                    const isCenterActive = index === centerIndex && isActive;

                    // ── Elevated floating circle (active center) ─────
                    if (isCenterActive) {
                        return (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === "/"}
                                title={label}
                                className="flex flex-col items-center"
                                style={{ transform: "translateY(-20px)", animation: "bottomBarPop 0.32s cubic-bezier(0.34,1.56,0.64,1) both" }}
                            >
                                {/* Surface-color ring separates circle from bar edge */}
                                <div className="p-[3px] rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                                    <div
                                        className="w-[54px] h-[54px] rounded-full bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark flex items-center justify-center"
                                        style={{ boxShadow: "0 8px 26px -4px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)" }}
                                    >
                                        {Icon && <Icon className="w-[26px] h-[26px] text-white" />}
                                    </div>
                                </div>
                                {/* Label sits inside the bar below the popped circle */}
                                <span className="mt-1 text-[10px] font-semibold leading-none text-text-accent-active-light dark:text-text-accent-active-dark">
                                    {label}
                                </span>
                            </NavLink>
                        );
                    }

                    // ── Regular item ─────────────────────────────────
                    return (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/"}
                            title={label}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors duration-150
                                ${isActive
                                    ? "text-text-accent-active-light dark:text-text-accent-active-dark"
                                    : "text-text-secondary-active-light dark:text-text-secondary-active-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark"
                                }`}
                        >
                            {Icon && <Icon className="w-5 h-5" />}
                            <span className="text-[10px] font-medium">{label}</span>
                        </NavLink>
                    );
                })}

                {children}
            </div>

            {/* Pop-in keyframe for the center circle */}
            <style>{`
                @keyframes bottomBarPop {
                    from { opacity: 0; transform: translateY(-10px) scale(0.72); }
                    to   { opacity: 1; transform: translateY(-20px) scale(1); }
                }
            `}</style>
        </nav>
    );
}