import { NavLink } from "react-router-dom";

import { UserTieIcon } from "../../../../../components/ui/icons";

export default function CommunityMenuItem({community}) {
    return (
        <li className="relative p-3 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg hover:bg-bg-surface-primary-hover-light dark:hover:bg-bg-surface-primary-hover-dark" data-cursor="clickable">
            <NavLink to="/community/computer-science" className="flex items-center gap-3">
                <div className="p-2 bg-bg-fill-accent-default-light text-text-accent-active-light dark:bg-bg-fill-accent-default-dark dark:text-text-accent-active-dark rounded-md">
                    <UserTieIcon className="w-6 h-6 inline-block mr-2" />
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{community.courseTitle}</span>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">120 Members</p>
                </div>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark"></span>
                </span>
            </NavLink>
        </li>
    );
}