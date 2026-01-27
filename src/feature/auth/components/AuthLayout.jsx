import useDeviceType from "../../../hooks/useDeviceType";

export default function AuthLayout({title, subtitle, children}) {
    const { isDesktop } = useDeviceType();
    const currTheme = localStorage.getItem('theme') || 'light';

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-r/shorter from-bg-surface-primary-default-light dark:from-bg-surface-primary-default-dark to-blue-50 dark:to-blue-950 px-4">
            <div className={`grid grid-cols-100 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-2xl shadow-2xl w-full h-full lg:w-3/4 lg:h-[80vh]`}>
                {/* Left Side - Image or Illustration */}
                {isDesktop &&                 
                    <div 
                        className="p-5 flex flex-col items-left justify-start space-y-5 rounded-l-2xl col-span-45"
                        style={{ backgroundImage: `url('/images/LoginBG-${currTheme}.png')`, backgroundSize: 'cover' }}
                    >
                        <div className="flex flex-row items-center space-x-2">
                            <img 
                                src="/images/IntelliCampusLogo.png" 
                                alt="IntelliCampus Logo" 
                                className="h-24 w-24 object-contain"
                            />

                            <div className="text-left flex flex-col space-y-1">
                                <h2 className="text-4xl font-['Playfair_Display'] text-text-primary-active-light dark:text-text-primary-active-dark">IntelliCampus</h2>
                                <p className="font-['Source_Sans_3'] text-text-secondary-active-light dark:text-text-secondary-active-dark">Smart Campus. Smart Learning</p>
                            </div>
                        </div>
                    </div> 
                }

                {/* Right Side - Login Form */}
                <div className={`hidden lg:flex flex-col justify-center bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark col-span-100 p-6 lg:rounded-r-2xl lg:col-span-55 lg:p-8"`}>
                    <div className="w-full h-[80%] mx-auto border border-border-primary-default-light dark:border-border-primary-default-dark p-6 lg:p-12 rounded-2xl shadow-2xl min-h-125 max-w-125">
                        <div className="mb-6 space-y-2 md:space-y-3">
                            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                                {title}
                            </h2>
                            <p className="text-text-secondary-active-light dark:text-text-secondary-active-dark text-xs md:text-sm">{subtitle}</p>
                        </div>

                        <div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}