// Icons
import StarIcon from "../../../../ui/icons/StarIcon";

export default function SmartNoteItem({note}) {
    return (
        <li className="p-4 border rounded-lg shadow-sm flex flex-col items-start hover:shadow-md transition-shadow duration-200 ease-in-out border-default-border-light dark:border-default-border-dark">
            <div className="flex justify-between w-full mb-2">
                <h3 className="text-sm font-semibold">{note.title}</h3>
                <StarIcon className="w-5 h-5 text-yellow-400" />
            </div>

            <div className="mb-2">
                {note.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 mr-2 text-xs text-green-600 bg-green-200 rounded-full">{tag}</span>
                ))}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{note.modified}</p>
        </li>
    );
}