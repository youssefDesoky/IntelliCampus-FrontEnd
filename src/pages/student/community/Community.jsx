import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import CommunityPosts from "../../../components/ui/CommunityPost";

import CommunityStats from "./communityStats/CommunityStats";
import CommunityTopContributes from "./communityTopContributes/CommunityTopContributes";
import MyCommunities from "./myCommunities/MyCommunities";

import communitiesData from "../../../data/communities";
import SaveIcon from "../../../components/icons/SaveIcon";

export default function Community({community}) {
    return (
        <div className="">
            <PageHeader
                title={`${community.courseTitle} Community`}
                subtitle={community.description}
            >
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">New Post</button>
            </PageHeader>

            <div className="grid grid-cols-4 gap-6 mt-6">
                <Section className="col-span-2">
                    <menu className="space-y-6">
                        {community.posts.map((post) => (
                            <CommunityPosts 
                                key={post.id}
                                postData={post}
                            />
                        ))}
                    </menu>
                </Section>

                <div className="col-span-2">
                    <div className="sticky top-20 grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <CommunityTopContributes />
                            <div className="grid grid-rows-2 gap-4">
                                <Section className="p-4 border bg-surface-bg-light dark:bg-surface-bg-dark border-default-border-light dark:border-default-border-dark rounded-md">
                                    <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
                                    <div className="flex flex-col">
                                        <button className="w-full flex flex-row items-center gap-2 p-3 mb-4 bg-surface-bg-hover-light dark:bg-surface-bg-hover-dark border border-default-border-light dark:border-default-border-dark rounded-md hover:bg-surface-bg-active-light dark:hover:bg-surface-bg-active-dark transition-colors duration-200 ease-in-out">
                                            <SaveIcon className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" />
                                            <span>Create Post</span>
                                        </button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="w-full flex flex-row items-center gap-2 p-3 bg-surface-bg-hover-light dark:bg-surface-bg-hover-dark border border-default-border-light dark:border-default-border-dark rounded-md hover:bg-surface-bg-active-light dark:hover:bg-surface-bg-active-dark transition-colors duration-200 ease-in-out">
                                                <SaveIcon className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" />
                                                <span>Saved Posts</span>
                                            </button>
                                            <button className="w-full flex flex-row items-center gap-2 p-3 bg-surface-bg-hover-light dark:bg-surface-bg-hover-dark border border-default-border-light dark:border-default-border-dark rounded-md hover:bg-surface-bg-active-light dark:hover:bg-surface-bg-active-dark transition-colors duration-200 ease-in-out">
                                                <SaveIcon className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" />
                                                <span>My Posts</span>
                                            </button>
                                        </div>
                                    </div>
                                </Section>

                                <CommunityStats />
                            </div>
                        </div>

                        <MyCommunities communities={communitiesData} />
                    </div>
                </div>
            </div>
        </div>
    );
}