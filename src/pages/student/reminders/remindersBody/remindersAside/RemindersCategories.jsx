export default function RemindersCategories({ styles }) {
    const categories = [
        { id: 1, name: "Classes", count: 12, color: "blue" },
        { id: 2, name: "Exams", count: 3, color: "yellow" },
        { id: 3, name: "Assignments", count: 8, color: "red" },
        { id: 4, name: "Personal", count: 5, color: "violet" },
    ];

    const colorMap = {
        blue:   { pill: "bg-blue-50",   dot: "bg-blue-500" },
        yellow: { pill: "bg-yellow-50", dot: "bg-yellow-400" },
        red:    { pill: "bg-red-50",    dot: "bg-red-500" },
        violet: { pill: "bg-violet-50", dot: "bg-violet-500" },
    };

    return (
        <div id="reminders-categories" className={styles}>
            <h2 className="text-lg font-medium mb-3">Categories</h2>
            <div className="p-1">
                <ul className="category-list">
                    {categories.map((category) => {
                        const styles = colorMap[category.color] || { pill: "bg-gray-50", dot: "bg-gray-400" };
                        return (
                            <li
                                key={category.id}
                                className={`flex items-center justify-between p-3 my-3 w-full rounded-lg ${styles.pill} border border-transparent`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${styles.dot}`} />
                                    <span className="font-semibold text-sm text-gray-700">{category.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{category.count}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}