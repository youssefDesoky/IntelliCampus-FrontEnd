import ProfileSummary from "../../components/student/profile/ProfileSummary";
import AcademicInformation from "../../components/student/profile/AcademicInformation";
import CurrentCourses from "../../components/student/profile/CurrentCourses";
import QuickStats from "../../ui/QuickStats";
import RecentActivity from "../../ui/RecentActivity";

const dummyStats = [
    {
        title: "Completed Courses",
        value: "8",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-blue-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-16.548 0C3.095 4.01 2.25 4.973 2.25 6.108v8.142c0 1.135.845 2.098 1.976 2.192a48.424 48.424 0 0016.548 0c1.131-.094 1.976-1.057 1.976-2.192V10.5M6 12h.008v.008H6V12zm0 3h.008v.008H6V15zm0 3h.008v.008H6V18z"
                />
            </svg>
        ),
    },
    {
        title: "GPA",
        value: "3.8",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-500"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
    },
];

export default function StudentProfile({studentData}) {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="space-y-6">
                <ProfileSummary studentData={studentData} />
                <QuickStats items={dummyStats} />
            </div>

            <div className="col-span-2 space-y-6">
                <AcademicInformation studentData={studentData} />
                <CurrentCourses studentCourses={studentData.courses} />
                <RecentActivity />
            </div>
        </div>
  );
}