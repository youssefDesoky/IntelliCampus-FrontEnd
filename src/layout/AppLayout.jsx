import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useRouteLoaderData, useSearchParams, useNavigate } from 'react-router-dom';
import { useSidebar, useDeviceType } from '../hooks';
import usePushNotifications from '../hooks/usePushNotifications';
import useScrollVisibility from '../hooks/useScrollVisibility';
import { getAside, getBottomBar, getHeader } from '../utils/layoutHelper';
import Chat from '../feature/chat/components/Chat';
import CommentsIcon from '../components/ui/icons/CommentsIcon';
import { setOpenChatHandler } from '../utils/notificationHandler';

const VIEW_TYPES = ['student', 'instructor', 'admin'];
const VIEW_DASHBOARD_MAP = { student: '/', instructor: '/instructor', admin: '/admin' };

function resolvePrimaryRole(roles) {
    const r = (roles || []).map(r => r.toLowerCase());
    if (r.some(x => x === 'superadmin')) return 'superadmin';
    if (r.some(x => x.startsWith('admin'))) return 'admin';
    if (r.some(x => x === 'instructor')) return 'instructor';
    if (r.some(x => x.startsWith('student'))) return 'student';
    return null;
}

function getAvailableViews(roles) {
    const r = (roles || []).map(r => r.toLowerCase());
    const views = [];
    if (r.some(x => x.startsWith('student'))) views.push('student');
    if (r.some(x => x === 'instructor')) views.push('instructor');
    if (r.some(x => x.startsWith('admin') || x === 'superadmin')) views.push('admin');
    return views;
}

export default function AppLayout() {
    const { t } = useTranslation('common');
    const ASIDEHEIGHT = 80;
    const { width } = useSidebar();
    const { isMobile, isPhone } = useDeviceType();
    const barVisible = useScrollVisibility();
    const navigate = useNavigate();
    const user = useRouteLoaderData("root");
    const [searchParams] = useSearchParams();
    const primaryRole = resolvePrimaryRole(user?.roles);
    const isStudent = primaryRole === 'student';
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatDefaultPanel, setChatDefaultPanel] = useState(null);
    const [chatDefaultPanelTrigger, setChatDefaultPanelTrigger] = useState(0);
    const [chatDefaultUserId, setChatDefaultUserId] = useState(null);
    const [chatDefaultGroupName, setChatDefaultGroupName] = useState(null);

    const availableViews = getAvailableViews(user?.roles);
    const [activeView, setActiveView] = useState(() => {
        const saved = localStorage.getItem('activeView');
        if (saved && availableViews.includes(saved)) return saved;
        if (availableViews.length > 0) return availableViews[0];
        return resolvePrimaryRole(user?.roles) || 'student';
    });

    const handleViewChange = (view) => {
        setActiveView(view);
        localStorage.setItem('activeView', view);
        const target = VIEW_DASHBOARD_MAP[view];
        if (target && window.location.pathname !== target) {
            navigate(target, { replace: true });
        }
    };

    useEffect(() => {
      const openChatParam = searchParams.get("openChat");
      if (openChatParam === "addFriend" || openChatParam === "message") {
        if (openChatParam === "addFriend") {
          setChatDefaultPanel("addFriend");
          setChatDefaultUserId(null);
          setChatDefaultPanelTrigger(prev => prev + 1);
          setIsChatOpen(true);
        } else {
          const userId = searchParams.get("userId");
          const userName = searchParams.get("userName");
          setChatDefaultPanel("messaging");
          setChatDefaultUserId(userId ? { id: userId, name: userName || "User" } : null);
          setChatDefaultPanelTrigger(prev => prev + 1);
          setIsChatOpen(true);
        }

        const currentPath = window.location.pathname;
        const isStudentAccessible = availableViews.includes('student');
        const safePath = (currentPath === '/' && !isStudentAccessible)
          ? (availableViews.includes('instructor') ? '/instructor'
            : availableViews.includes('admin') ? '/admin'
            : currentPath)
          : currentPath;

        navigate(safePath, { replace: true });
      }
    }, [searchParams, navigate, availableViews]);

    usePushNotifications(true);

    useEffect(() => {
        setOpenChatHandler((type, userId, userName) => {
            if (type === 'addFriend') {
                setChatDefaultPanel("addFriend");
                setChatDefaultUserId(null);
                setChatDefaultGroupName(null);
                setChatDefaultPanelTrigger(prev => prev + 1);
                setIsChatOpen(true);
            } else if (type === 'message' || type === 'user') {
                setChatDefaultPanel("messaging");
                setChatDefaultUserId(userId ? { id: userId, name: userName || "User" } : null);
                setChatDefaultGroupName(null);
                setChatDefaultPanelTrigger(prev => prev + 1);
                setIsChatOpen(true);
            } else if (type === 'group') {
                setChatDefaultPanel("messaging");
                setChatDefaultUserId(null);
                setChatDefaultGroupName(userId);
                setChatDefaultPanelTrigger(prev => prev + 1);
                setIsChatOpen(true);
            }
        });
        return () => setOpenChatHandler(null);
    }, []);

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary-active-light dark:text-text-primary-active-dark">
            <div className="mx-auto">
                    {getHeader(isMobile, isPhone, user?.profileImage, user?.notifications, {
                        availableViews,
                        activeView,
                        onViewChange: handleViewChange
                    })}
                    
                    {!isMobile && getAside(activeView, ASIDEHEIGHT)}

                    <main 
                        className="container mx-auto mt-0 pt-4 md:pt-6 pb-16 lg:pb-2 px-4 md:px-6 xl:px-8" 
                        style={{
                            marginInlineStart: !isMobile ? `${width}%` : '0',
                            maxWidth: !isMobile ? `calc(100% - ${width}%)` : '100%'
                        }}
                    >
                        <Outlet context={{ user }} />
                    </main>

                    {/* Chatting interface - outside main to overlay everything */}
                    <Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} currentUser={user} defaultPanel={chatDefaultPanel} defaultPanelTrigger={chatDefaultPanelTrigger} defaultUser={chatDefaultUserId} defaultGroupName={chatDefaultGroupName} />

                    {!isChatOpen && (
                        isMobile ? getBottomBar(activeView, {
                            visible: isPhone ? barVisible : true,
                            floatingAction: (
                                <button
                                    onClick={() => setIsChatOpen(true)}
                                    className="relative w-24 h-24 rounded-full hover:scale-110 active:scale-95 transition-all duration-200"
                                    aria-label="Open chat"
                                >
                                    <img
                                        src="/static/images/faheem-avatar.png"
                                        alt="Open chat"
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                    <img
                                        src="/static/images/Fahim_Boarder.svg"
                                        alt=""
                                        className="absolute inset-0 w-full h-full dark:brightness-[1.8]"
                                    />
                                </button>
                            )
                        }) : (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="fixed bottom-6 right-8 z-50 w-24 h-24 rounded-full hover:scale-110 active:scale-95 transition-all duration-200"
                                aria-label={t('openChat')}
                            >
                                <img
                                    src="/static/images/faheem-avatar.png"
                                    alt={t('openChat')}
                                    className="absolute inset-0 w-full h-full object-contain"
                                />
                                <img
                                    src="/static/images/Fahim_Boarder.svg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full dark:brightness-[1.8]"
                                />
                            </button>
                        )
                    )}
            </div>
        </div>
    );
}