import Button from "../../../../../components/ui/Button";
import Section from "../../../../../components/ui/Section";
import { SaveIcon } from "../../../../../components/ui/icons";

export default function CommunityQuickActions() {
    return (
        <Section className="p-4 border bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark rounded-md">
            <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
            <div className="flex flex-col">
                <Button className="w-full flex flex-row items-center gap-2 p-3 mb-4 bg-bg-surface-primary-hover-light dark:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md hover:bg-bg-surface-primary-active-light dark:hover:bg-bg-surface-primary-active-dark transition-colors duration-200 ease-in-out">
                    <SaveIcon className="w-6 h-6 text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out" />
                    <span>Create Post</span>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full flex flex-row items-center gap-2 p-3 bg-bg-surface-primary-hover-light dark:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md hover:bg-bg-surface-primary-active-light dark:hover:bg-bg-surface-primary-active-dark transition-colors duration-200 ease-in-out">
                        <SaveIcon className="w-6 h-6 text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out" />
                        <span>Saved Posts</span>
                    </Button>

                    <Button className="w-full flex flex-row items-center gap-2 p-3 bg-bg-surface-primary-hover-light dark:bg-bg-surface-primary-hover-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md hover:bg-bg-surface-primary-active-light dark:hover:bg-bg-surface-primary-active-dark transition-colors duration-200 ease-in-out">
                        <SaveIcon className="w-6 h-6 text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors duration-200 ease-in-out" />
                        <span>My Posts</span>
                    </Button>
                </div>
            </div>
        </Section>
    );
}