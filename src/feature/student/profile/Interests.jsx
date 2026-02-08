import Section from "../../../components/ui/Section";
import { HashIcon } from "../../../components/ui/icons";

const spanStyle = "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark hover:border-border-accent-hover-light dark:hover:border-border-accent-hover-dark hover:bg-bg-surface-secondary-hover-light dark:hover:bg-bg-surface-secondary-hover-dark";

export default function Interests({ interests, className="" }) {
    return (
        <Section className={`rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <HashIcon className="w-5 h-5 text-icon-accent-default-light dark:text-icon-accent-default-dark" /> Interests
                </h2>
                <button className="text-sm font-medium text-text-accent-default-light hover:text-text-accent-hover-light dark:text-text-accent-default-dark dark:hover:text-text-accent-hover-dark">Edit</button>
            </div>
              
            <div className="flex flex-wrap gap-3">
                {interests.map((interest, index) => (
                    <span key={index} className={spanStyle}>
                        {interest}
                    </span>
                ))}
                <button className={spanStyle}>
                    <span>+ Add</span>
                </button>
            </div>
        </Section>
    );
}