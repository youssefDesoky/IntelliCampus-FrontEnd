import { NavLink } from "react-router-dom";
import CommunityPost from "../../../../components/ui/CommunityPost";

// Icons
import ArrowRightIcon from "../../../../components/icons/ArrowRightIcon";

// Data
import communitiesData from "../../../../data/communities";

export default function DashboardCommunity({className, }){
    return (
        <div className={`p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark rounded-lg ${className}`}>
            <div id="today-reminders-header" className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Community Updates</h2>

                <NavLink to="/community" className="text-blue-600 hover:underline flex items-center gap-2 justify-center font-medium">
                    My Communities
                    <ArrowRightIcon className="w-4 h-4" />
                </NavLink>
            </div>

            <menu className="grid grid-cols-2 gap-6 mb-8" aria-labelledby="smart-notes-header">
                {communitiesData.length === 0 ? (
                    <div className="mb-4 col-span-2 h-full border border-default-border-light dark:border-default-border-dark rounded-lg">
                        <div className="flex flex-col items-center justify-center h-full p-6 text-muted-text-light dark:text-muted-text-dark">
                            <ArrowRightIcon className="w-12 h-12 mb-4" />
                            <p className="text-center">No community updates till now</p>
                        </div>
                    </div>
                ) : (
                    communitiesData.slice(0,4).map((community) => (
                        <CommunityPost 
                            key={community.id}
                            postData={community.posts[0]} 
                            courseTitle={community.courseTitle} 
                        />)
                    )
                )}
            </menu>
        </div>
    );   
}