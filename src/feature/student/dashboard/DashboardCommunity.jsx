import { NavLink } from "react-router-dom";

import CommunityPost from "../../../components/ui/CommunityPost";
import { ArrowRightIcon } from "../../../components/ui/icons";

const communitiesData = [
    {
        courseTitle: "Introduction to Computer Science",
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
            }
        ]
    },
    {
        courseTitle: "Data Structures and Algorithms",
        posts: [
            {
                id: "CS-200-p1",
                title: "Help with binary trees",
                content: "Can someone help me understand how to implement a binary search tree in Python?",
                sender: "Bob Smith",
                senderId: "bob.smith",
                createdAt: "2024-03-11T09:00:00Z",
                likes: 8,
                comments: [],
                tags: ["data-structures", "python"],
                pinned: false
            }
        ]
    },
];

export default function DashboardCommunity({className}){
    return (
        <div className={`p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg ${className}`}>
            <div id="today-reminders-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Community Updates</h2>

                <NavLink to="/community" className="text-text-accent-default-light dark:text-text-accent-default-dark hover:underline flex items-center gap-2 justify-center font-medium">
                    My Communities
                    <ArrowRightIcon className="w-4 h-4" />
                </NavLink>
            </div>

            <menu className="grid grid-cols-2 gap-6 mb-8" aria-labelledby="smart-notes-header">
                {communitiesData.length === 0 ? (
                    <div className="mb-4 col-span-2 h-full border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                            <ArrowRightIcon className="w-12 h-12 mb-4" />
                            <p className="text-center">No community updates till now</p>
                        </div>
                    </div>
                ) : (
                    communitiesData.slice(0,4).map((community, index) => (
                        <CommunityPost 
                            key={index}
                            postData={community.posts[0]} 
                            courseTitle={community.courseTitle} 
                        />)
                    )
                )}
            </menu>
        </div>
    );   
}