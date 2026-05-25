import Section from "../../../components/ui/Section";
import BoxData from "../../../components/ui/BoxData";
import { BookIcon, CalendarIcon, ClockIcon, LocationDotIcon } from "../../../components/ui/icons";

const examTypeStyles = {
    midterm: "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-text-blue-default-light dark:text-text-blue-default-dark border-border-blue-default-light dark:border-border-blue-default-dark",
    final: "bg-bg-surface-green-default-light dark:bg-bg-surface-green-default-dark text-text-green-default-light dark:text-text-green-default-dark border-border-green-default-light dark:border-border-green-default-dark",
};

export default function ExamSchedule({ exams = [] }) {
    const getDaysRemaining = (dateStr) => {
        const examDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        examDate.setHours(0, 0, 0, 0);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const sortedExams = [...exams].sort((left, right) => new Date(left.date) - new Date(right.date));
    const nextExam = sortedExams[0];
    const thisWeekCount = exams.filter((exam) => {
        const remaining = getDaysRemaining(exam.date);
        return remaining <= 7 && remaining >= 0;
    }).length;

    return (
        <Section className="exam-schedule space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BoxData 
                    icon={<BookIcon className="w-6 h-6" />}
                    title="Next Exam"
                    value={nextExam ? nextExam.courseName : "No upcoming exams"}
                    iconStyle="bg-blue-100 dark:bg-bg-surface-blue-default-dark text-blue-600 dark:text-blue-400"
                />
                <BoxData 
                    icon={<ClockIcon className="w-6 h-6" />}
                    title="Next Exam Countdown"
                    value={nextExam ? `${getDaysRemaining(nextExam.date)} days` : "N/A"}
                    iconStyle="bg-green-100 dark:bg-bg-surface-green-default-dark text-emerald-600 dark:text-emerald-400"
                />
                <BoxData 
                    icon={<CalendarIcon className="w-6 h-6" />}
                    title="Due This Week"
                    value={`${thisWeekCount} exams`}
                    iconStyle="bg-yellow-100 dark:bg-bg-surface-yellow-default-dark text-amber-600 dark:text-amber-400"
                />
            </div>

            {/* Exam Cards */}
            <div className="space-y-4">
                {sortedExams.length > 0 ? (
                    sortedExams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} daysRemaining={getDaysRemaining(exam.date)} />
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-center py-12 text-text-secondary-active-light dark:text-text-secondary-active-dark">
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
    const isUrgent = (daysRemaining <= 3 && daysRemaining >= 0 && exam.type === "final") || (daysRemaining <= 1 && daysRemaining >= 0 && exam.type === "midterm");
    const examDate = new Date(exam.date);
    const remainingLabel = daysRemaining < 0 ? `${Math.abs(daysRemaining)} days ago` : daysRemaining === 0 ? "Today" : `${daysRemaining} days left`;
    
    return (
        <div className={`
            flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4 p-4 md:p-5
            rounded-2xl border
            ${isUrgent 
                ? "border-border-danger-default-light dark:border-border-danger-default-dark bg-bg-surface-danger-default-light/80 dark:bg-bg-surface-red-default-dark/70" 
                : "border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
            }
            shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5
        `}>
            {/* Date Badge */}
            <div className={`
                flex flex-col items-center justify-center
                w-full md:w-24 h-20 md:h-auto rounded-xl md:rounded-2xl 
                ${examTypeStyles[exam.type] || examTypeStyles.midterm}
                border
                shrink-0
            `}>
                <span className="text-xl md:text-2xl font-bold leading-none">{examDate.getDate()}</span>
                <span className="text-xs uppercase tracking-wide mt-1">{examDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-xs mt-0.5">{exam.day?.slice(0, 3)}</span>
            </div>

            {/* Exam Details */}
            <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark">
                        {exam.courseCode}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${examTypeStyles[exam.type]}`}>
                        {exam.type}
                    </span>
                    {isUrgent && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-bg-fill-danger-default-light dark:bg-bg-fill-danger-default-dark text-text-accent-active-light dark:text-text-accent-active-dark animate-pulse">
                            {remainingLabel}
                        </span>
                    )}
                </div>
                
                <h3 className="text-base md:text-lg font-semibold text-text-primary-active-light dark:text-text-primary-active-dark truncate">
                    {exam.courseName}
                </h3>

                <div className="flex flex-col md:flex-row md:flex-wrap md:gap-4 gap-2 text-xs md:text-sm text-text-secondary-active-light dark:text-text-secondary-active-dark">
                    <span className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4" />
                        {exam.startTime} - {exam.endTime} ({exam.duration})
                    </span>
                    <span className="flex items-center gap-1.5">
                        <LocationDotIcon className="w-4 h-4" />
                        {exam.location}
                    </span>
                </div>
            </div>

            {/* Days Remaining */}
            {!isUrgent && daysRemaining >= 0 && (
                <div className="flex items-center justify-between md:justify-center md:pl-4 md:border-l border-border-primary-default-light dark:border-border-primary-default-dark">
                    <div className="text-center md:min-w-20">
                        <span className="text-2xl font-bold text-text-accent-active-light dark:text-text-accent-active-dark leading-none">
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
