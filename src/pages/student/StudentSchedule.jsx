import { useState } from "react";
import useDeviceType from "../../hooks/useDeviceType";

import WeeklySchedule from "../../ui/WeeklySchedule";
import ScheduleHeader from "../../components/student/schedule/ScheduleHeader";
import ExamSchedule from "../../components/student/schedule/ExamSchedule";

const sampleSchedule = [
    {
        id: 1,
        title: "Data Structures",
        day: "sat",
        startTime: "8:00 AM",
        endTime: "10:00 AM",
        type: "lecture",
        location: "Room 101",
        instructor: "Dr. Ahmed"
    },
    {
        id: 2,
        title: "Database Lab",
        day: "sat",
        startTime: "11:00 AM",
        endTime: "1:00 PM",
        type: "lab",
        location: "Lab 3",
        instructor: "Eng. Sara"
    },
    {
        id: 3,
        title: "Web Development",
        day: "sun",
        startTime: "9:00 AM",
        endTime: "11:00 AM",
        type: "lecture",
        location: "Room 205",
        instructor: "Dr. Mohamed"
    },
    {
        id: 4,
        title: "Algorithms Section",
        day: "mon",
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        type: "section",
        location: "Room 102",
        instructor: "TA Fatma"
    },
    {
        id: 5,
        title: "Midterm Exam",
        day: "wed",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        type: "exam",
        location: "Hall A"
    },
    {
        id: 6,
        title: "Office Hours",
        day: "thu",
        startTime: "1:00 PM",
        endTime: "2:15 PM",
        type: "office",
        location: "Office 15",
        instructor: "Dr. Ahmed"
    },
];

const sampleExams = [
    {
        id: 1,
        courseCode: "CS301",
        courseName: "Data Structures & Algorithms",
        date: "2026-01-26",
        day: "Tuesday",
        startTime: "9:00 AM",
        endTime: "11:00 AM",
        duration: "2 hours",
        location: "Hall A - Building 3",
        type: "midterm",
        status: "upcoming",
    },
    {
        id: 2,
        courseCode: "CS305",
        courseName: "Database Systems",
        date: "2026-02-12",
        day: "Thursday",
        startTime: "1:00 PM",
        endTime: "3:00 PM",
        duration: "2 hours",
        location: "Hall B - Building 2",
        type: "midterm",
        status: "upcoming",
    },
    {
        id: 3,
        courseCode: "CS310",
        courseName: "Web Development",
        date: "2026-02-15",
        day: "Sunday",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        duration: "2 hours",
        location: "Lab 5 - Building 1",
        type: "final",
        status: "upcoming",
    },
    {
        id: 4,
        courseCode: "MATH201",
        courseName: "Linear Algebra",
        date: "2026-02-18",
        day: "Wednesday",
        startTime: "9:00 AM",
        endTime: "11:30 AM",
        duration: "2.5 hours",
        location: "Hall C - Building 3",
        type: "midterm",
        status: "upcoming",
    },
    {
        id: 5,
        courseCode: "CS320",
        courseName: "Operating Systems",
        date: "2026-02-20",
        day: "Friday",
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        duration: "2 hours",
        location: "Hall A - Building 3",
        type: "midterm",
        status: "upcoming",
    },
];

export default function StudentSchedule() {
    const [currSchedule, setCurrSchedule] = useState(localStorage.getItem("studentCurrSchedule") || "weekly");
    const { isPhone } = useDeviceType();
    return (
        <>        
            <ScheduleHeader currSchedule={currSchedule} setCurrSchedule={setCurrSchedule} isPhone={isPhone} />

            {currSchedule === "weekly" ? (
                <WeeklySchedule schedule={sampleSchedule} onEventClick={(event) => alert(`Clicked on event: ${event.title}`)} />
            ) : (
                <ExamSchedule exams={sampleExams} />
            )}
        </>
    );
}