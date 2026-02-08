import Section from "../../../../../components/ui/Section";

export default function CommunityStats() {
    return (
        <Section className="p-4 border bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark rounded-md">
            <h2 className="mb-4 text-lg font-bold">Community Stats</h2>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <p>Total Members</p>
                    <span>256</span>
                </div>
                <div className="flex justify-between">
                    <p>Total Posts</p>
                    <span>1,024</span>
                </div>
                <div className="flex justify-between">
                    <p>Active Now</p>
                    <span>32</span>
                </div>
            </div>
        </Section>
    );
}