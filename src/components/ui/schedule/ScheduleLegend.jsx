import LegendItem from "./LegendItem";

export default function ScheduleLegend({ legendItems }) {
    return (
        <div className="flex flex-wrap gap-4 p-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
            <span className="text-sm font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">Legend:</span>
            <div className="flex flex-wrap gap-3">
                {legendItems.map((item) => (
                    <LegendItem key={item.label} color={item.color} label={item.label} />
                ))}
            </div>
        </div>
    );
}