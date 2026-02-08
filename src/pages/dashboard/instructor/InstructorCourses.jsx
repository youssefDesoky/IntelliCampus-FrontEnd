import { useEffect, useState } from "react";

import Section from "../../../components/ui/Section";
import DataBanner from "../../../components/ui/DataBanner";
import useDeviceType from "../../../hooks/useDeviceType";

import InstructorCourse from "../../../feature/instructor/components/courses/InstructorCourse";
import InstructorCoursesHeader from "../../../feature/instructor/components/courses/InstructorCoursesHeader";

// Statistics Data
const stats = [
    { 
        label: "Assigned Courses", 
        value: 3
    },
    { 
        label: "Total Students",
        value: 118
    },
    { 
        label: "Total Credit Hours", 
        value: 9
    },
    { 
        label: "Weeks Completed", 
        value: 5
    },
];

// Current instructor courses (courses currently assigned to this instructor)
const instructorCourses = [
    {
        id: "CS-100",
        creditHours: 3,
        department: "Computer Science",
        semester: "Spring 2025",
        title: "Introduction to Computer Science",
        prerequisites: [],
        description: "Learn the basics of computer science and programming.",
        schedule: "Mon 10:00 AM, Wed 11:30 AM",
        room: "Ibrahim Farag Hall",
        numOfStudents: 45,
        isElective: false,
        weeksCompleted: 2,
        weeks: [
            {
                topic: "Introduction To Data Types",
                description: "In this week, we will cover the basics of data types in programming.",
                materials: [
                    { id: 1, title: "Lecture Notes - Chapter 1.mp4", size: 2.8 },
                    { id: 2, title: "Assignment 1.pdf", size: 1.2 },
                    { id: 3, title: "Project Guidelines.pdf", size: 0.9 },
                ]
            },
            {
                topic: "Control Structures",
                description: "If-else statements, loops, and other control structures.",
                materials: [
                    { id: 1, title: "Lecture Notes - Chapter 2.mp4", size: 2.5 },
                    { id: 2, title: "Assignment 2.pdf", size: 1.3 },
                ]
            },
            {
                topic: "Functions and Modules",
                description: "Defining functions, parameters, return values, and modules.",
                materials: [
                    { id: 1, title: "Lecture Notes - Chapter 3.mp4", size: 2.9 },
                    { id: 2, title: "Assignment 3.pdf", size: 1.4 },
                ]
            },
        ],
    },
    {
        id: "CS-301",
        creditHours: 3,
        department: "Computer Science",
        semester: "Spring 2025",
        title: "Advanced Programming Concepts",
        prerequisites: ["CS-100", "CS-201"],
        description: "Deep dive into advanced programming paradigms and design patterns.",
        schedule: "Tue 1:00 PM, Thu 2:30 PM",
        room: "Hall 7",
        numOfStudents: 38,
        isElective: false,
        weeksCompleted: 2,
        weeks: [
            {
                topic: "Design Patterns",
                description: "Introduction to common design patterns: Singleton, Factory, Observer.",
                materials: [
                    { id: 1, title: "Lecture Notes - Design Patterns.mp4", size: 3.1 },
                    { id: 2, title: "Assignment 1 - Patterns.pdf", size: 1.5 },
                ]
            },
            {
                topic: "Concurrency and Multithreading",
                description: "Understanding threads, synchronization, and concurrent programming.",
                materials: [
                    { id: 1, title: "Lecture Notes - Concurrency.mp4", size: 2.7 },
                    { id: 2, title: "Lab Exercise - Threading.pdf", size: 1.1 },
                ]
            },
            {
                topic: "Functional Programming",
                description: "Lambda expressions, streams, and functional paradigms.",
                materials: [
                    { id: 1, title: "Lecture Notes - Functional Programming.mp4", size: 2.4 },
                ]
            },
        ],
    },
    {
        id: "CS-410",
        creditHours: 3,
        department: "Computer Science",
        semester: "Spring 2025",
        title: "Compiler Design",
        prerequisites: ["CS-201", "CS-202"],
        description: "Study the principles and techniques of compiler construction.",
        schedule: "Sat 10:00 AM, Mon 11:30 AM",
        room: "Lab 3",
        numOfStudents: 35,
        isElective: true,
        weeksCompleted: 1,
        weeks: [
            {
                topic: "Lexical Analysis",
                description: "Tokenization, regular expressions, and finite automata.",
                materials: [
                    { id: 1, title: "Lecture Notes - Lexical Analysis.mp4", size: 2.6 },
                    { id: 2, title: "Assignment 1 - Lexer.pdf", size: 1.3 },
                ]
            },
            {
                topic: "Syntax Analysis",
                description: "Parsing techniques, context-free grammars, and parse trees.",
                materials: [
                    { id: 1, title: "Lecture Notes - Parsing.mp4", size: 3.0 },
                    { id: 2, title: "Lab Exercise - Parser.pdf", size: 1.2 },
                ]
            },
            {
                topic: "Semantic Analysis",
                description: "Type checking, symbol tables, and semantic rules.",
                materials: [
                    { id: 1, title: "Lecture Notes - Semantic Analysis.mp4", size: 2.8 },
                ]
            },
            {
                topic: "Code Generation",
                description: "Intermediate representations and target code generation.",
                materials: [
                    { id: 1, title: "Lecture Notes - Code Generation.mp4", size: 3.2 },
                ]
            },
        ],
    },
];


export default function InstructorCourses() {
    const { isMobile } = useDeviceType();
    
    const [viewMode, setViewMode] = useState(() => {
        return isMobile ? "list" : localStorage.getItem("instructorCoursesViewMode") || "grid";
    });

    useEffect(() => {
        localStorage.setItem("instructorCoursesViewMode", viewMode);
    }, [viewMode]);

    return (
        <>
            <InstructorCoursesHeader 
                isMobile={isMobile}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            <Section className="hidden md:grid grid-cols-2 gap-6 mb-6">
                <DataBanner
                    title="Course Statistics"
                    data={stats}
                />
            </Section>

            <Section className={`mb-6 ${viewMode === "grid" ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}`}>
                {instructorCourses.map((course) => (
                    <InstructorCourse key={course.id} course={course} viewMode={viewMode} isMobile={isMobile} />
                ))}
            </Section>
        </>
    );
}
