import ArrowUpIcon from "../icons/ArrowUpIcon";
import CommentIcon from "../icons/CommentIcon";
import SaveIcon from "../icons/SaveIcon";

export default function CommunityPost({ className, postData, courseTitle=null }) {
    return (
        <li aria-label="post-item" className={`flex flex-col gap-4 rounded-lg p-6 bg-surface-bg-light dark:bg-surface-bg-dark border border-default-border-light dark:border-default-border-dark ${className}`}>
            <div aria-label="post-header" className="flex items-center gap-4">
                <img src="/images/students/mohamedAdel/profile.png" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[16px]">{postData.sender}</h3>
                        <span className="text-xs font-medium bg-yellow-300 text-orange-600 px-2 py-1 rounded-full">Gold</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-text-light dark:text-muted-text-dark min-w-0">
                        {courseTitle && (
                            <>
                                <span className="truncate block max-w-[60%]">Posted in {courseTitle}</span>
                                <span className="w-1 h-1 rounded-full my-auto mx-1 bg-muted-text-light dark:bg-muted-text-dark"></span>
                            </>
                        )}
                        <span>{postData.createdAt}</span>
                    </div>
                </div>
            </div>

            <div aria-label="post-content" className="flex flex-col gap-3">
                <h3 className="font-bold text-xl">{postData.title}</h3>

                <p className="text-[16px] text-secondary-text-light dark:text-secondary-text-dark">{postData.content}</p>
                
                <div aria-label="post-tags" className="flex flex-wrap gap-2 text-sm text-blue-600">
                    {postData.tags.map((tag, index) => (
                        <span 
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 px-3 p-1.5 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div aria-label="post-actions" className="flex gap-8 border-t border-default-border-light dark:border-default-border-dark text-secondary-text-light dark:text-secondary-text-dark pt-2">
                <button className="p-2 flex flex-row items-center gap-1 hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out">
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>{postData.likes}</span>
                </button>
                <button className="p-2 flex flex-row items-center gap-1 hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out">
                    <CommentIcon className="w-4 h-4" />
                    <span>{postData.comments.length}</span>
                </button>
                <button className="p-2 flex flex-row items-center gap-1 hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out">
                    <SaveIcon className="w-4 h-4" />
                    <span className="text-sm">Save</span>
                </button>
            </div>
        </li>
    );
}