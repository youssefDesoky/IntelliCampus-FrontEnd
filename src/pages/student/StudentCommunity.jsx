import { useOutletContext } from "react-router-dom";

import PageHeader from "../../ui/PageHeader";
import Section from "../../ui/Section";
import CommunityPosts from "../../ui/CommunityPost";

import CommunityStats from "../../components/student/community/CommunityStats";
import CommunityTopContributes from "../../components/student/community/CommunityTopContributes";
import MyCommunities from "../../components/student/community/MyCommunities";
import CommunityQuickActions from "../../components/student/community/CommunityQuickActions";

import communitiesData from "../../data/communities";
import Button from "../../ui/Button";

export default function StudentCommunity() {
    const { course } = useOutletContext();
    const community = communitiesData.find(comm => comm.courseId === course.id);

    return (
        <>
            {/* <PageHeader
                title={`${community.courseTitle} Community`}
                subtitle={community.description}
            >
                <Button className="bg-blue-600 text-white px-4 py-2 rounded-md">New Post</Button>
            </PageHeader> */}

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
                                <CommunityQuickActions />

                                <CommunityStats />
                            </div>
                        </div>

                        <MyCommunities communities={communitiesData} />
                    </div>
                </div>
            </div>
        </>
    );
}