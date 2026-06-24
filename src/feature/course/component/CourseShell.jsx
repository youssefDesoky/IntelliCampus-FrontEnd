import { Outlet, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";

import CourseNavBar from "./CourseNavBar";

import Section from "../../../components/ui/Section";
import { 
    BullHornIcon, 
    UsersIcon, 
    FolderOpenIconDark, 
    UserCheckIcon, 
    ChartBarIcon, 
    FilePenIcon, 
    BrainIcon,
    StickyNoteIcon,
    VideoIcon,
    ChartLineIcon,
} from "../../../components/ui/icons";
import { CourseShellSkeleton } from "./SkeletonLoader";
import { fetchCourseMaterialsOrganized } from "../services/materialsApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

const links = [
    { to: "", end: true, icon: <BullHornIcon className="w-5 h-5" />, label: "Announcements" },
    { to: "analytics", icon: <ChartLineIcon className="w-5 h-5" />, label: "Analytics" },
    { to: "materials", icon: <FolderOpenIconDark className="w-5 h-5" />, label: "Materials" },
    { to: "assignments", icon: <FilePenIcon className="w-5 h-5" />, label: "Assignments" },
    { to: "quizzes", icon: <BrainIcon className="w-5 h-5" />, label: "Quizzes" },
    { to: "attendance", icon: <UserCheckIcon className="w-5 h-5" />, label: "Attendance" },
    { to: "grades", icon: <ChartBarIcon className="w-5 h-5" />, label: "Grades" },
    { to: "community", icon: <UsersIcon className="w-5 h-5" />, label: "Study Group" },
    { to: "smart-notes", icon: <StickyNoteIcon className="w-5 h-5" />, label: "Smart Notes" },
    { to: "meeting", icon: <VideoIcon className="w-5 h-5" />, label: "Meeting" },
];

const INSTRUCTOR_HIDE = new Set(["smart-notes"]);
const STUDENT_HIDE = new Set(["analytics"]);

export default function CourseShell() {
    const { courseId } = useParams();
    const { pathname } = useLocation();
    const isInstructor = pathname.startsWith("/instructor");
    const [materialsData, setMaterialsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showError } = useError();

    const loadMaterials = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            const data = await fetchCourseMaterialsOrganized(courseId);
            setMaterialsData(data);
            return data;
        } catch (err) {
            showError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [courseId, showError]);

    // Refresh without showing full-page loading (for child components)
    const refreshMaterials = useCallback(() => loadMaterials(false), [loadMaterials]);

    useEffect(() => {
        loadMaterials(true);
    }, [loadMaterials]);

    // Build the course object for the header and child routes
    const course = {
        id: courseId,
        title: materialsData?.courseName || `Course ${courseId}`,
        semester: materialsData?.semester || "",
        professor: materialsData?.instructorName || "",
        progress: materialsData?.progress ?? 0,
        folders: materialsData?.folders || [],
    };

    const visibleLinks = useMemo(
        () => links.filter((l) => isInstructor ? !INSTRUCTOR_HIDE.has(l.to) : !STUDENT_HIDE.has(l.to)),
        [isInstructor]
    );

    if (isLoading) {
        return <CourseShellSkeleton />;
    }

    return (
        <>
            <Section>
                <CourseNavBar links={visibleLinks} />
                <Outlet context={{ course, courseId, refreshMaterials }} />
            </Section>
        </>
    );
}
