import { useOutletContext } from "react-router-dom";

import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import CommunityPosts from "../../../components/ui/CommunityPost";

import CourseShell from "../../../feature/course/component/CourseShell";
import MyCommunities from "../../../feature/student/courses/courseDetail/community/MyCommunities";
import CommunityStats from "../../../feature/student/courses/courseDetail/community/CommunityStats";
import CommunityQuickActions from "../../../feature/student/courses/courseDetail/community/CommunityQuickActions";
import CommunityTopContributes from "../../../feature/student/courses/courseDetail/community/CommunityTopContributes";

const communitiesData = [
    {
        courseId: "CS-100",
        courseTitle: "Introduction to Computer Science",
        department: "Computer Science",
        description: "Community for Introduction to Computer Science (CS-100). Discuss lectures, assignments and exams.",
        posts: [
            {
                id: "CS-100-p1",
                title: "Question about lecture 3",
                content: "Can someone explain the difference between compile-time and run-time errors with examples?",
                sender: "Alice Johnson",
                senderId: "alice.johnson",
                createdAt: "2024-03-12T10:00:00Z",
                likes: 12,
                comments: [
                    {
                        id: "CS-100-p1-c1",
                        sender: "Charlie Brown",
                        senderId: "charlie.brown",
                        content: "Compile-time errors are caught by the compiler (syntax), run-time occur while program runs (exceptions).",
                        createdAt: "2024-03-12T11:00:00Z"
                    }
                ],
                tags: ["lecture", "errors"],
                pinned: true
            },
            {
                id: "CS-100-p2",
                title: "Shared solution template",
                content: "I uploaded a starter template for the first lab on GitHub (link in comments).",
                sender: "David Lee",
                senderId: "david.lee",
                createdAt: "2024-03-10T08:30:00Z",
                likes: 20,
                comments: [],
                tags: ["resources", "lab"],
                pinned: false
            },
            {
                id: "CS-100-p3",
                title: "Study group",
                content: "Looking for 2-3 people to review lecture notes for the quiz on Friday.",
                sender: "Alice Johnson",
                senderId: "alice.johnson",
                createdAt: "2024-03-11T14:15:00Z",
                likes: 5,
                comments: [],
                tags: ["study-group"],
                pinned: false
            },
                        {
                id: "CS-200-p1",
                title: "Project ideas",
                content: "Share your project ideas for the term project. I'm thinking of a task tracker app.",
                sender: "Eve Martinez",
                senderId: "eve.martinez",
                createdAt: "2024-04-01T09:00:00Z",
                likes: 18,
                comments: [
                    {
                        id: "CS-200-p1-c1",
                        sender: "Alice Johnson",
                        senderId: "alice.johnson",
                        content: "Task tracker is good — consider adding time tracking and analytics.",
                        createdAt: "2024-04-01T10:05:00Z"
                    }
                ],
                tags: ["project", "ideas"],
                pinned: true
            },
            {
                id: "CS-200-p2",
                title: "Team formation",
                content: "Looking for teammates with frontend experience.",
                sender: "Alice Johnson",
                senderId: "alice.johnson",
                createdAt: "2024-04-02T12:20:00Z",
                likes: 7,
                comments: [],
                tags: ["team", "project"],
                pinned: false
            },
            {
                id: "CS-200-p3",
                title: "Recommended reading",
                content: "Agile Estimating and Planning is a good read for this course.",
                sender: "Dr. Emily Clark",
                senderId: "emily.clark",
                createdAt: "2024-04-03T08:00:00Z",
                likes: 10,
                comments: [],
                tags: ["reading", "agile"],
                pinned: false
            }
        ]
    }
]

export default function Community() {
    const { course } = useOutletContext();
    const community = communitiesData.find(comm => comm.courseId === course.id);

    return (
        <>
            <div className="grid grid-cols-4 gap-6 mt-6">
                <Section className="col-span-2">
                    <menu className="space-y-6">
                        {community.posts.map((post) => (
                            <CommunityPosts 
                                key={post.id}
                                postData={post}
                            />
                        ))}
                    </menu>
                </Section>

                <div className="col-span-2">
                    <div className="sticky top-20 grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <CommunityTopContributes />
                            <div className="grid grid-rows-2 gap-4">
                                <CommunityQuickActions />

                                <CommunityStats />
                            </div>
                        </div>

                        <MyCommunities communities={communitiesData} />
                    </div>
                </div>
            </div>
        </>
    );
}