import { useState } from "react";
import ToggleTheme from "../components/ui/ToggleTheme";
// useDeviceType is no longer needed here

export default function AuthLayout({ title, subtitle, bgImageName = "LoginBG", children }) {
    const [currTheme, setCurrTheme] = useState(localStorage.getItem('theme') || 'light');

    const bgStyle = {
        backgroundImage: `url('/images/${bgImageName}-${currTheme}.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-r/shorter from-bg-surface-primary-default-light dark:from-bg-surface-primary-default-dark to-blue-50 dark:to-blue-950 px-4">

            {/*
             * Mobile background — lives on the stable min-h-screen container,
             * not on the form column. Height never changes → no more shifting.
             * lg:hidden removes it on desktop (left column takes over).
             * Pure CSS: zero JS, zero re-render flash.
             */}
            <div className="absolute inset-0 lg:hidden" style={bgStyle} />

            <div className="relative grid grid-cols-100
                            bg-transparent lg:bg-bg-surface-primary-default-light dark:lg:bg-bg-surface-primary-default-dark
                            rounded-2xl lg:shadow-2xl
                            w-full lg:w-3/4 lg:h-[80vh]">

                {/*
                 * Left panel — hidden lg:flex is CSS-only.
                 * display:none removes it from grid flow on mobile
                 * so col-span-45 only "counts" on desktop. No JS flash.
                 */}
                <div
                    className="hidden lg:flex p-5 flex-col items-left justify-start space-y-5 rounded-l-2xl col-span-45"
                    style={bgStyle}
                >
                    <div className="flex flex-row items-center space-x-2">
                        <img
                            src="/images/IntelliCampusLogo.png"
                            alt="IntelliCampus Logo"
                            className="h-24 w-24 object-contain"
                        />
                        <div className="text-left flex flex-col space-y-1">
                            <h2 className="text-4xl font-['Playfair_Display'] text-text-primary-active-light dark:text-text-primary-active-dark">
                                IntelliCampus
                            </h2>
                            <p className="font-['Source_Sans_3'] text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                Smart Campus. Smart Learning
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right panel — transparent on mobile so the background image shows through */}
                <div className="flex flex-col justify-center
                                bg-transparent lg:bg-bg-surface-primary-default-light dark:lg:bg-bg-surface-primary-default-dark
                                col-span-100 p-6 rounded-2xl lg:rounded-bl-none lg:col-span-55 lg:p-8">
                    <div className="w-full mx-auto
                                    bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark
                                    border border-border-primary-default-light dark:border-border-primary-default-dark
                                    p-6 lg:p-12 rounded-2xl shadow-2xl min-h-125 max-w-125
                                    flex flex-col justify-center">
                        <div className="mb-6 space-y-2 md:space-y-3">
                            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                                {title}
                            </h2>
                            <p className="text-text-secondary-active-light dark:text-text-secondary-active-dark text-xs md:text-sm">
                                {subtitle}
                            </p>
                        </div>
                        <div>{children}</div>
                    </div>
                </div>

                <ToggleTheme className="absolute top-2.5 right-2.5" onChange={setCurrTheme} />
            </div>
        </div>
    );
}