import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./layout/AppLayout";

import { RoleGuard } from "./routes/guards";
import { rootAuthLoader } from "./routes/loaders";
import { authAction, logoutAction } from "./routes/actions";

import CustomCursor from "./components/ui/CustomCursor";
import SidebarProvider from "./contexts/SidebarProvider";
import CourseShell from "./feature/course/component/CourseShell";

// Auth Pages
import { LoginPage, ForgetPassword, ResetPassword, UnauthorizedPage } from "./pages/auth";

// Student Pages
import { 
    Profile as StudentProfile,
    Schedule as StudentSchedule,
    MyCourses as StudentCourses,
    Dashboard as StudentDashboard, 
    Reminders as StudentReminders,
    StudyGroup as StudentStudyGroup, 
    SmartNotes as StudentSmartNotes, 
    CourseMaterials as StudentCourseMaterials, 
    CoursePrerequisites as StudentCoursePrerequisites, 
    CoursesRegistration as StudentCoursesRegistration,
} from "./pages/dashboard/student";

import CourseAttendance from "./feature/student/courses/courseDetail/courseAttendance/CourseAttendance";
import CourseAssignments from "./feature/student/courses/courseDetail/assignments/CourseAssignments";
import CourseGrade from "./feature/student/courses/courseDetail/grade/CourseGrade";
import CourseQuizzes from "./feature/student/courses/courseDetail/quizzes/CourseQuizzes";
import CourseQuizPractice from "./feature/student/courses/courseDetail/quizzes/CourseQuizPractice";
import CourseAnnouncements from "./feature/student/courses/courseDetail/announcements/CourseAnnouncements";

// Admin Pages
import { Dashboard as AdminDashboard, ManageInstructors, ManageStudents, StudentDetails, InstructorDetails, ManageAdmins, ManageCourses, ManageCourseClasses, ManageRooms, ManageDepartments, ManageBylaws, ManageExams } from "./pages/dashboard/admin";

// Instructor Pages
import Attendance from "./feature/instructor/components/attendance/Attendance"
import { InstructorCourses, InstructorCourseMaterials, InstructorCourseAssignments, InstructorCourseAttendance, InstructorCourseQuizzes } from "./pages/dashboard/instructor"
import { InstructorCourseAnnouncements } from "./feature/instructor/components/courseAnnouncements"
import { InstructorMeetingRoom } from "./pages/dashboard/instructor"


export default function App() {    
    const { i18n } = useTranslation();

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

    const router = createBrowserRouter([
    {
        id: "root", // 🔑 REQUIRED
        loader: rootAuthLoader,
        element: <AppLayout />,
        children: [
            // ================= STUDENT =================
            {
                element: <RoleGuard allow={["student"]} />,
                children: [
                    { index: true, element: <StudentDashboard /> },
                    { path: "profile", element: <StudentProfile /> },
                    { path: "fahim", element: <div>Fahim AI Content</div> },
                    { path: "courses", element: <StudentCourses /> },

                    {
                        path: "courses/:courseId/*",
                        element: <CourseShell />,
                        children: [
                            { index: true, element: <CourseAnnouncements /> },
                            { path: "materials", element: <StudentCourseMaterials /> },
                            { path: "assignments", element: <CourseAssignments /> },
                            { path: "quizzes", element: <CourseQuizzes /> },
                            { path: "quizzes/practice", element: <CourseQuizPractice /> },
                            { path: "attendance", element: <CourseAttendance /> },
                            { path: "grades", element: <CourseGrade /> },
                            { path: "community", element: <StudentStudyGroup /> },
                            { path: "smart-notes", element: <StudentSmartNotes /> },
                            { path: "meeting", element: <InstructorMeetingRoom /> },
                        ],
                    },

                    { path: "courses/registration", element: <StudentCoursesRegistration /> },
                    { path: "courses/prerequisites", element: <StudentCoursePrerequisites /> },
                    { path: "reminders", element: <StudentReminders /> },
                    { path: "smart-notes", element: <StudentSmartNotes /> },
                    { path: "schedule", element: <StudentSchedule /> },
                ],
            },

            // ================= INSTRUCTOR =================
            {
                path: "instructor",
                element: <RoleGuard allow={["instructor"]} />,
                children: [
                    { index: true, element: <div>Instructor Dashboard Content</div> },
                    { path: "courses", element: <InstructorCourses /> },

                    {
                        path: "courses/:courseId/*", 
                        element: <CourseShell />,
                        children: [
                            { index: true, element: <InstructorCourseAnnouncements /> },
                            { path: "materials", element: <InstructorCourseMaterials /> },
                            { path: "assignments", element: <InstructorCourseAssignments /> },
                            { path: "quizzes", element: <InstructorCourseQuizzes /> },
                            { path: "attendance", element: <InstructorCourseAttendance /> },
                            { path: "grades", element: <div>Course Grades Content</div> },
                            { path: "community", element: <div>Course Community Content</div> },
                            { path: "smart-notes", element: <StudentSmartNotes /> },
                            { path: "meeting", element: <InstructorMeetingRoom /> },
                        ],
                    },
                ],
            },

            // ================= ADMIN =================
            {
                path: "admin",
                element: <RoleGuard allow={["admin", "superadmin"]} />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "analytics", element: <Attendance /> },
                    { path: "admins", element: <ManageAdmins /> },
                    { path: "students", element: <ManageStudents /> },
                    { path: "students/:studentId", element: <StudentDetails /> },
                    { path: "instructors", element: <ManageInstructors /> },
                    { path: "instructors/:instructorId", element: <InstructorDetails /> },
                    { path: "departments", element: <ManageDepartments /> },
                    { path: "courses", element: <ManageCourses /> },
                    { path: "courses/:courseId", element: <ManageCourseClasses /> },
                    { path: "rooms", element: <ManageRooms /> },
                    { path: "bylaws", element: <ManageBylaws /> },
                    { path: "exams", element: <ManageExams /> },
                ],
            },
        ],
    },

    // ================= PUBLIC =================
    { path: "/login", element: <LoginPage />, action: authAction },
    { path: "/forgot-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/unauthorized", element: <UnauthorizedPage /> },
    { path: "/logout", action: logoutAction },
    ]);

    return (
        <>
            {/* <CustomCursor /> */}
            <SidebarProvider>
                <RouterProvider router={router} />
            </SidebarProvider>
        </>
    );
}