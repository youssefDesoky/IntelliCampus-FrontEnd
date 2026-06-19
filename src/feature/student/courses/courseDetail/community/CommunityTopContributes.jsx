import { useMemo } from "react";

export default function CommunityTopContributes({ posts = [], className = "" }) {
    const topUsers = useMemo(() => {
        const map = {};
        for (const post of posts) {
            const author = post.authorName || "Unknown";
            map[author] = map[author] || { name: author, posts: 0, comments: 0 };
            map[author].posts += 1;
            for (const comment of (post.comments || [])) {
                const ca = comment.authorName || "Unknown";
                map[ca] = map[ca] || { name: ca, posts: 0, comments: 0 };
                map[ca].comments += 1;
            }
        }
        return Object.values(map)
            .sort((a, b) => (b.posts + b.comments) - (a.posts + a.comments))
            .slice(0, 5);
    }, [posts]);

    return (
        <div className={`p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-3">
                Top Contributors
            </h3>
            {topUsers.length === 0 ? (
                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    No contributions yet.
                </p>
            ) : (
                <ul className="space-y-2">
                    {topUsers.map((user, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                            <span className="truncate text-text-primary-default-light dark:text-text-primary-default-dark">
                                {user.name}
                            </span>
                            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark shrink-0 ml-2">
                                {user.posts + user.comments}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}