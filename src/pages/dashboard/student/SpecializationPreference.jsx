import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import {
    ArrowUpIcon,
    ArrowDownIcon,
    PlusIcon,
    XIcon,
    FloppyDiskIcon,
    CheckIcon,
    OrderedListIcon,
} from "../../../components/ui/icons";
import {
    checkEligibility,
    fetchMyPreferences,
    fetchDepartments,
    fetchSpecializations,
    savePreferences,
} from "../../../feature/student/services/specializationApi";
import { useError } from "../../../contexts/ErrorContext";

function GripIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="3" r="1.3" />
            <circle cx="11" cy="3" r="1.3" />
            <circle cx="5" cy="8" r="1.3" />
            <circle cx="11" cy="8" r="1.3" />
            <circle cx="5" cy="13" r="1.3" />
            <circle cx="11" cy="13" r="1.3" />
        </svg>
    );
}

function SearchIcon({ size = 16 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function Skeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            {[1, 2].map((col) => (
                <div key={col} className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-16 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function EligibilityCard({ eligibility }) {
    const progress = Math.min(100, (eligibility.passedHours / eligibility.minRequired) * 100);
    const eligible = eligibility.eligible;
    const remaining = Math.max(0, eligibility.minRequired - eligibility.passedHours);

    return (
        <Section className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-2xl p-8 max-w-xl mx-auto text-center">
            <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
                    eligible
                        ? "bg-bg-fill-success-muted-light dark:bg-bg-fill-success-muted-dark text-icon-success-default-light dark:text-icon-success-default-dark"
                        : "bg-bg-fill-warning-muted-light dark:bg-bg-fill-warning-muted-dark text-icon-warning-default-light dark:text-icon-warning-default-dark"
                }`}
            >
                {eligible ? <CheckIcon size={28} /> : <OrderedListIcon size={28} />}
            </div>
            <h2 className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-2">
                {eligible ? "You're eligible to submit your preferences" : "Not eligible yet"}
            </h2>
            <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark text-sm mb-5">
                {eligible
                    ? "You've met the credit hour requirement — rank your choices below."
                    : `You'll need ${remaining} more credit hour${remaining === 1 ? "" : "s"} before you can submit.`}
            </p>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                        eligible
                            ? "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark"
                            : "bg-bg-fill-warning-default-light dark:bg-bg-fill-warning-default-dark"
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                <span>{eligibility.passedHours} hrs completed</span>
                <span>{eligibility.minRequired} hrs required</span>
            </div>
        </Section>
    );
}

export default function SpecializationPreference() {
    const { t } = useTranslation("student/aside");
    const { showError } = useError();
    const queryClient = useQueryClient();

    const [rankedItems, setRankedItems] = useState([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [draggedId, setDraggedId] = useState(null);

    const { data: eligibility, isLoading: eligibilityLoading } = useQuery({
        queryKey: ["specializationEligibility"],
        queryFn: checkEligibility,
        staleTime: 5 * 60 * 1000,
    });

    const targetType = eligibility?.targetType || "Specialization";

    const { data: departmentsData, isLoading: deptsLoading } = useQuery({
        queryKey: ["departments"],
        queryFn: fetchDepartments,
        staleTime: 10 * 60 * 1000,
        enabled: targetType === "Department" && !!eligibility?.eligible,
    });

    const { data: specializationsData, isLoading: specsLoading } = useQuery({
        queryKey: ["specializations"],
        queryFn: fetchSpecializations,
        staleTime: 10 * 60 * 1000,
        enabled: targetType === "Specialization" && !!eligibility?.eligible,
    });

    const { data: existingPreferences, isLoading: prefsLoading } = useQuery({
        queryKey: ["specializationPreferences"],
        queryFn: fetchMyPreferences,
        staleTime: 5 * 60 * 1000,
        enabled: !!eligibility?.eligible,
    });

    const isLoading =
        eligibilityLoading ||
        ((eligibility?.eligible && (targetType === "Department" ? deptsLoading : specsLoading)) || prefsLoading);

    const allItems = useMemo(() => {
        if (targetType === "Department") {
            const depts = departmentsData?.data || departmentsData || [];
            return Array.isArray(depts)
                ? depts.map((d) => ({
                      id: d.departmentId,
                      name: d.departmentName,
                      nameAr: d.departmentNameAr,
                  }))
                : [];
        }
        const specs = Array.isArray(specializationsData) ? specializationsData : [];
        return specs.map((s) => ({
            id: s.specializationId,
            name: s.name,
            nameAr: s.nameAr,
            departmentName: s.departmentName,
        }));
    }, [targetType, departmentsData, specializationsData]);

    const rankedIds = useMemo(() => new Set(rankedItems.map((i) => i.id)), [rankedItems]);

    const availableItems = useMemo(() => allItems.filter((i) => !rankedIds.has(i.id)), [allItems, rankedIds]);

    const filteredAvailableItems = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return availableItems;
        return availableItems.filter(
            (i) =>
                i.name?.toLowerCase().includes(q) ||
                i.nameAr?.toLowerCase().includes(q) ||
                i.departmentName?.toLowerCase().includes(q)
        );
    }, [availableItems, searchQuery]);

    const canSave = rankedItems.length > 0;

    useMemo(() => {
        if (!existingPreferences || !existingPreferences.items || existingPreferences.items.length === 0) return;
        if (rankedItems.length > 0) return;
        setRankedItems(
            existingPreferences.items
                .sort((a, b) => a.rank - b.rank)
                .map((item) => {
                    const match = allItems.find((ai) => ai.id === item.targetId);
                    return {
                        id: item.targetId,
                        name: item.name || match?.name || "",
                        nameAr: match?.nameAr || "",
                        departmentName: match?.departmentName || "",
                    };
                })
                .filter((item) => item.name)
        );
    }, [existingPreferences, allItems]);

    const saveMutation = useMutation({
        mutationFn: () =>
            savePreferences(
                targetType,
                rankedItems.map((item, idx) => ({
                    targetId: item.id,
                    rank: idx + 1,
                    name: item.name,
                }))
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["specializationPreferences"] });
            setShowSuccessDialog(true);
        },
        onError: (err) => showError(err.message),
    });

    function addItem(item) {
        setRankedItems((prev) => [...prev, item]);
    }

    function removeItem(id) {
        setRankedItems((prev) => prev.filter((i) => i.id !== id));
    }

    function moveItemUp(id) {
        setRankedItems((prev) => {
            const idx = prev.findIndex((i) => i.id === id);
            if (idx <= 0) return prev;
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
    }

    function moveItemDown(id) {
        setRankedItems((prev) => {
            const idx = prev.findIndex((i) => i.id === id);
            if (idx === -1 || idx >= prev.length - 1) return prev;
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });
    }

    function clearAll() {
        setRankedItems([]);
    }

    function handleDragStart(e, id) {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(id));
    }

    function handleDragOver(e, overId) {
        e.preventDefault();
        if (draggedId === null || draggedId === overId) return;
        setRankedItems((prev) => {
            const fromIdx = prev.findIndex((i) => i.id === draggedId);
            const toIdx = prev.findIndex((i) => i.id === overId);
            if (fromIdx === -1 || toIdx === -1) return prev;
            const next = [...prev];
            const [moved] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, moved);
            return next;
        });
    }

    function handleDragEnd() {
        setDraggedId(null);
    }

    if (eligibilityLoading) {
        return (
            <>
                <PageHeader title={t("specializationPreference")} subtitle="Loading..." />
                <Skeleton />
            </>
        );
    }

    return (
        <>
            <PageHeader
                title={t("specializationPreference")}
                subtitle="Rank and order your preferred departments/specializations here."
            />

            {!eligibility?.eligible ? (
                <EligibilityCard eligibility={eligibility} />
            ) : isLoading ? (
                <Skeleton />
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Section>
                            <div className="flex h-full flex-col rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-md font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                        Available {targetType === "Department" ? "Departments" : "Specializations"}
                                    </h3>
                                    <span className="rounded-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark px-2.5 py-0.5 text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                        {availableItems.length}
                                    </span>
                                </div>

                                <div className="relative mb-3">
                                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-icon-secondary-default-light dark:text-icon-secondary-default-dark">
                                        <SearchIcon size={15} />
                                    </span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={`Search ${targetType === "Department" ? "departments" : "specializations"}...`}
                                        className="w-full rounded-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark py-2 pl-9 pr-3 text-sm text-text-primary-default-light dark:text-text-primary-default-dark placeholder:text-text-secondary-default-light dark:placeholder:text-text-secondary-default-dark focus:outline-none focus:ring-2 focus:ring-border-accent-default-light dark:focus:ring-border-accent-default-dark"
                                    />
                                </div>

                                {filteredAvailableItems.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
                                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            {searchQuery
                                                ? `No matches for "${searchQuery}"`
                                                : `All ${targetType === "Department" ? "departments" : "specializations"} have been added to your ranking.`}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="-mr-1 max-h-[440px] space-y-2 overflow-y-auto pr-1">
                                        {filteredAvailableItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-2 rounded-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 transition-all hover:ring-1 hover:ring-border-accent-default-light dark:hover:ring-border-accent-default-dark"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                                                        {item.name}
                                                    </p>
                                                    {(item.nameAr || item.departmentName) && (
                                                        <p className="truncate text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                                            {[item.nameAr, item.departmentName].filter(Boolean).join(" · ")}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => addItem(item)}
                                                    title="Add to ranking"
                                                    className="shrink-0 rounded-md p-1.5 text-icon-secondary-default-light dark:text-icon-secondary-default-dark transition-colors hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark hover:text-icon-accent-default-light dark:hover:text-icon-accent-default-dark"
                                                >
                                                    <PlusIcon size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Section>

                        <Section>
                            <div className="flex h-full flex-col rounded-2xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark p-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-md font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                                            Your Ranking
                                        </h3>
                                        <span className="rounded-full bg-bg-fill-accent-muted-light dark:bg-bg-fill-accent-muted-dark px-2.5 py-0.5 text-xs font-medium text-text-accent-default-light dark:text-text-accent-default-dark">
                                            {rankedItems.length}
                                        </span>
                                    </div>
                                    {rankedItems.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearAll}
                                            className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-icon-accent-default-light dark:hover:text-icon-accent-default-dark"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {rankedItems.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-accent-default-light dark:border-border-accent-default-dark px-4 py-10 text-center">
                                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                            Add {targetType === "Department" ? "departments" : "specializations"} from the left to start ranking them.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="-mr-1 max-h-[440px] space-y-2 overflow-y-auto pr-1">
                                        {rankedItems.map((item, idx) => (
                                            <div
                                                key={item.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, item.id)}
                                                onDragOver={(e) => handleDragOver(e, item.id)}
                                                onDragEnd={handleDragEnd}
                                                onDrop={(e) => e.preventDefault()}
                                                className={`flex items-center gap-2 rounded-lg border-l-4 bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 transition-opacity ${
                                                    idx === 0
                                                        ? "border-border-accent-default-light dark:border-border-accent-default-dark"
                                                        : "border-transparent"
                                                } ${draggedId === item.id ? "opacity-50" : ""}`}
                                            >
                                                <span className="shrink-0 cursor-grab text-icon-secondary-default-light dark:text-icon-secondary-default-dark active:cursor-grabbing">
                                                    <GripIcon />
                                                </span>
                                                <span
                                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                                        idx === 0
                                                            ? "bg-bg-fill-accent-muted-light dark:bg-bg-fill-accent-muted-dark text-text-accent-default-light dark:text-text-accent-default-dark"
                                                            : "bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark"
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                                                        {item.name}
                                                    </p>
                                                    {(item.nameAr || item.departmentName) && (
                                                        <p className="truncate text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                                            {[item.nameAr, item.departmentName].filter(Boolean).join(" · ")}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex shrink-0 items-center gap-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveItemUp(item.id)}
                                                        disabled={idx === 0}
                                                        title="Move up"
                                                        className="rounded-md p-1.5 text-icon-secondary-default-light dark:text-icon-secondary-default-dark transition-colors hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <ArrowUpIcon size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveItemDown(item.id)}
                                                        disabled={idx === rankedItems.length - 1}
                                                        title="Move down"
                                                        className="rounded-md p-1.5 text-icon-secondary-default-light dark:text-icon-secondary-default-dark transition-colors hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <ArrowDownIcon size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        title="Remove"
                                                        className="rounded-md p-1.5 text-icon-secondary-default-light dark:text-icon-secondary-default-dark transition-colors hover:bg-bg-surface-danger-default-light dark:hover:bg-bg-surface-danger-default-dark hover:text-white"
                                                    >
                                                        <XIcon size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>

                    <div className="sticky bottom-0 flex flex-col gap-3 rounded-t-2xl border-t-2 border-border-accent-default-light dark:border-border-accent-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {rankedItems.length === 0
                                ? "Add at least one preference to save."
                                : `${rankedItems.length} preference${rankedItems.length === 1 ? "" : "s"} ranked.`}
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            disabled={!canSave}
                            loading={saveMutation.isPending}
                            onClick={() => saveMutation.mutate()}
                            startIcon={<FloppyDiskIcon />}
                        >
                            Save Preferences
                        </Button>
                    </div>
                </div>
            )}

            <Dialog
                isOpen={showSuccessDialog}
                variant="success"
                title="Preferences Saved"
                onClose={() => setShowSuccessDialog(false)}
            >
                Your {targetType.toLowerCase()} preferences have been saved successfully.
            </Dialog>
        </>
    );
}