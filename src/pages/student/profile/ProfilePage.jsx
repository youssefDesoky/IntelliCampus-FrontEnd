import ProfileSummary from "./ProfileSummary";
import AcademicInformation from "./AcademicInformation";
import CurrentCourses from "./CurrentCourses";
import QuickStats from "../../../components/ui/QuickStats";
import RecentActivity from "../../../components/ui/RecentActivity";
import Section from "../../../components/ui/Section";

export default function ProfilePage({studentData}) {
  const stats = [
    { title: "Courses Enrolled", value: 6, bg: "bg-blue-50", icon: (<svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { title: "Assignments Done", value: "24/28", bg: "bg-green-50", icon: (<svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { title: "Community Posts", value: 43, bg: "bg-purple-50", icon: (<svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { title: "Smart Notes", value: 18, bg: "bg-yellow-50", icon: (<svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 4H8v8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="space-y-6">
        <ProfileSummary studentData={studentData} />
        <QuickStats items={stats} />
      </div>

      <div className="col-span-2 space-y-6">
        <AcademicInformation studentData={studentData} />
        <CurrentCourses studentCourses={studentData.courses} />
        <RecentActivity />
      </div>
    </div>
  );
}