import { Outlet, useRouteLoaderData } from 'react-router-dom';
import { useSidebar, useDeviceType } from '../hooks';
import { getAside, getBottomBar, getHeader } from '../utils/layoutHelper';

export default function AppLayout() {
    const ASIDEHEIGHT = 80;
    const { width } = useSidebar();
    const { isMobile } = useDeviceType();
    const user = useRouteLoaderData("root");
    // const { isFetching, fetchedData: appLayoutData, userRole } = useFetch('api/me', {credentials: 'include'}, true);
    
    // console.log("AppLayout userRole:", userRole);
    // console.log("AppLayout user:", appLayoutData);

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary-active-light dark:text-text-primary-active-dark">
            <div className="mx-auto">
                    {getHeader(isMobile, user.avatar, user.notifications)}
                    
                    {!isMobile && getAside(user.role, ASIDEHEIGHT)}

                    <main 
                        className="container mx-auto mt-0 pt-4 md:pt-6 pb-16 lg:pb-2 px-4 md:px-6 xl:px-8" 
                        style={{
                            marginLeft: !isMobile ? `${width}%` : '0',
                            maxWidth: !isMobile ? `calc(100% - ${width}%)` : '100%'
                        }}
                    >
                        {console.log("AppLayout user:", user)}
                        <Outlet context={{ user }} />
                    </main>

                    {isMobile && getBottomBar(user.role)}
            </div>
            {/* {isFetching || !appLayoutData ? (
                <div>Loading...</div>
            ) : (
                <div className="mx-auto">
                    {getHeader(isMobile, appLayoutData.avatar, appLayoutData.notifications)}
                    
                    {!isMobile && getAside(userRole, ASIDEHEIGHT)}

                    <main 
                        className="container mx-auto mt-0 pt-4 md:pt-6 pb-16 lg:pb-2 px-4 md:px-6 xl:px-8" 
                        style={{
                            marginLeft: !isMobile ? `${width}%` : '0',
                            maxWidth: !isMobile ? `calc(100% - ${width}%)` : '100%'
                        }}
                    >
                        <Outlet context={{ user: appLayoutData }} />
                    </main>

                    {isMobile && getBottomBar(userRole)}
                </div>
            )*/}
        </div>
    );
}