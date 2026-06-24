import { API_URL } from "../../../../config/api";

export async function fetchCourseGrades(courseId) {
    if (!API_URL) {
        await new Promise((r) => setTimeout(r, 300));
        return getMockGrades();
    }
    const res = await fetch(`${API_URL}/api/grades/instructor/course/${courseId}`);
    if (!res.ok) throw new Error("Failed to fetch grades");
    return res.json();
}

function getMockGrades() {
    return {
        summary: {
            totalStudents: 42,
            averageGrade: 78.5,
            passRate: 85.7,
            totalAssessments: 8,
            gradedAssessments: 6,
        },
        assessments: [
            { id: 1, title: "Week 1 Quiz", type: "Quiz", maxScore: 100, average: 82.3, submissions: 40, graded: 40 },
            { id: 2, title: "Assignment 1 - Python Basics", type: "Assignment", maxScore: 100, average: 76.8, submissions: 38, graded: 38 },
            { id: 3, title: "Midterm Exam", type: "Exam", maxScore: 100, average: 71.2, submissions: 42, graded: 42 },
            { id: 4, title: "Week 4 Quiz", type: "Quiz", maxScore: 100, average: 88.1, submissions: 39, graded: 39 },
            { id: 5, title: "Assignment 2 - Data Structures", type: "Assignment", maxScore: 100, average: 74.5, submissions: 36, graded: 36 },
            { id: 6, title: "Assignment 3 - Project Proposal", type: "Assignment", maxScore: 100, average: 80.0, submissions: 35, graded: 35 },
            { id: 7, title: "Week 7 Quiz", type: "Quiz", maxScore: 100, average: null, submissions: 0, graded: 0 },
            { id: 8, title: "Final Exam", type: "Exam", maxScore: 100, average: null, submissions: 0, graded: 0 },
        ],
        students: [
            { id: 1, name: "Ahmed Mohamed", overall: 85, grade: "A", assessments: [
                { assessmentId: 1, score: 90 }, { assessmentId: 2, score: 82 }, { assessmentId: 3, score: 78 },
                { assessmentId: 4, score: 92 }, { assessmentId: 5, score: 80 }, { assessmentId: 6, score: 88 },
            ]},
            { id: 2, name: "Sara Ali", overall: 92, grade: "A+", assessments: [
                { assessmentId: 1, score: 95 }, { assessmentId: 2, score: 88 }, { assessmentId: 3, score: 90 },
                { assessmentId: 4, score: 96 }, { assessmentId: 5, score: 85 }, { assessmentId: 6, score: 94 },
            ]},
            { id: 3, name: "Omar Hassan", overall: 68, grade: "C+", assessments: [
                { assessmentId: 1, score: 72 }, { assessmentId: 2, score: 65 }, { assessmentId: 3, score: 60 },
                { assessmentId: 4, score: 75 }, { assessmentId: 5, score: 70 }, { assessmentId: 6, score: 66 },
            ]},
            { id: 4, name: "Lina Khaled", overall: 79, grade: "B", assessments: [
                { assessmentId: 1, score: 85 }, { assessmentId: 2, score: 76 }, { assessmentId: 3, score: 74 },
                { assessmentId: 4, score: 88 }, { assessmentId: 5, score: 78 }, { assessmentId: 6, score: 82 },
            ]},
            { id: 5, name: "Youssef Adel", overall: 45, grade: "F", assessments: [
                { assessmentId: 1, score: 55 }, { assessmentId: 2, score: 40 }, { assessmentId: 3, score: 38 },
                { assessmentId: 4, score: 50 }, { assessmentId: 5, score: 42 }, { assessmentId: 6, score: 48 },
            ]},
            { id: 6, name: "Nour El-Din", overall: 88, grade: "A-", assessments: [
                { assessmentId: 1, score: 91 }, { assessmentId: 2, score: 86 }, { assessmentId: 3, score: 84 },
                { assessmentId: 4, score: 90 }, { assessmentId: 5, score: 88 }, { assessmentId: 6, score: 89 },
            ]},
        ],
    };
}
