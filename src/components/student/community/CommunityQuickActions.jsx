import Section from "../../../ui/Section";
import Button from "../../../ui/Button";

// Icons
import {SaveIcon} from "../../../ui/icons";

export default function CommunityQuickActions() {
    return (
        <Section className="p-4 border bg-surface-bg-light dark:bg-surface-bg-dark border-default-border-light dark:border-default-border-dark rounded-md">
            <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
            <div className="flex flex-col">
                <Button className="w-full flex flex-row items-center gap-2 p-3 mb-4 bg-surface-bg-hover-light dark:bg-surface-bg-hover-dark border border-default-border-light dark:border-default-border-dark rounded-md hover:bg-surface-bg-active-light dark:hover:bg-surface-bg-active-dark transition-colors duration-200 ease-in-out">
                    <SaveIcon className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" />
                    <span>Create Post</span>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full flex flex-row items-center gap-2 p-3 bg-surface-bg-hover-light dark:bg-surface-bg-hover-dark border border-default-border-light dark:border-default-border-dark rounded-md hover:bg-surface-bg-active-light dark:hover:bg-surface-bg-active-dark transition-colors duration-200 ease-in-out">
                        <SaveIcon className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" />
                        <span>Saved Posts</span>
                    </Button>

                    <Button className="w-full flex flex-row items-center gap-2 p-3 bg-surface-bg-hover-light dark:bg-surface-bg-hover-dark border border-default-border-light dark:border-default-border-dark rounded-md hover:bg-surface-bg-active-light dark:hover:bg-surface-bg-active-dark transition-colors duration-200 ease-in-out">
                        <SaveIcon className="w-6 h-6 text-secondary-text-light dark:text-secondary-text-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-200 ease-in-out" />
                        <span>My Posts</span>
                    </Button>
                </div>
            </div>
        </Section>
    );
}