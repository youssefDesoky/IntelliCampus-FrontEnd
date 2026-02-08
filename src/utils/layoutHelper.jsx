import Header from "../components/navigation/base/Header";

import AdminAside from "../components/navigation/admin/AdminAside";
import InstructorAside from "../components/navigation/instructor/InstructorAside";
import StudentAside from "../components/navigation/student/StudentAside";

import AdminBottomBar from "../components/navigation/admin/AdminBottomBar";
import InstructorBottomBar from "../components/navigation/instructor/InstructorBottomBar";
import StudentBottomBar from "../components/navigation/student/StudentBottomBar";

export function getHeader(isMobile, profileImage, notifications) {
    return <Header isMobile={isMobile} profileImage={profileImage} notifications={notifications} />;
}

export function getAside(role, height) {
    switch (role?.toLowerCase()) {
        case "admin": return <AdminAside height={height} />;
        case "instructor": return <InstructorAside height={height} />;
        case "student": return <StudentAside height={height} />;
        default: return null;
    }
}

export function getBottomBar(role) {
    switch (role?.toLowerCase()) {
        case "admin": return <AdminBottomBar />;
        case "instructor": return <InstructorBottomBar />;
        case "student": return <StudentBottomBar />;
        default: return null;
    }
}
