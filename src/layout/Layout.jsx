import useSidebar from '../hooks/useSidebar';
import useDeviceType from '../hooks/useDeviceType';

export default function Layout({header, aside, bottomBar, children}) {
    const { width } = useSidebar();
    const { isMobile } = useDeviceType();

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary-active-light dark:text-text-primary-active-dark">
            <div className="mx-auto">
                {header}
                
                {!isMobile && aside}

                <main 
                    className="container mx-auto mt-0 pt-4 md:pt-6 pb-16 lg:pb-2 px-4 md:px-6 xl:px-8" 
                    style={{
                        marginLeft: !isMobile ? `${width}%` : '0',
                        maxWidth: !isMobile ? `calc(100% - ${width}%)` : '100%'
                    }}
                >
                    {children}
                </main>

                {isMobile && bottomBar}
            </div>
        </div>
    );
}