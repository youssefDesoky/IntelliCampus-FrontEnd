import { useCallback, useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import IdentityCard from "../../../feature/student/profile/IdentityCard";
import AccountControlsCard from "../../../feature/student/profile/AccountControlsCard";
import AcademicInfoCard from "../../../feature/student/profile/AcademicInfoCard";
import PerformanceCard from "../../../feature/student/profile/PerformanceCard";
import { fetchStudentProfile } from "../../../api/studentProfile";
import { useError } from "../../../contexts/ErrorContext";

function mapBackendToUserData(student) {
    return {
        name: student.fullName,
        avatar: student.profileImage || "",
        specialization: student.specializationName || "",
        department: student.departmentName || "",
        faculty: student.facultyName || "",
        studentSince: student.enrollmentDate || "",
        email: student.email || "",
        phone: student.phoneNumber || "",
        address: student.address || "",
        studentCode: student.studentCode || "",
        level: student.level,
        studentType: student.studentType || "",
        bylaw: student.bylawName || "",
        gpa: student.gpa,
        courses: student.courses || [],
        qrCode: "",
        fullNameAr: student.fullNameAr || "",
    };
}

function mapAuthToUserData(auth) {
    if (!auth) return null;
    return {
        name: auth.fullName || auth.name || "",
        avatar: auth.profileImage || "",
        email: auth.email || "",
        phone: auth.phoneNumber || auth.phone || "",
        address: auth.address || "",
        specialization: auth.specialization || "",
        department: auth.departmentName || auth.department || "",
        faculty: auth.facultyName || auth.faculty || "",
        studentSince: auth.enrollmentDate || "",
        studentCode: auth.studentCode || "",
        level: auth.level,
        studentType: auth.studentType || "",
        bylaw: auth.bylawName || "",
        gpa: auth.gpa,
        courses: auth.courses || [],
        qrCode: "",
        fullNameAr: auth.fullNameAr || "",
    };
}

export default function Profile() {
    const authUser = useRouteLoaderData("root");
    const studentId = authUser?.roles?.some((r) => r.toLowerCase().startsWith("student")) ? authUser?.userId : null;
    const { showError } = useError();
    const initialData = mapAuthToUserData(authUser);
    const [userData, setUserData] = useState(initialData);
    const [detailedLoading, setDetailedLoading] = useState(!!studentId);

    const loadProfile = useCallback(async () => {
        if (!studentId) return;
        const student = await fetchStudentProfile(studentId);
        return student;
    }, [studentId]);

    const refreshUserData = useCallback(async () => {
        try {
            const student = await loadProfile();
            if (student) setUserData(mapBackendToUserData(student));
        } catch (err) {
            showError(err?.message || "Failed to load profile");
        }
    }, [loadProfile, showError]);

    useEffect(() => {
        if (!studentId) return;
        let cancelled = false;

        async function init() {
            try {
                const student = await fetchStudentProfile(studentId);
                if (!cancelled) setUserData(mapBackendToUserData(student));
            } catch (err) {
                if (!cancelled) showError(err?.message || "Failed to load profile");
            } finally {
                if (!cancelled) setDetailedLoading(false);
            }
        }

        init();
        return () => { cancelled = true; };
    }, [studentId, showError]);

    if (!userData && !studentId) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Unable to load profile.</p>
            </div>
        );
    }

    return (
        <div className="px-4 lg:px-8 py-6 space-y-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] items-stretch">
                    <div className="flex h-full flex-col gap-6 lg:sticky lg:top-6 self-start">
                        <IdentityCard user={userData} onProfileUpdate={refreshUserData} />
                        <AccountControlsCard className="shrink-0" />
                    </div>
                    <div className="flex h-full flex-col gap-6">
                        <AcademicInfoCard user={userData} loading={detailedLoading} />
                        <PerformanceCard user={userData} loading={detailedLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
