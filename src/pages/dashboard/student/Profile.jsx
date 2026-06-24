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

export default function Profile() {
    const authUser = useRouteLoaderData("root");
    const studentId = authUser?.roles?.some((r) => r.toLowerCase().startsWith("student")) ? authUser?.userId : null;
    const { showError } = useError();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        let cancelled = false;

        async function init() {
            if (!studentId) {
                if (!cancelled) setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const student = await fetchStudentProfile(studentId);
                if (!cancelled) setUserData(mapBackendToUserData(student));
            } catch (err) {
                if (!cancelled) showError(err?.message || "Failed to load profile");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        init();
        return () => { cancelled = true; };
    }, [studentId, showError]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading profile...</p>
            </div>
        );
    }

    if (!userData) {
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
                        <IdentityCard user={userData} className="flex-1 min-h-0" onProfileUpdate={refreshUserData} />
                        <AccountControlsCard className="shrink-0" />
                    </div>
                    <div className="flex h-full flex-col gap-6">
                        <AcademicInfoCard user={userData} />
                        <PerformanceCard user={userData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
