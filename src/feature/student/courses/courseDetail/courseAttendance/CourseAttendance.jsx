import { useRef, useState } from "react";
import Section from "../../../../../components/ui/Section";
import Button from "../../../../../components/ui/Button";
import TextArea from "../../../../../components/ui/TextArea";
import BaseFormComponent from "../../../../../components/ui/BaseFormComponent";
import { CheckIcon, DownloadIcon, XIcon, CloudUploadIcon, FileLinesIcon, FileIcon, TrashIcon, PaperclipIcon } from "../../../../../components/ui/icons";
import Table from "../../../../../components/ui/Table";
import AttendanceOverall from "./AttendanceOverall";
import AttendanceBreakdown from "./AttendanceBreakdown";
import AttendanceExcuseCard from "./AttendanceExcuseCard";


export default function CourseAttendance() {
    const fileInputRef = useRef(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [reason, setReason] = useState("");

    const openForm = () => setIsFormOpen(true);

    const closeForm = () => {
        setIsFormOpen(false);
        setSelectedFile(null);
        setReason("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files?.[0] || null);
    };

    const handleSubmit = () => {
        if (!reason.trim() || !selectedFile) return;
        closeForm();
    };

    // Example layout of the expected backend response:
    const mockExpectedBackendResponse = {
        summary: {
            percentage: 85,
            attendedSessions: 21,
            missedSessions: 4,
            totalSessions: 25,
        },
        breakdown: {
            percentage: 85,
            presentSessions: 21,
            missedSessions: 4,
            totalSessions: 25,
            onTimePercentage: 80,
            needsImprovementPercentage: 20
        },
        history: sampleTableData // usually this array goes here
    };

    return (
        <>
            <Section className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AttendanceOverall attendance={mockExpectedBackendResponse.summary} onRequestExcuse={openForm} />
                    <AttendanceBreakdown breakdown={mockExpectedBackendResponse.breakdown} />
                    <AttendanceExcuseCard />
                </div>
            </Section>

            <Section>
                <Table
                    title="Attendance History"
                    description="Complete record of your class attendance"
                    componentButton={<Button variant="secondary" startIcon={<DownloadIcon size={18} />}>Export</Button>}
                    headers={["Date", "Time", "Type", "Status"]}
                    data={sampleTableData.map((session) => ({
                        date: <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{session.date}</span>,
                        time: <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{session.time}</span>,
                        type: (
                            <span className="inline-flex items-center rounded bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2 py-0.5 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                                {session.type}
                            </span>
                        ),
                        status: session.status === "Present" ? (
                            <span className="inline-flex items-center justify-center rounded-full bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark p-1.5">
                                <CheckIcon size={14} className="text-text-success-active-light dark:text-text-success-active-dark" />
                            </span>
                        ) : (
                            <span className="inline-flex items-center justify-center rounded-full bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark p-1.5">
                                <XIcon size={14} className="text-text-danger-active-light dark:text-text-danger-active-dark" />
                            </span>
                        ),
                    }))}
                    wrapInSection={false}
                    showHeaderActions={false}
                    showPagination={true}
                    displayRowLimit={10}
                    showSelectionColumn={false}
                    showActionsColumn={false}
                    grouped={true}
                />
            </Section>

            <BaseFormComponent
                isOpen={isFormOpen}
                title="Request an excuse"
                description="Add a supporting file and explain the reason for your absence or delay."
                onClose={closeForm}
                onSubmit={handleSubmit}
                submitText="Submit Request"
                cancelText="Cancel"
                maxWidth="max-w-xl"
                contentClassName="space-y-6"
            >
                <div className="space-y-4">
                    <label className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            <FileLinesIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                            Reason for excuse
                        </span>
                        <TextArea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Explain why you missed the session and any relevant details..."
                            className="w-full rounded-2xl border border-border-primary-default-light bg-bg-surface-secondary-default-light px-4 py-3 text-sm text-text-primary-light outline-none transition-all placeholder:text-text-secondary-light focus:border-border-accent-default-light focus:ring-4 focus:ring-accent-500/10 dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-text-primary-dark dark:placeholder:text-text-secondary-dark"
                        />
                    </label>

                    <div className="block">
                        <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                            <PaperclipIcon size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                            Supporting document
                        </span>

                        {!selectedFile ? (
                            <label className="group flex flex-col items-center justify-center w-full min-h-36 rounded-2xl border-2 border-dashed border-border-primary-default-light bg-bg-surface-secondary-default-light hover:bg-bg-surface-primary-hover-light hover:border-border-accent-default-light transition-all dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:hover:bg-bg-surface-primary-hover-dark">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-fill-secondary-default-light group-hover:scale-110 transition-transform duration-200 dark:bg-bg-fill-secondary-default-dark mb-3">
                                    <CloudUploadIcon size={24} className="text-text-secondary-light dark:text-text-secondary-dark" />
                                </div>
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                                    Click to upload or drag and drop
                                </p>
                                <p className="mt-1 text-xs text-text-secondary-light dark:text-text-secondary-dark text-center">
                                    PDF, PNG, JPG, or DOC (max. 10MB)
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-border-primary-default-light bg-bg-surface-primary-default-light shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all dark:border-border-primary-default-dark dark:bg-bg-surface-primary-default-dark">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-surface-accent-default-light text-text-accent-active-light dark:bg-bg-surface-accent-default-dark dark:text-text-accent-active-dark">
                                        <FileIcon size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold truncate text-text-primary-light dark:text-text-primary-dark">{selectedFile.name}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
                                            {selectedFile.size ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={() => setSelectedFile(null)}
                                    className="shrink-0 text-text-danger-default-light hover:bg-bg-surface-danger-default-light dark:text-text-danger-default-dark dark:hover:bg-bg-surface-danger-default-dark"
                                >
                                    <TrashIcon size={18} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </BaseFormComponent>
        </>
    );
}

const sampleTableData = [
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        type: "Lecture",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        type: "Section",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        type: "Lecture",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        type: "Section",
        status: "Absent"
    },
        {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Absent"
    },
        {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Present"
    },
    {
        date: "24 Sep 2024",
        time: "10:00 AM",
        topic: "Introduction to React",
        status: "Absent"
    }
]