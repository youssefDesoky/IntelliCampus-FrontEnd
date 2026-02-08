import CoursePrerequisitesHeader from "../../../feature/student/courses/coursePrerequisites/CoursePrerequisitesHeader";
import CoursePrerequisitesBody from "../../../feature/student/courses/coursePrerequisites/CoursePrerequisitesBody";
import useDeviceType from "../../../hooks/useDeviceType";
import AppLayout from "../../../layout/AppLayout";

export default function CoursePrerequisites() {
    const { isMobile } = useDeviceType();
    return (
        <>
            <CoursePrerequisitesHeader isMobile={isMobile} />
            <CoursePrerequisitesBody isPhone={isMobile} isTablet={!isMobile} viewMode="grid-3" />
        </>
    );
}