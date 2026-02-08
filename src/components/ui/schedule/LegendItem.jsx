export default function LegendItem({ color, label }) {
    return (
        <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{label}</span>
        </div>
    );
}