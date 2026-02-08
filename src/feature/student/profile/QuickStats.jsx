import Section from "../../../components/ui/Section";

export default function QuickStats({ items, className="" }) {
    return (
        <Section className={`rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <h2 className="text-lg font-semibold mb-6">Quick Stats</h2>
            <div className="space-y-5">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                        <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark flex items-center gap-2">{item.icon} {item.label}</span>
                        <span className="font-mono font-bold text-lg">{item.value}</span>
                    </div>
                ))}
            </div>
        </Section>
    );
}