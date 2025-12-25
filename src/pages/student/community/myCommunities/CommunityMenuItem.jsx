import { NavLink } from "react-router-dom";

// Icons
import UserTieIcon from "../../../../components/icons/UserTieIcon";

export default function CommunityMenuItem({community}) {
    return (
        <li className="relative p-3 border border-default-border-light dark:border-default-border-dark rounded-lg hover:bg-hover-light dark:hover:bg-hover-dark cursor-none" data-cursor="clickable">
            <NavLink to="/community/computer-science" className="flex items-center gap-3 cursor-none">
                <div className="p-2 bg-accent-light text-accent-text-light dark:bg-accent-dark dark:text-accent-text-dark rounded-md">
                    <UserTieIcon className="w-6 h-6 inline-block mr-2" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{community.courseTitle}</span>
                    <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">120 Members</p>
                </div>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-accent-light dark:bg-accent-dark"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-light dark:bg-accent-dark"></span>
                </span>
            </NavLink>
        </li>
    );
}