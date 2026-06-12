import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

import useDeviceType from "../../../hooks/useDeviceType";

import CourseHeader from "./CourseHeader";
import CourseDesktopNavBar from "./CourseDesktopNavBar";
import CourseMobileNavBar from "./CourseMobileNavBar";

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
    VideoIcon
} from "../../../components/ui/icons";
import { fetchCourseMaterialsOrganized } from "../services/materialsApi";

const links = [
    { to: "", end: true, icon: <BullHornIcon className="w-5 h-5" />, label: "Announcements" },
    { to: "materials", icon: <FolderOpenIconDark className="w-5 h-5" />, label: "Materials" },
    { to: "assignments", icon: <FilePenIcon className="w-5 h-5" />, label: "Assignments" },
    { to: "quizzes", icon: <BrainIcon className="w-5 h-5" />, label: "Quizzes" },
    { to: "attendance", icon: <UserCheckIcon className="w-5 h-5" />, label: "Attendance" },
    { to: "grades", icon: <ChartBarIcon className="w-5 h-5" />, label: "Grades" },
    { to: "community", icon: <UsersIcon className="w-5 h-5" />, label: "Study Group" },
    { to: "smart-notes", icon: <StickyNoteIcon className="w-5 h-5" />, label: "Smart Notes" },
    { to: "meeting", icon: <VideoIcon className="w-5 h-5" />, label: "Meeting" },
];

export default function CourseShell() {
    const { courseId } = useParams();
    const { isMobile } = useDeviceType();
    const [materialsData, setMaterialsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMaterials = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            setError(null);
            const data = await fetchCourseMaterialsOrganized(courseId);
            setMaterialsData(data);
            return data;
        } catch (err) {
            console.error("Failed to load course materials:", err);
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

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

    if (isLoading) {
        return <p>Loading course data...</p>;
    }

    if (error) {
        return <p>Error loading course: {error}</p>;
    }

    return (
        <>
            <CourseHeader isMobile={isMobile} course={course} links={links} />

            <Section>
                { isMobile ? <CourseMobileNavBar links={links} /> : <CourseDesktopNavBar links={links} /> }
                <Outlet context={{ course, courseId, refreshMaterials }} />
            </Section>
        </>
    );
}
