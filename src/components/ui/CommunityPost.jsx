import ArrowUpIcon from "./icons/ArrowUpIcon";
import CommentIcon from "./icons/CommentIcon";
import SaveIcon from "./icons/SaveIcon";

export default function CommunityPost({ className, postData, courseTitle=null }) {
    return (
        <li aria-label="post-item" className={`flex flex-col gap-4 rounded-lg p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark ${className}`}>
            <div aria-label="post-header" className="flex items-center gap-4">
                <img src="/images/students/mohamedAdel/profile.png" alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-[16px]">{postData.sender}</h3>

                    <div className="flex items-center gap-1 text-sm text-text-tertiary-default-light dark:text-text-tertiary-default-dark min-w-0">
                        {courseTitle && (
                            <>
                                <span className="truncate block max-w-[60%]">Posted in {courseTitle}</span>
                                <span className="w-1 h-1 rounded-full my-auto mx-1 bg-text-tertiary-default-light dark:bg-text-tertiary-default-dark"></span>
                            </>
                        )}
                        <span>{postData.createdAt}</span>
                    </div>
                </div>
            </div>

            <div aria-label="post-content" className="flex flex-col gap-3">
                <h3 className="font-bold text-xl">{postData.title}</h3>

                <p className="text-[16px] text-text-secondary-default-light dark:text-text-secondary-default-dark">{postData.content}</p>
                
                <div aria-label="post-tags" className="flex flex-wrap gap-2 text-sm text-text-accent-default-light dark:text-text-accent-default-dark">
                    {postData.tags.map((tag, index) => (
                        <span 
                            key={index}
                            className="bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark px-3 p-1.5 rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div aria-label="post-actions" className="flex gap-8 border-t border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark pt-2">
                <button className="p-2 flex flex-row items-center gap-1 hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out">
                    <ArrowUpIcon className="w-4 h-4" />
                    <span>{postData.likes}</span>
                </button>
                <button className="p-2 flex flex-row items-center gap-1 hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out">
                    <CommentIcon className="w-4 h-4" />
                    <span>{postData.comments.length}</span>
                </button>
                <button className="p-2 flex flex-row items-center gap-1 hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out">
                    <SaveIcon className="w-4 h-4" />
                    <span className="text-sm">Save</span>
                </button>
            </div>
        </li>
    );
}