import Section from "../../../../ui/Section";
import ReminderItem from "./ReminderItem";
import SideReminders from "./remindersAside/SideReminders";

export default function MainReminders({studentReminders}) {
    const sectionOrder = [
        { key: "today", label: "Today", dot: "bg-blue-500" },
        { key: "tomorrow", label: "Tomorrow", dot: "bg-gray-400" },
        { key: "thisWeek", label: "This Week", dot: "bg-gray-400" }
    ];

    return (
        <Section id="main-reminders" className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-start justify-between mb-6">
                    <h2 className="text-xl font-semibold">Timeline</h2>

                    <div className="flex items-center gap-3">
                        <select className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-2 shadow-sm cursor-pointer">
                            <option>All Categories</option>
                            <option>Classes</option>
                            <option>Exams</option>
                            <option>Assignments</option>
                            <option>Personal</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-8">
                    {sectionOrder.map((section) => (
                        <section key={section.key}>
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`w-3 h-3 rounded-full ${section.dot}`}></span>
                                <h3 className="text-sm font-medium text-gray-700">{section.label}</h3>
                                <div className="flex-1 border-t border-gray-200 ml-4"></div>
                            </div>

                            <div className="space-y-4">
                                {(studentReminders[section.key] || []).map((item, idx) => (
                                    <ReminderItem key={idx} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <SideReminders />
        </Section>
    );
}