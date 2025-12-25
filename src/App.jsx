// Curser
import CustomCursor from "./components/ui/CustomCursor";

// Data
import studentData from "./data/student.js";
import coursesData from "./data/courses.js";
import communitiesData from "./data/communities.js";

// Layout
import Header from "./components/layout/Header";
import Aside from "./components/layout/Aside";
import Fahim from "./components/layout/Fahim";

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DailyManager from "./components/DailyManager";
import FahimAI from "./pages/student/fahimAI/FahimAI";
import Reminders from "./pages/student/reminders/Reminders";
import Courses from "./pages/student/courses/Courses";
import ProfilePage from "./pages/student/profile/ProfilePage";
import LoginPage from "./feature/auth/pages/LoginPage";
import Community from "./pages/student/community/Community";
import SmartNotes from "./pages/student/smartNotes/SmartNotes";
import Dashboard from "./pages/student/dashboard/Dashboard";

// Icons
import SidebarIcon from "./components/icons/SidebarIcon";
import BellIconDark from "./components/icons/BellIconDark";
import HouseIcon from "./components/icons/HouseIcon";
import CalendarDaysIcon from "./components/icons/CalendarIcon";
import StickyNoteIcon from "./components/icons/StickyNoteIcon";
import BookIcon from "./components/icons/BookIcon";
import UsersIcon from "./components/icons/UsersIcon";
import SignOutIcon from "./components/icons/SignOutIcon";

export default function App() {
  const currStudentData = studentData[1]; // Assuming we are using the first student's data


  const linkCls = (isActive) => {
    const sidebarWidth =
      typeof window !== "undefined"
        ? parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width")) || 256
        : 256;
    const activePart = isActive ?
      `transition-transform duration-200 ease-in-out bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark ${sidebarWidth >= 175 ? "transform translate-x-2" : ""} active-link` :
      "transition-colors duration-200 border border-transparent text-secondary-text-light hover:bg-hover-light hover:text-accent-text-light hover:border-muted-border-light dark:text-secondary-text-dark dark:hover:bg-hover-dark dark:hover:text-accent-text-dark";
    
    return `flex items-center gap-3 p-2 rounded cursor-none ${activePart}`;
  };

  return (
    <>
      <CustomCursor />
      <BrowserRouter>
        <div className="min-h-screen bg-page-bg-light text-primary-text-light dark:bg-page-bg-dark dark:text-primary-text-dark transition-colors duration-300 ease-in-out">
          <div className="mx-auto flex">
            <Header 
              style="w-full h-[80px] fixed top-0 left-0 right-0 flex items-center justify-between p-[16px] z-10 border-b border-default-border-light bg-surface-bg-light text-primary-text-light dark:border-default-border-dark dark:bg-surface-bg-dark dark:text-primary-text-dark" 
              userData={currStudentData} 
            />

            <Aside className="w-64 top-20 h-[calc(100vh-80px)] sticky left-0 border-r border-default-border-light bg-surface-bg-light dark:border-default-border-dark dark:bg-surface-bg-dark dark:text-primary-text-dark">
              {/* Need To Change Color using variables */}
              <div id="toggle-sidebar" className="flex flex-row-reverse z-50 mb-8 pb-2 border-b border-default-border-light dark:border-default-border-dark">
                <button className="p-2 cursor-none hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" data-cursor="clickable">
                  <SidebarIcon className="w-5 h-5" />
                </button>
              </div>
              
              <NavLink to="/" end className={({ isActive }) => linkCls(isActive)}>                
                <HouseIcon className="w-5 h-5" />
                <span className="text-base font-semibold">Dashboard</span>
              </NavLink>

              <NavLink to="/courses" className={({ isActive }) => linkCls(isActive)}>
                <BookIcon className="w-5 h-5" />
                <span className="text-base font-semibold">My Courses</span>
              </NavLink>

              <NavLink to="/reminders" className={({ isActive }) => linkCls(isActive)}>
                <BellIconDark className="w-5 h-5" />
                <span className="text-base font-semibold">Reminders</span>
              </NavLink>

              <NavLink to="/smart-notes" className={({ isActive }) => linkCls(isActive)}>
                <StickyNoteIcon className="w-5 h-5" />
                <span className="text-base font-semibold">Smart Notes</span>
              </NavLink>

              <NavLink to="/community" className={({ isActive }) => linkCls(isActive)}>
                <UsersIcon className="w-5 h-5" />
                <span className="text-base font-semibold">Community</span>
              </NavLink>

              <NavLink to="/Schedule" className={({ isActive }) => linkCls(isActive)}>
                <CalendarDaysIcon className="w-5 h-5" />
                <span className="text-base font-semibold">Schedule</span>
              </NavLink>

              <div className="border-t border-default-border-light dark:border-default-border-dark mt-8" />

              {/* Need To Change Color using variables */}
              <button
                id="sidebar-logout"
                className="mt-2 border-transparent p-2 w-full rounded-md border hover:border-default-border-light dark:hover:border-default-border-dark flex items-center gap-3 text-gray-700 hover:bg-gray-100 transition-transform duration-200 ease-in-out cursor-none"
              >
                <SignOutIcon className="w-5 h-5" />
                <span className="text-base font-medium">Logout</span>
              </button>
            </Aside>

            <main className="container mx-auto mt-20 py-6">
              <Routes>
                <Route path="/profile" element={<ProfilePage studentData={currStudentData} />} />
                <Route path="/fahim" element={<FahimAI />} />
                
                <Route path="/" element={<Dashboard studentData={currStudentData} />} />
                <Route path="/courses" element={<Courses studentsCourses={currStudentData.courses} />} />
                <Route path="/reminders" element={<Reminders studentReminders={currStudentData.reminders} />} />
                <Route path="/smart-notes" element={<SmartNotes studentNotes={currStudentData.notes} />} />
                <Route path="/community" element={<Community community={communitiesData[0]} />} />
                {/* <Route path="/Schedule" element={<Schedule />} /> */}

                <Route path="/login" element={<LoginPage />} />
              </Routes>

              <Fahim />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}