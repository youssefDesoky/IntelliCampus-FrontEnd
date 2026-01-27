import { useLayoutEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SidebarProvider from "./context/SidebarProvider";

import StudentLayout from "./layout/StudentLayout";
import InstructorLayout from "./layout/InstructorLayout";
import AdminLayout from "./layout/AdminLayout";
import CustomCursor from "./ui/CustomCursor";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentProfile from "./pages/student/StudentProfile";
import StudentReminders from "./pages/student/StudentReminders";
import StudentSmartNotes from "./pages/student/StudentSmartNotes";
import StudentCommunity from "./pages/student/StudentCommunity";
import FahimAI from "./pages/student/FahimAI";
import StudentCoursePrerequisites from "./pages/student/StudentCoursePrerequisites";

import CourseLayout from "./components/student/courses/courseDetail/CourseLayout";
import CourseMaterials from "./components/student/courses/courseDetail/CourseMaterials";
import CourseAttendance from "./components/student/courses/courseDetail/CourseAttendance";


// Data
import studentData from "./data/students";
import CreateStudent from "./components/admin/CreateStudent";
import StudentCoursesRegistration from "./pages/student/StudentCoursesRegistration";
import StudentSchedule from "./pages/student/StudentSchedule";

import LoginPage from "./feature/pages/LoginPage";
import ForgetPassword from "./feature/pages/ForgetPassword";
import Attendance from "./components/instructor/attendance/Attendance";


export default function App() {
  const { i18n } = useTranslation();
  const [currStudentData] = useState(studentData[4]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <StudentLayout studentData={currStudentData} />,
      children: [
        {
          index: true,
          element: <StudentDashboard studentData={currStudentData} />
        },
        {
          path: "profile",
          element: <StudentProfile studentData={currStudentData} />
        },
        {
          path: "fahim",
          element: <FahimAI />
        },
        {
          path: "courses",
          element: <StudentCourses studentsCourses={currStudentData.courses} />
        },
        {
          path: "courses/:courseId/*",
          element: <CourseLayout courses={currStudentData.courses} />,
          children: [
            {
              index: true,
              element: <div>Course Announcements Content</div>
            },
            {
              path: "materials",
              element: <CourseMaterials />
            },
            {
              path: "assignments",
              element: <div>Course Assignments Content</div>
            },
            {
              path: "quizzes",
              element: <div>Course Quizzes Content</div>
            },
            {
              path: "attendance",
              element: <CourseAttendance />
            },
            {
              path: "grades",
              element: <div>Course Grades Content</div>
            },
            {
              path: "community",
              element: <StudentCommunity />
            },
            {
              path: "study-group",
              element: <div>Course Study Group Content</div>
            }
          ]
        },
        {
          path: "courses/registration",
          element: <StudentCoursesRegistration />
        },
        {
          path: "courses/prerequisites",
          element: <StudentCoursePrerequisites />
        },
        {
          path: "reminders",
          element: <StudentReminders studentReminders={currStudentData.reminders} />
        },
        {
          path: "smart-notes",
          element: <StudentSmartNotes studentNotes={currStudentData.notes} />
        },
        {
          path: "schedule",
          element: <StudentSchedule />
        },
      ]
    },
    {
      path: "/instructor",
      element: <InstructorLayout />,
      children: [
        {
          path: "/instructor/attendance",
          element: <Attendance />
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: []
    },
    {
      path:"/login",
      element: <LoginPage />
    },
    {
      path: "/forgot-password",
      element: <ForgetPassword />
    }
  ]);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === "dark") {
        document.getElementById("dark-mode-btn")?.classList.add("hidden");
        document.getElementById("light-mode-btn")?.classList.remove("hidden");
      } else {
        document.getElementById("light-mode-btn")?.classList.add("hidden");
        document.getElementById("dark-mode-btn")?.classList.remove("hidden");
      }
    }
  }, []);

  useLayoutEffect(() => {
      document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <>
      <CustomCursor />
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </>
  );
}