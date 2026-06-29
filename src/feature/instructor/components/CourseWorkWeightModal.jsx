import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import NumberInput from "../../../components/form/NumberInput";
import { setCourseWorkWeight } from "../services/gradesApi";

export default function CourseWorkWeightModal({ isOpen, onClose, courseId, currentWeight, onSaved }) {
    const [quizWeight, setQuizWeight] = useState("");
    const [assignmentWeight, setAssignmentWeight] = useState("");
    const [midtermWeight, setMidtermWeight] = useState("");

    useEffect(() => {
        if (currentWeight) {
            setQuizWeight(currentWeight.quizWeight?.toString() ?? "");
            setAssignmentWeight(currentWeight.assignmentWeight?.toString() ?? "");
            setMidtermWeight(currentWeight.midtermWeight?.toString() ?? "");
        } else {
            setQuizWeight("");
            setAssignmentWeight("");
            setMidtermWeight("");
        }
    }, [currentWeight, isOpen]);

    const saveMutation = useMutation({
        mutationFn: () =>
            setCourseWorkWeight(courseId, {
                quizWeight: parseFloat(quizWeight) || 0,
                assignmentWeight: parseFloat(assignmentWeight) || 0,
                midtermWeight: parseFloat(midtermWeight) || 0,
            }),
        onSuccess: () => {
            onSaved?.();
            onClose();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        saveMutation.mutate();
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title="Configure Coursework Weights"
            description="Set the weight distribution for quizzes, assignments, and midterm exam as percentages of the total grade."
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={saveMutation.isPending ? "Saving..." : "Save Weights"}
            submitLoading={saveMutation.isPending}
        >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <NumberInput
                    label="Total Quizzes Weight (%)"
                    value={quizWeight}
                    onChange={(e) => setQuizWeight(e.target.value)}
                    placeholder="e.g., 5"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                />
                <NumberInput
                    label="Total Assignments Weight (%)"
                    value={assignmentWeight}
                    onChange={(e) => setAssignmentWeight(e.target.value)}
                    placeholder="e.g., 15"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                />
                <NumberInput
                    label="Midterm Weight (%)"
                    value={midtermWeight}
                    onChange={(e) => setMidtermWeight(e.target.value)}
                    placeholder="e.g., 20"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                />
            </div>
            <p className="mt-4 text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                These weights along with the final exam weight (set in the bylaw) determine the total grade calculation.
            </p>
        </BaseFormComponent>
    );
}
