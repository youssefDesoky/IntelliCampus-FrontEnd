import apiClient from "./apiClient";

export async function fetchStudentDashboard() {
  return apiClient("/api/dashboard/student");
}

export async function fetchInstructorDashboard() {
  return {
    stats: {
      activeCourses: 6,
      totalStudents: 142,
      averageAttendance: 87,
    },
    latestNews: [
      { id: 1, title: "Final exam schedules are now available", course: "CS101 - Intro to Programming", date: "2026-06-20T10:00:00Z" },
      { id: 2, title: "New course materials uploaded for Week 12", course: "MATH201 - Linear Algebra", date: "2026-06-19T14:30:00Z" },
      { id: 3, title: "Guest lecture on AI ethics next Thursday", course: "CS301 - Artificial Intelligence", date: "2026-06-18T09:00:00Z" },
      { id: 4, title: "Project submission deadline extended", course: "SE401 - Software Engineering", date: "2026-06-17T16:00:00Z" },
    ],
    attendanceTrend: [
      { week: "W1", attendance: 92 },
      { week: "W2", attendance: 88 },
      { week: "W3", attendance: 85 },
      { week: "W4", attendance: 90 },
      { week: "W5", attendance: 78 },
      { week: "W6", attendance: 82 },
      { week: "W7", attendance: 91 },
      { week: "W8", attendance: 87 },
    ],
    assignmentCompletion: [
      { course: "CS101", completed: 42, pending: 8 },
      { course: "MATH201", completed: 35, pending: 15 },
      { course: "CS301", completed: 28, pending: 12 },
      { course: "SE401", completed: 18, pending: 2 },
      { course: "PHYS101", completed: 22, pending: 18 },
      { course: "ENG102", completed: 48, pending: 2 },
    ],
    gradeDistribution: [
      { range: "A (90-100)", count: 28 },
      { range: "B (80-89)", count: 45 },
      { range: "C (70-79)", count: 32 },
      { range: "D (60-69)", count: 18 },
      { range: "F (Below 60)", count: 8 },
    ],
    performanceOverTime: [
      { name: "Quiz 1", average: 72, maxScore: 98, minScore: 45 },
      { name: "Quiz 2", average: 75, maxScore: 100, minScore: 40 },
      { name: "Midterm", average: 68, maxScore: 95, minScore: 35 },
      { name: "Quiz 3", average: 78, maxScore: 100, minScore: 50 },
      { name: "Project", average: 82, maxScore: 100, minScore: 55 },
      { name: "Final", average: 74, maxScore: 96, minScore: 38 },
    ],
    attendanceVsGrade: [
      { student: "Alice Johnson", attendance: 95, grade: 92 },
      { student: "Bob Smith", attendance: 80, grade: 78 },
      { student: "Charlie Brown", attendance: 60, grade: 65 },
      { student: "Diana Prince", attendance: 98, grade: 95 },
      { student: "Eve Williams", attendance: 75, grade: 72 },
      { student: "Frank Miller", attendance: 45, grade: 58 },
      { student: "Grace Lee", attendance: 88, grade: 85 },
      { student: "Henry Davis", attendance: 70, grade: 68 },
      { student: "Ivy Chen", attendance: 92, grade: 90 },
      { student: "Jack Wilson", attendance: 55, grade: 62 },
      { student: "Karen Taylor", attendance: 82, grade: 80 },
      { student: "Leo Anderson", attendance: 65, grade: 60 },
      { student: "Maria Garcia", attendance: 100, grade: 98 },
      { student: "Noah Thomas", attendance: 78, grade: 75 },
      { student: "Olivia Martinez", attendance: 85, grade: 82 },
      { student: "Peter Jackson", attendance: 50, grade: 55 },
      { student: "Quinn Roberts", attendance: 90, grade: 88 },
      { student: "Rachel Kim", attendance: 72, grade: 70 },
      { student: "Sam Brown", attendance: 95, grade: 91 },
      { student: "Tina White", attendance: 68, grade: 64 },
    ],
    assignmentCompletionRate: [
      { name: "Completed", value: 78, color: "var(--color-bg-fill-success-default-light)" },
      { name: "Pending", value: 22, color: "var(--color-bg-fill-warning-default-light)" },
    ],
    classAverageByTopic: [
      { topic: "Week 1 - Intro", average: 82 },
      { topic: "Week 2 - Basics", average: 78 },
      { topic: "Week 3 - Core Concepts", average: 85 },
      { topic: "Week 4 - Advanced Topics", average: 72 },
      { topic: "Week 5 - Review", average: 76 },
      { topic: "Week 6 - Midterm", average: 68 },
      { topic: "Week 7 - Special Topics", average: 80 },
      { topic: "Week 8 - Project Work", average: 83 },
    ],
    studentScoreHeatmap: [
      { student: "Alice Johnson", scores: { "Quiz 1": 85, "Quiz 2": 90, "Midterm": 78, "Quiz 3": 92, "Final": 88 } },
      { student: "Bob Smith", scores: { "Quiz 1": 72, "Quiz 2": 75, "Midterm": 68, "Quiz 3": 80, "Final": 74 } },
      { student: "Charlie Brown", scores: { "Quiz 1": 65, "Quiz 2": 60, "Midterm": 55, "Quiz 3": 70, "Final": 62 } },
      { student: "Diana Prince", scores: { "Quiz 1": 95, "Quiz 2": 98, "Midterm": 92, "Quiz 3": 96, "Final": 94 } },
      { student: "Eve Williams", scores: { "Quiz 1": 70, "Quiz 2": 72, "Midterm": 68, "Quiz 3": 75, "Final": 71 } },
      { student: "Frank Miller", scores: { "Quiz 1": 55, "Quiz 2": 58, "Midterm": 45, "Quiz 3": 60, "Final": 52 } },
      { student: "Grace Lee", scores: { "Quiz 1": 88, "Quiz 2": 85, "Midterm": 82, "Quiz 3": 90, "Final": 86 } },
      { student: "Henry Davis", scores: { "Quiz 1": 68, "Quiz 2": 70, "Midterm": 65, "Quiz 3": 72, "Final": 68 } },
    ],
    boxPlotData: [
      { name: "Quiz 1", min: 35, q1: 62, median: 75, q3: 88, max: 100 },
      { name: "Quiz 2", min: 40, q1: 65, median: 78, q3: 90, max: 100 },
      { name: "Midterm", min: 25, q1: 55, median: 70, q3: 85, max: 98 },
      { name: "Quiz 3", min: 45, q1: 68, median: 80, q3: 92, max: 100 },
      { name: "Project", min: 50, q1: 72, median: 84, q3: 94, max: 100 },
      { name: "Final", min: 30, q1: 58, median: 73, q3: 88, max: 96 },
    ],
    radarData: [
      { skill: "Problem Solving", score: 82, fullMark: 100 },
      { skill: "Critical Thinking", score: 75, fullMark: 100 },
      { skill: "Technical Knowledge", score: 88, fullMark: 100 },
      { skill: "Communication", score: 70, fullMark: 100 },
      { skill: "Teamwork", score: 85, fullMark: 100 },
      { skill: "Research Skills", score: 72, fullMark: 100 },
    ],
    cumulativePassRate: [
      { week: "W1", rate: 100 },
      { week: "W2", rate: 98 },
      { week: "W3", rate: 95 },
      { week: "W4", rate: 92 },
      { week: "W5", rate: 90 },
      { week: "W6", rate: 85 },
      { week: "W7", rate: 83 },
      { week: "W8", rate: 82 },
      { week: "W9", rate: 80 },
      { week: "W10", rate: 78 },
      { week: "W11", rate: 77 },
      { week: "W12", rate: 76 },
    ],
    sectionComparison: [
      { name: "Quiz 1", "Section A": 82, "Section B": 78, "Section C": 80 },
      { name: "Quiz 2", "Section A": 79, "Section B": 75, "Section C": 77 },
      { name: "Midterm", "Section A": 74, "Section B": 70, "Section C": 72 },
      { name: "Quiz 3", "Section A": 85, "Section B": 80, "Section C": 82 },
      { name: "Project", "Section A": 88, "Section B": 84, "Section C": 86 },
      { name: "Final", "Section A": 78, "Section B": 73, "Section C": 76 },
    ],
  };
}

let adminNewsIdCounter = 10;
let adminLatestNews = [
  { id: 5, title: "Campus will be closed for maintenance on July 4th", course: "General", date: "2026-06-25T08:00:00Z" },
  { id: 6, title: "New scholarship applications are now open for Fall 2026", course: "Administration", date: "2026-06-24T12:00:00Z" },
  { id: 7, title: "Faculty meeting scheduled for next Monday at 3 PM", course: "Academic Staff", date: "2026-06-23T09:30:00Z" },
  { id: 8, title: "System maintenance window: Saturday 2 AM - 6 AM", course: "IT Department", date: "2026-06-22T16:00:00Z" },
];

export async function fetchAdminDashboard() {
  return {
    stats: {
      totalStudents: 1560,
      instructors: 85,
      courses: 79,
      departments: 6,
      activeClasses: 42,
      rooms: 18,
    },
    latestNews: adminLatestNews,
  };
}

export async function publishNews(title) {
  const newNews = {
    id: ++adminNewsIdCounter,
    title,
    course: "General",
    date: new Date().toISOString(),
  };
  adminLatestNews = [newNews, ...adminLatestNews];
  return newNews;
}
