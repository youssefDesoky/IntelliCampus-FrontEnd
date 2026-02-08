import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import { BookIcon, CalendarIcon, ClockIcon, LocationDotIcon } from "../../../components/ui/icons";

const examTypeStyles = {
    midterm: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-text-blue-default-light dark:text-text-blue-default-dark border-border-blue-default-light dark:border-border-blue-default-dark",
    final: "bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark text-text-green-default-light dark:text-text-green-default-dark border-border-green-default-light dark:border-border-green-default-dark",
};

export default function ExamSchedule({ exams = [] }) {
    // Calculate days remaining
    const getDaysRemaining = (dateStr) => {
        const examDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <Section className="exam-schedule space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard 
                    icon={<BookIcon className="w-6 h-6" />}
                    label="Total Exams"
                    value={exams.length}
                    color="blue"
                />
                <SummaryCard 
                    icon={<CalendarIcon className="w-6 h-6" />}
                    label="This Week"
                    value={exams.filter(e => getDaysRemaining(e.date) <= 7 && getDaysRemaining(e.date) >= 0).length}
                    color="amber"
                />
                <SummaryCard 
                    icon={<ClockIcon className="w-6 h-6" />}
                    label="Next Exam"
                    value={exams.length > 0 ? `${getDaysRemaining(exams[0]?.date)} days` : "N/A"}
                    color="green"
                />
            </div>

            {/* Exam Cards */}
            <div className="space-y-4">
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} daysRemaining={getDaysRemaining(exam.date)} />
                    ))
                ) : (
                    <div className="text-center py-12 text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        <BookIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No exams found</p>
                        <p className="text-sm">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </Section>
    );
}

function ExamCard({ exam, daysRemaining }) {
    const isUrgent = daysRemaining <= 3 && daysRemaining >= 0 && exam.type === "final" || daysRemaining <= 1 && daysRemaining >= 0 && exam.type === "midterm";
    const examDate = new Date(exam.date);
    
    return (
        <div className={`
            flex flex-row gap-2 md:gap-4  p-2.5 md:p-4 
            rounded-lg border
            ${isUrgent 
                ? "border-border-danger-default-light dark:border-border-danger-default-dark bg-bg-surface-danger-default-light dark:bg-bg-surface-red-default-dark" 
                : "border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
            }
            shadow-sm hover:shadow-md transition-shadow
        `}>
            {/* Date Badge */}
            <div className={`
                flex flex-col items-center justify-center
                w-16 md:w-20 h-20 rounded-lg 
                ${examTypeStyles[exam.type] || examTypeStyles.midterm}
                border
            `}>
                <span className="text-xl md:text-2xl font-bold">{examDate.getDate()}</span>
                <span className="text-xs uppercase">{examDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-xs">{exam.day?.slice(0, 3)}</span>
            </div>

            {/* Exam Details */}
            <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        {exam.courseCode}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded capitalize ${examTypeStyles[exam.type]}`}>
                        {exam.type}
                    </span>
                    {isUrgent && (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-bg-fill-danger-default-light dark:bg-bg-fill-danger-default-dark text-text-accent-active-light dark:text-text-accent-active-dark animate-pulse">
                            {daysRemaining === 0 ? "Today!" : `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left`}
                        </span>
                    )}
                </div>
                
                <h3 className="text-md md:text-lg font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
                    {exam.courseName}
                </h3>

                <div className="flex flex-wrap flex-col md:flex-row md:gap-4 gap-1 text-xs md:text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                    <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {exam.startTime} - {exam.endTime} ({exam.duration})
                    </span>
                    <span className="flex items-center gap-1">
                        <LocationDotIcon className="w-4 h-4" />
                        {exam.location}
                    </span>
                </div>
            </div>

            {/* Days Remaining */}
            {!isUrgent && daysRemaining >= 0 && (
                <div className="flex items-center justify-center pl-2.5 md:pl-4 border-l border-border-primary-default-light dark:border-border-primary-default-dark md:border-none">
                    <div className="text-center">
                        <span className="text-2xl font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                            {daysRemaining}
                        </span>
                        <p className="text-xs text-text-secondary-active-light dark:text-text-secondary-active-dark">
                            days left
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ icon, label, value, color }) {
    const colorStyles = {
        blue: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-text-blue-accent-light dark:text-text-blue-accent-dark",
        amber: "bg-bg-surface-amber-default-light dark:bg-bg-surface-amber-default-dark text-text-amber-accent-light dark:text-text-amber-accent-dark",
        green: "bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark text-text-green-accent-light dark:text-text-green-accent-dark",
        purple: "bg-bg-surface-purple-default-light dark:bg-bg-surface-purple-default-dark text-text-purple-accent-light dark:text-text-purple-accent-dark",
    };

    return (
        <div className="p-4 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        {label}
                    </p>
                    <p className="text-xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}