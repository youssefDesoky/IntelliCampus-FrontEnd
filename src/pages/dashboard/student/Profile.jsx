import IdentityCard from "../../../feature/student/profile/IdentityCard";
import AccountControlsCard from "../../../feature/student/profile/AccountControlsCard";
import AcademicInfoCard from "../../../feature/student/profile/AcademicInfoCard";
import PerformanceCard from "../../../feature/student/profile/PerformanceCard";

const userData = {
    name: "Youssef Desoky",
    specialization: "Information Systems",
    faculty: "Faculty of Computers and Information",
    avatar: "/images/students/youssefDesoky/profile.png",
    qrCode: "/images/students/youssefDesoky/attendance-qr.png",
    gpa: "3.8",
    attendance: "95%",
    rank: "Top 5%",
    year: "Senior",
    enrolledCourses: "6",
    completedCourses: "28",
    nextExam: "Database Systems · Jun 15",
    standing: "Good Standing",
    studentSince: "2022",
    studentId: "S12345678",
    email: "youssef.desoky@intelicampus.edu",
    phone: "+20 10 2345 6789",
    address: "123 Main St, Cairo, Egypt",
};

export default function Profile() {
    return (
        <div className="px-4 lg:px-8 py-6 space-y-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] items-stretch">
                    <div className="flex h-full flex-col gap-6 lg:sticky lg:top-6 self-start">
                        <IdentityCard user={userData} className="flex-1 min-h-0" />
                        <AccountControlsCard className="shrink-0" />
                    </div>
                    <div className="flex h-full flex-col gap-6">
                        <AcademicInfoCard />
                        <PerformanceCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
