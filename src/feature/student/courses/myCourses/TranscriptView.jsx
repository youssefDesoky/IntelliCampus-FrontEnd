import { useEffect, useState } from "react";

import Section from "../../../../components/ui/Section";
import Button from "../../../../components/ui/Button";
import { fetchTranscript, exportTranscriptPdf } from "../gradeApi";
import { DownloadIcon } from "../../../../components/ui/icons";

export default function TranscriptView() {
    const [transcript, setTranscript] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                setLoading(true);
                const data = await fetchTranscript();
                if (!cancelled) setTranscript(data);
            } catch (err) {
                console.error("Failed to load transcript:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportTranscriptPdf();
        } catch (err) {
            console.error("Failed to export transcript:", err);
        } finally {
            setExporting(false);
        }
    };

    const totalCredits = transcript.reduce((sum, c) => sum + (c.creditHours || 0), 0);

    if (loading) {
        return (
            <Section className="p-6">
                <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    Loading transcript...
                </p>
            </Section>
        );
    }

    if (transcript.length === 0) {
        return (
            <Section className="p-6">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                        No transcript data available
                    </h3>
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-md">
                        You have not completed any courses yet.
                    </p>
                </div>
            </Section>
        );
    }

    return (
        <Section className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-sm">
            <div className="p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-text-primary-active-light dark:text-text-primary-active-dark">
                        Academic Transcript
                    </h2>
                    <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                        Total Credits: {totalCredits}
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleExport}
                    loading={exporting}
                    loadingText="Exporting"
                    startIcon={<DownloadIcon className="w-4 h-4" />}
                >
                    Export PDF
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark">
                            <th className="text-left px-4 py-3 font-semibold">Code</th>
                            <th className="text-left px-4 py-3 font-semibold">Course Name</th>
                            <th className="text-center px-4 py-3 font-semibold">Credit Hrs</th>
                            <th className="text-center px-4 py-3 font-semibold">Coursework</th>
                            <th className="text-center px-4 py-3 font-semibold">Total</th>
                            <th className="text-center px-4 py-3 font-semibold">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transcript.map((course, idx) => (
                            <tr
                                key={course.courseId || idx}
                                className={`border-t border-border-primary-default-light dark:border-border-primary-default-dark ${
                                    idx % 2 === 0
                                        ? "bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark"
                                        : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark"
                                }`}
                            >
                                <td className="px-4 py-3 text-text-secondary-active-light dark:text-text-secondary-active-dark font-mono text-xs">
                                    {course.courseCode}
                                </td>
                                <td className="px-4 py-3 text-text-primary-active-light dark:text-text-primary-active-dark font-medium">
                                    {course.courseName}
                                </td>
                                <td className="px-4 py-3 text-center text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                    {course.creditHours}
                                </td>
                                <td className="px-4 py-3 text-center text-text-secondary-active-light dark:text-text-secondary-active-dark">
                                    {course.coursework}
                                </td>
                                <td className="px-4 py-3 text-center font-semibold text-text-primary-active-light dark:text-text-primary-active-dark">
                                    {course.totalGrade}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                        course.letter === "A" || course.letter === "A+" || course.letter === "A-"
                                            ? "bg-bg-surface-success-default-light dark:bg-bg-surface-success-default-dark text-text-success-default-light dark:text-text-success-default-dark"
                                            : course.letter === "B" || course.letter === "B+" || course.letter === "B-"
                                            ? "bg-bg-surface-blue-default-light dark:bg-bg-surface-blue-default-dark text-blue-800 dark:text-blue-200"
                                            : course.letter === "C" || course.letter === "C+" || course.letter === "C-"
                                            ? "bg-bg-surface-warning-default-light dark:bg-bg-surface-warning-default-dark text-yellow-800 dark:text-yellow-200"
                                            : course.letter === "D" || course.letter === "D+"
                                            ? "bg-bg-surface-warning-default-light dark:bg-bg-surface-warning-default-dark text-orange-800 dark:text-orange-200"
                                            : course.letter === "F"
                                            ? "bg-bg-surface-danger-default-light dark:bg-bg-surface-danger-default-dark text-red-800 dark:text-red-200"
                                            : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark"
                                    }`}>
                                        {course.letter}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
}
