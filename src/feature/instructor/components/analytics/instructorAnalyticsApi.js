import { API_URL } from "../../../../config/api";

export async function fetchCourseAnalytics(courseId) {
    if (!API_URL) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockAnalytics();
    }
    const res = await fetch(`${API_URL}/api/analytics/instructor/course/${courseId}`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
}

function getMockAnalytics() {
    return {
        assignmentPerformance: [
            { name: "Assignment 1", average: 76, submitted: 38, maxScore: 100 },
            { name: "Assignment 2", average: 74, submitted: 36, maxScore: 100 },
            { name: "Assignment 3", average: 80, submitted: 35, maxScore: 100 },
        ],
        quizPerformance: [
            { name: "Week 1 Quiz", average: 82, submitted: 40, maxScore: 100 },
            { name: "Week 4 Quiz", average: 88, submitted: 39, maxScore: 100 },
            { name: "Week 7 Quiz", average: 78, submitted: 37, maxScore: 100 },
        ],
        assessmentPerformance: [
            { name: "Assignment 1", average: 76, maxScore: 100 },
            { name: "Week 1 Quiz", average: 82, maxScore: 100 },
            { name: "Midterm Exam", average: 71, maxScore: 100 },
            { name: "Assignment 2", average: 74, maxScore: 100 },
            { name: "Week 4 Quiz", average: 88, maxScore: 100 },
            { name: "Assignment 3", average: 80, maxScore: 100 },
            { name: "Week 7 Quiz", average: 78, maxScore: 100 },
        ],
        submissionRate: [
            { name: "Submitted", value: 85, color: "var(--color-bg-fill-success-default-light)" },
            { name: "Not Submitted", value: 15, color: "var(--color-bg-fill-danger-default-light)" },
        ],
        weeklyAttendance: [
            { week: "W1", present: 38, absent: 4, excused: 2 },
            { week: "W2", present: 36, absent: 6, excused: 1 },
            { week: "W3", present: 40, absent: 2, excused: 1 },
            { week: "W4", present: 35, absent: 7, excused: 2 },
            { week: "W5", present: 37, absent: 5, excused: 1 },
            { week: "W6", present: 39, absent: 3, excused: 0 },
            { week: "W7", present: 34, absent: 8, excused: 2 },
            { week: "W8", present: 38, absent: 4, excused: 1 },
        ],
    };
}
