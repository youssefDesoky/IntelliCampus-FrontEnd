import Button from "../../../../../components/ui/Button";
import { 
    ClockIcon, 
    FileIcon, 
    DownloadIcon, 
    CheckIcon, 
    EyeIcon, 
    ChartBarIcon 
} from "../../../../../components/ui/icons";

const AssignmentCard = ({ id, title, description, dueDate, daysLeft, status, score, totalPoints, attachments, onSubmitAssignment, onViewInstructions, onViewSubmission, onViewGrade }) => {
    const isUrgent = daysLeft <= 2;
    const statusColors = {
        pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
        submitted: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        graded: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
    };

    return (
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-row items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-1">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${statusColors[status] || statusColors.pending}`}>
                    {status === "pending" && (isUrgent ? "Due Soon" : "Pending")}
                    {status === "submitted" && "Submitted"}
                    {status === "graded" && "Graded"}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    <ClockIcon size={16} />
                    <span className={isUrgent && status === "pending" ? "font-semibold text-red-600 dark:text-red-400" : ""}>
                        {isUrgent && status === "pending" ? `Due in ${daysLeft}d (Urgent)` : `Due in ${daysLeft}d`}
                    </span>
                </div>
                {totalPoints && (
                    <div className="flex items-center gap-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        <span className="font-medium">{totalPoints} points</span>
                    </div>
                )}
                {score && (
                    <div className="flex items-center gap-1 text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        <span className="font-semibold text-green-600 dark:text-green-400">{score}%</span>
                    </div>
                )}
            </div>

            {/* Attachments Section */}
            {attachments && attachments.length > 0 && (
                <div className="mb-4 p-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <FileIcon size={16} className="text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                        <h4 className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase">
                            Attachments ({attachments.length})
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded hover:bg-border-primary-default-light dark:hover:bg-border-primary-default-dark transition-colors">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileIcon size={14} className="text-text-secondary-default-light dark:text-text-secondary-default-dark shrink-0" />
                                    <span className="text-xs text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                        {attachment.name}
                                    </span>
                                    {attachment.size && (
                                        <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap shrink-0">
                                            ({attachment.size})
                                        </span>
                                    )}
                                </div>
                                <button className="ml-2 p-1 hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark rounded transition-colors shrink-0">
                                    <DownloadIcon size={14} className="text-text-secondary-default-light dark:text-text-secondary-default-dark" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {status === "pending" && (
                    <>
                        <Button
                            className="w-full sm:flex-1"
                            startIcon={<CheckIcon size={16} />}
                            onClick={() => onSubmitAssignment && onSubmitAssignment({ id, title, dueDate, status })}
                        >
                            Submit Assignment
                        </Button>
                        <Button 
                            variant="secondary"
                            className="w-full sm:flex-1"
                            startIcon={<EyeIcon size={16} />}
                            onClick={() => onViewInstructions && onViewInstructions({ title, description, dueDate, daysLeft, status, attachments })}
                        >
                            View Instructions
                        </Button>
                    </>
                )}
                {status === "submitted" && (
                    <>
                        {daysLeft > 0 ? (
                            <Button
                                className="w-full sm:flex-1"
                                startIcon={<CheckIcon size={16} />}
                                onClick={() => onSubmitAssignment && onSubmitAssignment({ id, title, dueDate, status })}
                            >
                                Resubmit Assignment
                            </Button>
                        ) : null}
                        <Button
                            className={daysLeft > 0 ? "w-full sm:flex-1" : "w-full"}
                            variant="secondary"
                            startIcon={<EyeIcon size={16} />}
                            onClick={() => onViewSubmission && onViewSubmission({ title, description, dueDate, daysLeft, status, score, attachments })}
                        >
                            View Submission
                        </Button>
                    </>
                )}
                {status === "graded" && (
                    <>
                        <Button
                            className="w-full sm:flex-1"
                            startIcon={<ChartBarIcon size={16} />}
                            onClick={() => onViewGrade && onViewGrade({ title, description, dueDate, daysLeft, status, score, attachments })}
                        >
                            View Grade ({score}%)
                        </Button>
                        <Button
                            className="w-full sm:flex-1"
                            variant="secondary"
                            startIcon={<EyeIcon size={16} />}
                            onClick={() => onViewSubmission && onViewSubmission({ title, description, dueDate, daysLeft, status, score, attachments })}
                        >
                            View Submission
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AssignmentCard;
