import Section from "../../../../ui/Section";
import ReminderItem from "./ReminderItem";
import SideReminders from "./remindersAside/SideReminders";
import SelectBox from "../../../../ui/SelectBox";

export default function MainReminders({studentReminders}) {
    const sectionOrder = [
        { key: "today", label: "Today", dot: "bg-blue-500" },
        { key: "tomorrow", label: "Tomorrow", dot: "bg-gray-400" },
        { key: "thisWeek", label: "This Week", dot: "bg-gray-400" }
    ];

    return (
        <Section id="main-reminders" className="grid grid-cols-5">
            <div className="col-span-3 p-6">
                <div className="flex items-start justify-between mb-6">
                    <h2 className="text-xl font-semibold">Timeline</h2>

                    <SelectBox
                        options={[
                            { value: 'all', label: 'All Categories' },
                            { value: 'classes', label: 'Classes' },
                            { value: 'exams', label: 'Exams' },
                            { value: 'assignments', label: 'Assignments' },
                            { value: 'personal', label: 'Personal'}
                        ]}

                        selectedOption='all'
                    />
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

            <SideReminders className="col-span-2" />
        </Section>
    );
}