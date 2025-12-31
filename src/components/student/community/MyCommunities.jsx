import Section from "../../../ui/Section";
import Button from "../../../ui/Button";

import CommunityMenuItem from "./myCommunities/CommunityMenuItem";

// Icons
import { AngleDownIcon } from "../../../ui/icons";

export default function MyCommunities({communities, className}) {
    return (
        <Section className={`p-4 border bg-surface-bg-light dark:bg-surface-bg-dark border-default-border-light dark:border-default-border-dark rounded-md ${className}`}>
            <h2 className="mb-4 text-lg font-bold">My Communities</h2>
            <menu className="flex flex-col gap-4">
                {communities.slice(0, 4).map((community, index) => (
                    <CommunityMenuItem 
                        key={index}
                        community={community}
                    />
                ))}
                {communities.length > 4 && (
                    <Button className="mt-2 text-lg font-bold bg-transparent text-blue-600 mx-auto hover:text-blue-950">
                        <AngleDownIcon className="w-8 h-8 animate-bounce" />
                    </Button>
                )}
            </menu>
        </Section>
    );
}