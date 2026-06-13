import { useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import ImportDialog from "../../../components/ui/ImportDialog";
import { ImportIcon } from "../../../components/ui/icons";
import { uploadExams } from "../../../feature/admin/services/adminApi";
import ExamScheduler from "../../../feature/admin/components/ExamScheduler";

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
            <PageHeader title="Manage Exams" subtitle="Import exam schedules and auto-generate conflict-free timetables">
                <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                    <ImportIcon size={24} />
                    Import Exams
                </Button>
            </PageHeader>

            <Section>
                <ExamScheduler />
            </Section>

            {result && (
                <Section>
                    <div className="flex items-center gap-4 text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        <span className="text-text-success-default-light dark:text-text-success-default-dark">
                            ✅ Last import: {result.successCount} succeeded
                        </span>
                        {result.failCount > 0 && (
                            <span className="text-text-danger-default-light dark:text-text-danger-default-dark">
                                ❌ {result.failCount} failed
                            </span>
                        )}
                        <span>/ {result.totalRows} total</span>
                    </div>
                </Section>
            )}

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
