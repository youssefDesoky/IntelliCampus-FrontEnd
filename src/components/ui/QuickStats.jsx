import Section from "../ui/Section";

export default function QuickStats({ items }) {
    return (
        <Section className={`bg-white rounded-lg p-4 shadow-sm`}>
            <h2 className="text-lg font-semibold text-gray-800">Quick Stats</h2>
            <ul className="space-y-3 mt-4">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {item.icon && (
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100`}>
                                    {item.icon}
                                </div>
                            )}

                            <div className="text-sm text-gray-700">{item.title}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">{item.value}</div>
                    </li>
                ))}
            </ul>
        </Section>
    );
}