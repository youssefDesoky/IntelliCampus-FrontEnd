import { NavLink } from "react-router-dom";

import SmartNoteItem from "./SmartNoteItem";

// Icons
import PlusIcon from "../../../../components/icons/PlusIcon";
import ArrowRightIcon from "../../../../components/icons/ArrowRightIcon";

export default function DashboardSmartNotes({ studentNotes, className }) {
    return (
        <div className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg ${className}`}>
            <div id="today-reminders-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Smart Notes</h2>
                <button className="p-2 bg-accent-light hover:bg-accent-dark text-white rounded-md transition-transform duration-200 ease-in-out flex items-center justify-center cursor-none">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>

            <menu className="flex flex-col  gap-3 mb-8" aria-labelledby="smart-notes-header">
                {studentNotes.length === 0 ? (
                    <div className="mb-4 border border-default-border-light dark:border-default-border-dark rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-muted-text-light dark:text-muted-text-dark">
                            <PlusIcon className="w-12 h-12 mb-4" />
                            <p className="text-center">No notes till now</p>
                        </div>
                    </div>
                ) : (
                    studentNotes.map((note, index) => (
                        <SmartNoteItem key={index} note={note} />
                    ))
                )}
            </menu>

            <NavLink to="/smart-notes" className="text-blue-600 hover:underline flex items-center gap-2 justify-center font-medium">
                View All Notes
                <ArrowRightIcon className="w-4 h-4" />
            </NavLink>
        </div>
    );
}