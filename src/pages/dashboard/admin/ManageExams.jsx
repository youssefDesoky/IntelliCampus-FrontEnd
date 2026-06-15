import { useState, useRef, useCallback } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";
import Dialog from "../../../components/ui/Dialog";
import ImportDialog from "../../../components/ui/ImportDialog";
import { ArrowRotateRightIcon, CalendarCheckIcon, DownloadIcon, ImportIcon } from "../../../components/ui/icons";
import useDeviceType from "../../../hooks/useDeviceType";
import { uploadExams } from "../../../feature/admin/services/adminApi";
import ExamScheduler from "../../../feature/admin/components/ExamScheduler";

const examTypeOptions = [
    { value: "", label: "From file column" },
    { value: "Midterm", label: "Midterm" },
    { value: "Final", label: "Final" },
];

function downloadCSV(data, filename) {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];
    for (const row of data) {
        csvRows.push(headers.map(h => {
            const v = row[h];
            const s = String(v ?? "");
            return s.includes(",") || s.includes('"') || s.includes("\n")
                ? `"${s.replace(/"/g, '""')}"` : s;
        }).join(","));
    }
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

export default function ManageExams() {
    const { isPhone } = useDeviceType();
    const schedulerRef = useRef(null);
    const [hasSchedule, setHasSchedule] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
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

    const handleExport = useCallback(() => {
        const data = schedulerRef.current?.getScheduleData?.();
        if (data && data.length > 0) {
            downloadCSV(data, `exam-schedule-${new Date().toISOString().split("T")[0]}.csv`);
        }
    }, []);

    return (
        <>
            <PageHeader title="Manage Exams" subtitle="Import exam schedules and auto-generate conflict-free timetables">
                <div className="flex items-center gap-2">
                    <Button variant="primary" onClick={() => schedulerRef.current?.handleAuto?.()}>
                        <CalendarCheckIcon size={24} />
                        {!isPhone && "Auto Schedule"}
                    </Button>
                    {hasSchedule && (
                        <Button variant="secondary" onClick={() => setConfirmReset(true)}>
                            <ArrowRotateRightIcon size={24} />
                            {!isPhone && "Reset"}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleExport} disabled={!hasSchedule}>
                        <DownloadIcon size={24} />
                        {!isPhone && "Export Excel"}
                    </Button>
                    <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
                        <ImportIcon size={24} />
                        {!isPhone && "Import Exams"}
                    </Button>
                </div>
            </PageHeader>

            <Section>
                <ExamScheduler ref={schedulerRef} onScheduleChange={setHasSchedule} />
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

            <Dialog
                isOpen={confirmReset}
                variant="warning"
                title="Reset Schedule?"
                confirmText="Yes, Reset"
                cancelText="Cancel"
                onClose={() => setConfirmReset(false)}
                onConfirm={() => { schedulerRef.current?.handleReset?.(); setConfirmReset(false); }}
            >
                This will remove all scheduled exams. This action cannot be undone.
            </Dialog>

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
