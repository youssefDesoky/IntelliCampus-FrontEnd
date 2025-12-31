import { EllipsisVerticalIcon, FahimIcon, ClockIcon, CalendarIcon } from "../../../../ui/icons";

import Button from "../../../../ui/Button";

export default function SmartNote({note}) {
    return(
        <div className="transition-shadow duration-200 hover:shadow-lg shadow-sm p-6 bg-surface-bg-light dark:bg-surface-bg-dark rounded-xl border border-default-border-light dark:border-default-border-dark flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4 relative">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">{note.title}</h3>
                    <p className="text-sm">{note.content}</p>
                </div>
                <Button className="relative top-0 right-0 cursor-none">
                    <EllipsisVerticalIcon className="w-6 h-6 text-gray-600 hover:text-blue-500 transition-colors duration-200"/>
                </Button>
            </div>

            <div className="flex gap-2 text-sm">
                {note.tags.map((tag, index) => (
                    <span 
                        key={index} 
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            tag === "Lecture" ? "text-blue-700 bg-purple-200 dark:bg-purple-500 dark:text-purple-200" :
                            tag === "Exam" ? "text-red-700 bg-red-200 dark:bg-red-500 dark:text-red-200" :
                            tag === "Assignment" ? "text-orange-700 bg-orange-200 dark:bg-orange-500 dark:text-orange-200" :
                            tag === "AI Enhanced" ? "text-green-700 bg-green-200 dark:bg-green-500 dark:text-green-200" :
                            "text-blue-700 bg-blue-200 dark:bg-blue-500 dark:text-blue-200"}`}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-default-border-light dark:border-default-border-dark pt-4">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-secondary-text-light dark:text-secondary-text-dark">
                        <CalendarIcon className="w-4 h-4" />
                        <p className="text-sm">{note.creationDate}</p>
                    </div>

                    <div className="flex items-center gap-1 text-secondary-text-light dark:text-secondary-text-dark">
                        <ClockIcon className="w-4 h-4" />
                        <p className="text-sm">{note.modified}</p>
                    </div>
                </div>
                <Button className="px-2 py-1.5 rounded-lg bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200">
                    <FahimIcon className="w-12 h-12 " />
                    <span className="text-sm font-semibold">AI Summarize</span>
                </Button>
            </div>
        </div>
    );
}