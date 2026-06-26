import { useQuery } from "@tanstack/react-query";
import { useRouteLoaderData } from "react-router-dom";
import AccountControlsCard from "../../../feature/student/profile/AccountControlsCard";
import InstructorIdentityCard from "../../../feature/instructor/profile/InstructorIdentityCard";
import ProfessionalInfoCard from "../../../feature/instructor/profile/ProfessionalInfoCard";
import CoursesCard from "../../../feature/instructor/profile/CoursesCard";
import { fetchInstructorProfile, fetchInstructorCourses } from "../../../feature/instructor/services/profileApi";

function mapBackendToUserData(instructor) {
    return {
        name: instructor.fullName,
        fullName: instructor.fullName,
        avatar: instructor.profileImage || "",
        specialization: instructor.specializationName || instructor.specialization || "",
        department: instructor.departmentName || instructor.department || "",
        faculty: instructor.facultyName || instructor.faculty || "",
        email: instructor.email || "",
        phone: instructor.phoneNumber || "",
        address: instructor.address || "",
        instructorCode: instructor.instructorCode || instructor.instructorId || "",
        nationality: instructor.nationality || "",
        role: instructor.instructorRole || instructor.role || "",
        joinedDate: instructor.enrollmentDate || instructor.createdAt || "",
        facultyName: instructor.facultyName || instructor.faculty || "",
    };
}

function mapAuthToUserData(auth) {
    if (!auth) return null;
    return {
        name: auth.fullName || auth.name || "",
        fullName: auth.fullName || auth.name || "",
        avatar: auth.profileImage || "",
        specialization: auth.specialization || auth.specializationName || "",
        department: auth.departmentName || auth.department || "",
        faculty: auth.facultyName || auth.faculty || "",
        email: auth.email || "",
        phone: auth.phoneNumber || auth.phone || "",
        address: auth.address || "",
        instructorCode: auth.instructorCode || auth.instructorId || "",
        nationality: auth.nationality || "",
        role: auth.instructorRole || auth.role || "",
        joinedDate: auth.enrollmentDate || auth.createdAt || "",
        facultyName: auth.facultyName || auth.faculty || "",
    };
}

export default function InstructorProfile() {
    const authUser = useRouteLoaderData("root");
    const instructorId = authUser?.userId;
    const initialData = mapAuthToUserData(authUser);

    const { data: userData, isLoading: profileLoading, refetch } = useQuery({
        queryKey: ["instructorProfile", instructorId],
        queryFn: async () => {
            const instructor = await fetchInstructorProfile(instructorId);
            return mapBackendToUserData(instructor);
        },
        staleTime: 10 * 60 * 1000,
        enabled: !!instructorId,
        placeholderData: initialData,
    });

    const { data: courses = [], isLoading: coursesLoading } = useQuery({
        queryKey: ["instructorCourses", instructorId],
        queryFn: () => fetchInstructorCourses(instructorId),
        staleTime: 5 * 60 * 1000,
        enabled: !!instructorId,
        select: (data) => (Array.isArray(data) ? data : []),
    });

    if (!userData && !instructorId) {
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
                        <InstructorIdentityCard user={userData} onProfileUpdate={refetch} />
                        <AccountControlsCard className="shrink-0" />
                    </div>
                    <div className="flex h-full flex-col gap-6">
                        <ProfessionalInfoCard user={userData} loading={profileLoading} />
                        <CoursesCard courses={courses} loading={coursesLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}
