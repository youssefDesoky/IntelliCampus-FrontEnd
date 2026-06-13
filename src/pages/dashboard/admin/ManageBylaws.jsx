import { useState, useEffect, useCallback, useRef } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import BylawForm from "../../../feature/admin/components/BylawForm";
import {
    FilePenIcon,
    TrashIcon,
    BookIcon,
    PlusIcon,
    CloudUploadIcon,
    CheckIcon,
    XIcon,
} from "../../../components/ui/icons";
import {
    fetchBylaws,
    createBylaw,
    deleteBylaw,
    toggleBylawActive,
    uploadBylawDocument,
    setBylawGradeScales,
} from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;
const tableHeaders = ["Bylaw", "Version", "Status", "Students", "Document"];

function buildRow(b) {
    return {
        bylaw: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    <BookIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                    <p className="font-medium">{b.name}</p>
                    {b.description && (
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate max-w-[200px]">{b.description}</p>
                    )}
                </div>
            </div>
        ),
        version: `v${b.version}`,
        status: (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${b.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                {b.isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                {b.isActive ? "Active" : "Inactive"}
            </span>
        ),
        students: b.studentCount ?? 0,
        document: b.fileName ? (
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate max-w-[120px] block" title={b.fileName}>
                {b.fileName}
            </span>
        ) : "—",
        _id: b.baylawId,
        _raw: b,
    };
}

export default function ManageBylaws() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rawBylaws, setRawBylaws] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingBylaw, setEditingBylaw] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [gradeScalesTarget, setGradeScalesTarget] = useState(null);

    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formIsLoading, setFormIsLoading] = useState(false);
    const [uploadTarget, setUploadTarget] = useState(null);
    const fileInputRef = useRef(null);

    const loadBylaws = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchBylaws();
            setRawBylaws(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            setError(err.message);
            setRawBylaws([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadBylaws(); }, [loadBylaws]);

    const filteredBylaws = rawBylaws.filter((b) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            b.name?.toLowerCase().includes(q) ||
            b.description?.toLowerCase().includes(q) ||
            b.fileName?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredBylaws.length / ITEMS_PER_PAGE));
    const paginatedBylaws = filteredBylaws.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const selectedIndices = paginatedBylaws.map((b, i) => selectedRowIds.includes(b.baylawId) ? i : -1).filter(i => i !== -1);

    const handleEdit = (bylaw) => {
        setEditingBylaw(bylaw);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setFormIsLoading(true);
            const { _file, ...bylawData } = data;
            const created = await createBylaw(bylawData);
            if (_file && created?.baylawId) {
                await uploadBylawDocument(created.baylawId, _file);
            }
            await loadBylaws();
            setEditingBylaw(null);
            setIsFormOpen(false);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setFormIsLoading(false);
        }
    };

    const handleGradeScalesSubmit = async (data) => {
        if (!gradeScalesTarget) return;
        try {
            setFormIsLoading(true);
            if (data.gradeScales) {
                await setBylawGradeScales(gradeScalesTarget.baylawId, data.gradeScales);
            }
            if (data._file) {
                await uploadBylawDocument(gradeScalesTarget.baylawId, data._file);
            }
            await loadBylaws();
            setGradeScalesTarget(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setFormIsLoading(false);
        }
    };

    const handleDelete = (bylaw) => {
        setDeleteTarget(bylaw);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteBylaw(deleteTarget.baylawId);
            await loadBylaws();
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedRowIds.map((id) => deleteBylaw(id)));
            setSelectedRowIds([]);
            setIsDeleteSelectedOpen(false);
            await loadBylaws();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleActive = async (bylaw) => {
        try {
            await toggleBylawActive(bylaw.baylawId);
            await loadBylaws();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUploadDocument = async (bylaw, file) => {
        try {
            await uploadBylawDocument(bylaw.baylawId, file);
            setUploadTarget(null);
            await loadBylaws();
        } catch (err) {
            setError(err.message);
        }
    };

    const tableRows = paginatedBylaws.map(buildRow);

    return (
        <div className="space-y-6">
            <PageHeader title="Manage Bylaws" subtitle="Administer academic bylaws, grade scales, and documents">
                <Button variant="primary" onClick={() => { setEditingBylaw(null); setIsFormOpen(true); }}>
                    <PlusIcon size={24} />
                    Add Bylaw
                </Button>
            </PageHeader>

            {error && (
                <div className="bg-bg-status-error-light dark:bg-bg-status-error-dark text-text-status-error-light dark:text-text-status-error-dark p-4 rounded-lg">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <Section>
                <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                    <h2 className="text-xl font-semibold">
                        Bylaws{" "}
                        <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            ({filteredBylaws.length})
                        </span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <SearchBar
                            placeholder="Search bylaws..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                        {selectedRowIds.length > 0 && (
                            <Button variant="danger" onClick={() => setIsDeleteSelectedOpen(true)}>
                                <TrashIcon size={20} />
                                Delete ({selectedRowIds.length})
                            </Button>
                        )}
                    </div>
                </div>

                <Dialog
                    isOpen={isDeleteSelectedOpen}
                    variant="warning"
                    title="Delete Selected Bylaws"
                    onClose={() => setIsDeleteSelectedOpen(false)}
                    onConfirm={() => { handleDeleteSelected(); return true; }}
                    confirmText="Yes, Delete"
                    cancelText="No, Keep"
                    showCloseButton={true}
                >
                    Are you sure you want to delete {selectedRowIds.length} selected bylaw{selectedRowIds.length > 1 ? "s" : ""}? Students assigned to these bylaws will have their bylaw reference removed.
                </Dialog>

                {isLoading ? (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading bylaws...</p>
                ) : filteredBylaws.length === 0 ? (
                    <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">No bylaws found.</p>
                ) : (
                    <>
                        <div className="mb-6">
                            <Table
                                role="bylaw"
                                headers={tableHeaders}
                                data={tableRows}
                                wrapInSection={false}
                                showHeaderActions={false}
                                showPagination={false}
                                selectedRows={selectedIndices}
                                onSelectionChange={(indices) => {
                                    const visibleIds = new Set(paginatedBylaws.map(b => b.baylawId).filter(Boolean));
                                    setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedBylaws[i]?.baylawId).filter(Boolean)]);
                                }}
                                actions={(row) => ([
                                    { label: "Edit", onClick: () => { setEditingBylaw(row._raw); setIsFormOpen(true); } },
                                    { label: "Grades", onClick: () => setGradeScalesTarget(row._raw) },
                                    { label: "Toggle Active", onClick: () => handleToggleActive(row._raw) },
                                    { label: "Delete", onClick: () => setDeleteTarget(row._raw) },
                                ])}
                            />
                        </div>

                        {totalPages > 1 && (
                            <Section>
                                <PaginationButtons
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                />
                            </Section>
                        )}
                    </>
                )}

                {isFormOpen && (
                    <BylawForm
                        onClose={() => {
                            setIsFormOpen(false);
                            setEditingBylaw(null);
                        }}
                        onSubmit={handleFormSubmit}
                        initialData={editingBylaw || {}}
                        isLoading={formIsLoading}
                    />
                )}

                {gradeScalesTarget && (
                    <BylawForm
                        onClose={() => setGradeScalesTarget(null)}
                        onSubmit={handleGradeScalesSubmit}
                        initialData={gradeScalesTarget}
                        isLoading={formIsLoading}
                    />
                )}

                <Dialog
                    isOpen={!!deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    title="Delete Bylaw"
                    variant="error"
                    onConfirm={confirmDelete}
                    confirmText="Delete"
                    cancelText="Cancel"
                    showCloseButton={true}
                >
                    Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Students assigned to this bylaw will have their bylaw reference removed.
                </Dialog>

                {uploadTarget && (
                    <Dialog
                        isOpen={!!uploadTarget}
                        onClose={() => setUploadTarget(null)}
                        title="Upload Bylaw Document"
                        variant="info"
                        onConfirm={() => {
                            const file = fileInputRef.current?.files?.[0];
                            if (file) {
                                handleUploadDocument(uploadTarget, file);
                                return true;
                            }
                            return false;
                        }}
                        confirmText="Upload"
                        cancelText="Cancel"
                        showCloseButton={true}
                    >
                        <div className="space-y-4">
                            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                Upload a document for <strong>{uploadTarget.name}</strong>
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-bg-surface-accent-default-light dark:file:bg-bg-surface-accent-default-dark file:text-text-accent-active-light dark:file:text-text-accent-active-dark hover:file:bg-bg-surface-accent-hover-light dark:hover:file:bg-bg-surface-accent-hover-dark"
                            />
                        </div>
                    </Dialog>
                )}
            </Section>
        </div>
    );
}
