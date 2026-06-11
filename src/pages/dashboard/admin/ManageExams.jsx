import { useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import ImportDialog from "../../../components/ui/ImportDialog";
import { ImportIcon, FileLinesIcon, CalendarDaysIcon, ClockIcon, HashIcon, BookIcon } from "../../../components/ui/icons";
import { uploadExams } from "../../../feature/admin/services/adminApi";

const columnsWithExamType = [
    { field: "CourseCode", desc: "Course code as registered in the system" },
    { field: "Title", desc: "Exam title / name" },
    { field: "ExamType (Midterm/Final)", desc: "Midterm or Final" },
    { field: "Date (yyyy-MM-dd)", desc: "e.g. 2026-06-15" },
    { field: "Time (HH:mm)", desc: "e.g. 10:00" },
    { field: "DurationMinutes", desc: "Duration in minutes" },
    { field: "RoomName", desc: "Room name as registered (optional)" },
    { field: "Description", desc: "Any additional notes (optional)" },
];

const columnsWithoutExamType = [
    { field: "CourseCode", desc: "Course code as registered in the system" },
    { field: "Title", desc: "Exam title / name" },
    { field: "Date (yyyy-MM-dd)", desc: "e.g. 2026-06-15" },
    { field: "Time (HH:mm)", desc: "e.g. 10:00" },
    { field: "DurationMinutes", desc: "Duration in minutes" },
    { field: "RoomName", desc: "Room name as registered (optional)" },
    { field: "Description", desc: "Any additional notes (optional)" },
];

const examTypeOptions = [
    { value: "", label: "From file column" },
    { value: "Midterm", label: "Midterm" },
    { value: "Final", label: "Final" },
];

export default function ManageExams() {
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedExamType, setSelectedExamType] = useState(examTypeOptions[0]);

    const expectedColumns = selectedExamType.value ? columnsWithoutExamType : columnsWithExamType;

    const handleImport = async (file) => {
        setIsUploading(true);
        try {
            const examType = selectedExamType.value || null;
            const res = await uploadExams(file, examType);
            setResult(res);
            if (res.failCount > 0) {
                const msg = [
                    `✅ ${res.successCount} imported, ❌ ${res.failCount} failed`,
                    ...res.errors.slice(0, 20),
                ].join("\n");
                alert(msg);
            } else {
                alert(`✅ Successfully imported ${res.successCount} exams`);
            }
        } catch (err) {
            console.error("Failed to upload exams:", err);
            alert(err.message);
        } finally {
            setIsUploading(false);
            setIsImportOpen(false);
        }
    };

    return (
        <>
            <PageHeader title="Manage Exams" subtitle="Import exam schedules by uploading an Excel file">
                <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                    <ImportIcon size={24} />
                    Import Exams
                </Button>
            </PageHeader>

            <Section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4 flex items-center gap-2">
                            <FileLinesIcon size={18} />
                            Expected File Format
                        </h3>
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-4">
                            Upload an <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> file with the following columns:
                        </p>
                        <div className="space-y-2.5">
                            {expectedColumns.map((col, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark mt-1.5" />
                                    <div>
                                        <code className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                            {col.field}
                                        </code>
                                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">
                                            {col.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark p-6 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary-default-light dark:text-text-primary-default-dark mb-4 flex items-center gap-2">
                            <CalendarDaysIcon size={18} />
                            What This Does
                        </h3>
                        <ul className="space-y-3 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 mt-1 text-text-accent-default-light dark:text-text-accent-default-dark">
                                    <HashIcon size={14} />
                                </span>
                                Creates exam records from your file (Midterm or Final)
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 mt-1 text-text-accent-default-light dark:text-text-accent-default-dark">
                                    <BookIcon size={14} />
                                </span>
                                Assigns each exam to its course (matched by CourseCode)
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 mt-1 text-text-accent-default-light dark:text-text-accent-default-dark">
                                    <CalendarDaysIcon size={14} />
                                </span>
                                Sets date, time, and duration for each exam
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="shrink-0 mt-1 text-text-accent-default-light dark:text-text-accent-default-dark">
                                    <ClockIcon size={14} />
                                </span>
                                Optionally assigns exams to rooms (matched by RoomName)
                            </li>
                        </ul>

                        {result && (
                            <div className="mt-6 pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                                <h4 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                                    Last Import Result
                                </h4>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-text-success-default-light dark:text-text-success-default-dark">
                                        ✅ {result.successCount} succeeded
                                    </span>
                                    {result.failCount > 0 && (
                                        <span className="text-text-danger-default-light dark:text-text-danger-default-dark">
                                            ❌ {result.failCount} failed
                                        </span>
                                    )}
                                    <span className="text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                        / {result.totalRows} total
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Section>

            {isImportOpen && (
                <ImportDialog
                    title="Import Exams"
                    subtitle="Upload a file to bulk-import exam schedules."
                    onClose={() => setIsImportOpen(false)}
                    onImport={handleImport}
                >
                    <div>
                        <label className="block text-sm font-medium mb-2 text-text-primary-default-light dark:text-text-primary-default-dark">
                            Exam Type Override
                        </label>
                        <select
                            value={selectedExamType.value}
                            onChange={(e) => {
                                const match = examTypeOptions.find(o => o.value === e.target.value);
                                setSelectedExamType(match || examTypeOptions[0]);
                            }}
                            className="w-full rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark px-3 py-2 bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-sm"
                        >
                            {examTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1.5">
                            {selectedExamType.value
                                ? `All exams will be imported as "${selectedExamType.label}" regardless of the column in the file.`
                                : "Each exam will use its own ExamType column value from the file."}
                        </p>
                    </div>
                </ImportDialog>
            )}
        </>
    );
}
