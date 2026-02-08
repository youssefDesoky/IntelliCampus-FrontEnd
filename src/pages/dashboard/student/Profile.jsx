import AcademicInfo from "../../../feature/student/profile/AcademicInfo";
import Interests from "../../../feature/student/profile/Interests";
import ProfileOverview from "../../../feature/student/profile/ProfileOverview";
import { useState } from "react";

import AttendanceQRCode from "../../../feature/student/profile/AttendanceQRCode";
import QuickStats from "../../../feature/student/profile/QuickStats";
import UpcomingDeadlines from "../../../feature/student/profile/UpcomingDeadlines";
import Settings from "../../../feature/student/profile/settings";

export default function Profile() {
    const [isProfileOverviewVisible, setIsProfileOverviewVisible] = useState(true);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                { isProfileOverviewVisible ? (
                    <ProfileOverview
                        user={{
                            name: "Youssef Desoky",
                            specialization: "Information Systems",
                            avatar: "/images/students/youssefDesoky/profile.png",
                            gpa: "3.8",
                            attendance: "95%",
                            faculty: "Faculty of Computers and Information"
                        }}
                        setIsProfileOverviewVisible={setIsProfileOverviewVisible}
                        className="lg:col-span-1" 
                    />
                ) : (
                    <AttendanceQRCode
                        setIsProfileOverviewVisible={setIsProfileOverviewVisible}
                        user={{
                            qrCode: "/images/students/youssefDesoky/attendance-qr.png"
                        }}
                        className="lg:col-span-1" 
                    />
                )}
                


                <AcademicInfo
                    user={{
                        AcademicInformation: [
                            { name: "studentId", label: "Student ID", value: "S12345678" },
                            { name: "specialization", label: "Specialization", value: "Information Systems" },
                            { name: "year", label: "Year", value: "Senior" },
                            { name: "semester", label: "Semester", value: "Fall 2026" },
                            { name: "email", label: "Email", value: "john.doe@example.com" },
                            { name: "phone", label: "Phone Number", value: "+1 234 567 8901" },
                        ]
                    }}
                    className="lg:col-span-2" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    <UpcomingDeadlines
                        reminders={[
                            { title: "Project Proposal", course: "IS 410", due: "Sep 15", priority: "high" },
                            { title: "Midterm Exam", course: "CS 220", due: "Sep 20", priority: "medium" },
                            { title: "Research Paper", course: "IS 330", due: "Sep 25", priority: "low" },
                        ]}
                        className="lg:col-span-2" 
                    />
                </div>

                <div className="space-y-6">
                    <Interests 
                        interests ={["Artificial Intelligence", "Web Development", "Data Science", "Cybersecurity"]}
                        className="lg:col-span-1" 
                    />
                    
                    <QuickStats
                        items={[
                            { icon: "📚", label: "Courses Enrolled", value: 5 },
                            { icon: "📝", label: "Assignments Due", value: 12 },
                        ]}
                        className="lg:col-span-1" 
                    />
                    <Settings className="lg:col-span-2 mt-6" />
                </div>
            </div>
        </>
    );
}