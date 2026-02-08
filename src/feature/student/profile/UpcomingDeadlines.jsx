import { Link } from "react-router-dom";
import Section from "../../../components/ui/Section";
import { CalendarIcon, ClockIcon } from "../../../components/ui/icons";

export default function UpcomingDeadlines({ reminders, className="" }) {
    return (
        <Section className={`rounded-2xl p-6 shadow-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-text-danger-default-light dark:text-text-danger-default-dark" /> Upcoming Deadlines
                </h2>
                <Link to="/reminders" className="text-sm text-text-accent-default-light dark:text-text-accent-default-dark hover:text-text-accent-hover-light dark:hover:text-text-accent-hover-dark font-medium">View All Reminders</Link>
            </div>

                {reminders.map((task, i) => (
                    <div key={i} className="p-4 rounded-xl border flex items-center justify-between group bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${task.priority === 'high' ? 'bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark text-text-danger-default-light dark:text-text-danger-default-dark' : task.priority === 'medium' ? 'bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-default-light dark:text-text-accent-default-dark' : 'bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark'}`}>
                                <ClockIcon className="w-5 h-5" />
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-sm text-text-primary-default-light dark:text-text-primary-default-dark">{task.title}</h4>
                                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">{task.course}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${task.priority === 'high' ? 'bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark border-border-accent-default-light dark:border-border-accent-default-dark text-text-danger-default-light dark:text-text-danger-default-dark' : task.priority === 'medium' ? 'bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark border-border-accent-default-light dark:border-border-accent-default-dark text-text-accent-default-light dark:text-text-accent-default-dark' : 'bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-border-accent-default-light dark:border-border-accent-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark'}`}>
                                {task.due}
                            </span>
                        </div>
                    </div>
                ))}
        </Section>
    );
}