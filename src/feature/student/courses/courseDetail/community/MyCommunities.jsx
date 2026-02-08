import Button from "../../../../../components/ui/Button";
import Section from "../../../../../components/ui/Section";
import { AngleDownIcon } from "../../../../../components/ui/icons";

import CommunityMenuItem from "./CommunityMenuItem";


export default function MyCommunities({communities, className}) {
    return (
        <Section className={`p-4 border bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark rounded-md ${className}`}>
            <h2 className="mb-4 text-lg font-bold">My Communities</h2>
            <menu className="flex flex-col gap-4">
                {communities.slice(0, 4).map((community, index) => (
                    <CommunityMenuItem 
                        key={index}
                        community={community}
                    />
                ))}
                {communities.length > 4 && (
                    <Button className="mt-2 text-lg font-bold bg-transparent text-text-accent-default-light dark:text-text-accent-default-dark mx-auto hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark">
                        <AngleDownIcon className="w-8 h-8 animate-bounce" />
                    </Button>
                )}
            </menu>
        </Section>
    );
}