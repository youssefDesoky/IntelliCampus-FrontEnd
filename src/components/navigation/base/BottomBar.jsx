import { NavLink, useLocation } from "react-router-dom";

const VISIBLE_COUNT = 5;
const CENTER_POSITION = Math.floor(VISIBLE_COUNT / 2);
const SLIDE_EASE = "0.4s cubic-bezier(0.34, 1.56406, 0.64, 1)";

export default function BottomBar({ links = [], leftLinks = [], rightLinks = [], children }) {
    const { pathname } = useLocation();

    // ── دمج كل اللينكات (المفروض يكونوا 7 في حالتك) ──────────────
    const allLinks = [...leftLinks, ...links, ...rightLinks];
    const total = allLinks.length;

    const getIsActive = (to) =>
        to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

    // ── تحديد اللينك النشط ─────────────────────────────────────────────
    const activeIndex = allLinks.findIndex((l) => getIsActive(l.to));
    const activeLink = activeIndex !== -1 ? allLinks[activeIndex] : null;
    const ActiveIcon = activeLink?.icon;

    // ── حساب مكان بداية الشريط (بدون تقييد عشان السنتر يفضل ثابت) ─────
    let startIndex = 0;
    if (activeIndex !== -1) {
        // خلينا الشريط حر تماماً عشان اللينك النشط دايماً ييجي في النص
        startIndex = activeIndex - CENTER_POSITION;
    }

    // ── حسابات الحركة (Carousel math) ──────────────────────────────────
    const safeTotal = total || 1;
    const itemWidthPercent = 100 / safeTotal;                      
    const stripWidthPercent = (safeTotal / VISIBLE_COUNT) * 100;   
    const stripShiftPercent = (startIndex * 100) / safeTotal;      

    // بما إن الشريط هو اللي بيتحرك عشان يسنتر اللينك..
    // إذن الـ Bubble المرفوعة مكانها هيبقى ثابت دايماً في نص الشاشة
    const bubbleLeftPercent = 50;

    return (
        <nav
            id="bottom-bar"
            className="fixed bottom-0 left-0 right-0 z-50 px-3"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
            <div className="flex items-center h-[62px] rounded-[18px] border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl px-1">

                {/* ── الشريط المتحرك ────────────────────────────── */}
                <div className="relative flex-1 h-full">
                    <div className="absolute inset-0 overflow-x-hidden">
                        <div
                            className="flex h-full items-center"
                            style={{
                                width: `${stripWidthPercent}%`,
                                transform: `translateX(-${stripShiftPercent}%)`,
                                transition: `transform ${SLIDE_EASE}`,
                            }}
                        >
                            {allLinks.map(({ to, label, icon: Icon }) => {
                                const isActive = getIsActive(to);
                                return (
                                    <div
                                        key={to}
                                        className="h-full flex-shrink-0 flex items-center justify-center"
                                        style={{ width: `${itemWidthPercent}%` }}
                                    >
                                        {!isActive && (
                                            <NavLink
                                                to={to}
                                                end={to === "/"}
                                                title={label}
                                                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors duration-150 text-text-secondary-active-light dark:text-text-secondary-active-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark"
                                            >
                                                {Icon && <Icon className="w-5 h-5" />}
                                                <span className="text-[10px] font-medium">{label}</span>
                                            </NavLink>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── الدايرة البارزة (اللينك النشط) ────────────────── */}
                    {activeLink && (
                        <div
                            className="absolute z-10"
                            style={{
                                top: "50%",
                                left: `${bubbleLeftPercent}%`,
                                transform: "translate(-50%, calc(-50% - 20px))",
                                transition: `left ${SLIDE_EASE}`,
                            }}
                        >
                            <NavLink
                                key={activeLink.to}
                                to={activeLink.to}
                                end={activeLink.to === "/"}
                                title={activeLink.label}
                                className="flex flex-col items-center"
                                style={{ animation: "bottomBarPop 0.32s cubic-bezier(0.34,1.56406,0.64,1) both" }}
                            >
                                <div className="p-[3px] rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                                    <div
                                        className="w-[54px] h-[54px] rounded-full bg-bg-fill-primary-active-light dark:bg-bg-fill-primary-active-dark flex items-center justify-center"
                                        style={{ boxShadow: "0 8px 26px -4px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)" }}
                                    >
                                        {ActiveIcon && <ActiveIcon className="w-[26px] h-[26px] text-white" />}
                                    </div>
                                </div>
                                <span className="mt-1 text-[10px] font-semibold leading-none text-text-accent-active-light dark:text-text-accent-active-dark">
                                    {activeLink.label}
                                </span>
                            </NavLink>
                        </div>
                    )}
                </div>

                {children}
            </div>

            <style>{`
                @keyframes bottomBarPop {
                    from { opacity: 0; transform: translateY(8px) scale(0.7); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </nav>
    );
}