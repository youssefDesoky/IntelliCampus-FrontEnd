import CoursePrerequisitesHeader from "../../components/student/courses/coursePrerequisites/CoursePrerequisitesHeader";
import CoursePrerequisitesBody from "../../components/student/courses/coursePrerequisites/CoursePrerequisitesBody";
import useDeviceType from "../../hooks/useDeviceType";

export default function StudentCoursePrerequisites() {
    const { isMobile } = useDeviceType();
    return (
        <>
            <CoursePrerequisitesHeader isMobile={isMobile} />
            <CoursePrerequisitesBody isPhone={isMobile} isTablet={!isMobile} viewMode="grid-3" />
        </>
    );
}