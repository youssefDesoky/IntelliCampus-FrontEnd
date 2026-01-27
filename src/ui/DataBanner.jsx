export default function DataBanner({title, span=undefined, data, className=""}) {
    return (
        <div className={`bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark p-4 md:p-6 rounded-lg col-span-${data.length} ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-md font-semibold">{title}</h3>
                {span}
            </div>

            <div className="flex items-center justify-around">
                {data.map((item, index) => (
                    <div key={index} className="w-full border-r-2 last:border-0 flex flex-col items-center">
                        <h4 className="text-2xl font-bold">{item.value}</h4>
                        <p className="text-sm font-semibold">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}