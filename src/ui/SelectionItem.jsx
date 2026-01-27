export default function SelectionItem({ label, name, value, onChange, options = [], className = "" }) {
    return (
        <div className={`selection-item ${className}`}>
            <label htmlFor={name} className="block mb-2 font-medium text-sm text-default-text-light dark:text-default-text-dark">
                {label}
            </label>
            
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-default-border-light dark:border-default-border-dark rounded-md bg-default-bg-light dark:bg-default-bg-dark text-default-text-light dark:text-default-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}