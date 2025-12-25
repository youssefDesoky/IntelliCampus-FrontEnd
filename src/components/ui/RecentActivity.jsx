import {useState} from "react";
import Section from "../ui/Section";


export default function RecentActivity() {
    const activities = [
        { 
            id: 1,
            description: "Submitted Assignment 3 for Math 101",
            time: "2 hours ago",
            icon: 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4 text-gray-500">
                    <path d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
                </svg>
        },
        { 
            id: 2,
            description: "Attended Physics 201 lecture", 
            time: "5 hours ago",
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-4 h-4 text-gray-500">
                    <path d="M96 64C78.3 64 64 78.3 64 96V416C64 433.7 78.3 448 96 448H544C561.7 448 576 433.7 576 416V96C576 78.3 561.7 64 544 64H96zM512 384H128V128H512V384zM320 160C297.9 160 280 177.9 280 200C280 222.1 297.9 240 320 240C342.1 240 360 222.1 360 200C360 177.9 342.1 160 320 160z" />
                </svg>
        },
        { 
            id: 3,
            description: "Received grade for History 150 quiz",
            time: "1 day ago",
            icon:
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-4 h-4 text-gray-500">
                    <path d="M96 64C78.3 64 64 78.3 64 96V416C64 433.7 78.3 448 96 448H544C561.7 448 576 433.7 576 416V96C576 78.3 561.7 64 544 64H96zM512 384H128V128H512V384zM320 160C297.9 160 280 177.9 280 200C280 222.1 297.9 240 320 240C342.1 240 360 222.1 360 200C360 177.9 342.1 160 320 160z" />
                </svg>
        },
    ];

    const [open, setOpen] = useState(true);

    const arrowIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4">
            <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/>
        </svg>
    );

    const colorClasses = [
        "bg-green-50 text-green-600",
        "bg-sky-50 text-sky-600",
        "bg-purple-50 text-purple-600",
        "bg-amber-50 text-amber-600",
    ];

    return (
        <Section className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between cursor-none" onClick={() => setOpen(!open)}>
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button
                    className="cursor-none inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-transform"
                    title={open ? "Hide recent activity" : "Show recent activity"}
                >
                    <span className={`transform transition-transform duration-200 ${open ? "rotate-0" : "rotate-180"}`}>
                        {arrowIcon}
                    </span>
                </button>
            </div>

            {open && (
                <ul className="space-y-3 mt-4">
                    {activities.map((activity, idx) => (
                        <li key={activity.id} className="flex items-start gap-3 py-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClasses[idx % colorClasses.length]}`}>
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-gray-800">
                                    {activity.description}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {activity.time}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Section>
    );
}