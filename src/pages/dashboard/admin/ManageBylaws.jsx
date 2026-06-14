import { useState, useEffect, useCallback, useRef } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import BylawForm from "../../../feature/admin/components/BylawForm";
import GradeScalesForm from "../../../feature/admin/components/GradeScalesForm";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import { API_URL } from "../../../config/api";
import {
    FilePenIcon,
    TrashIcon,
    PlusIcon,
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
const tableHeaders = ["Bylaw", "Description", "Version", "Status", "Students", "Document"];

function buildRow(b, onDocClick) {
    return {
        bylaw: (
            <p className="font-medium">{b.name}</p>
        ),
        description: b.description ? (
            <span className="truncate max-w-xs" title={b.description}>{b.description}</span>
        ) : "—",
        version: `v${b.version}`,
        status: (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${b.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                {b.isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                {b.isActive ? "Active" : "Inactive"}
            </span>
        ),
        students: b.studentCount ?? 0,
        document: b.fileName ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); onDocClick(b); }} className="truncate max-w-[120px] block mx-auto text-center hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors" title={b.fileName}>
                {b.fileName}
            </button>
        ) : "—",
        _id: b.bylawId ?? b.id,
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
    const [documentPreviewTarget, setDocumentPreviewTarget] = useState(null);
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
    const selectedIndices = paginatedBylaws.map((b, i) => selectedRowIds.includes(b.bylawId ?? b.id) ? i : -1).filter(i => i !== -1);

    const handleEdit = (bylaw) => {
        setEditingBylaw(bylaw);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setFormIsLoading(true);
            const { _file, ...bylawData } = data;
            const created = await createBylaw(bylawData);
            if (_file && created?.bylawId) {
                await uploadBylawDocument(created.bylawId, _file);
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
            await setBylawGradeScales(gradeScalesTarget.bylawId, data.gradeScales);
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
            await deleteBylaw(deleteTarget.bylawId);
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
            await toggleBylawActive(bylaw.bylawId);
            await loadBylaws();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUploadDocument = async (bylaw, file) => {
        try {
            await uploadBylawDocument(bylaw.bylawId, file);
            setUploadTarget(null);
            await loadBylaws();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDocumentPreview = useCallback((bylaw) => {
        setDocumentPreviewTarget(bylaw);
    }, []);

    const tableRows = paginatedBylaws.map((b) => buildRow(b, handleDocumentPreview));

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
                <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
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
                    <div className="mb-6">
                        <Table
                            role="bylaw"
                            headers={tableHeaders}
                            data={tableRows}
                            wrapInSection={false}
                            showHeaderActions={false}
                            showPagination={false}
                            selectedRows={selectedIndices}
                            page={currentPage}
                            onPageChange={setCurrentPage}
                            totalPages={totalPages}
                            totalItems={filteredBylaws.length}
                            itemsLabel="Bylaws"
                            from={(currentPage - 1) * ITEMS_PER_PAGE + 1}
                            to={Math.min(currentPage * ITEMS_PER_PAGE, filteredBylaws.length)}
                            onSelectionChange={(indices) => {
                                const visibleIds = new Set(paginatedBylaws.map(b => b.bylawId).filter(Boolean));
                                setSelectedRowIds(prev => [...prev.filter(id => !visibleIds.has(id)), ...indices.map(i => paginatedBylaws[i]?.bylawId).filter(Boolean)]);
                            }}
                            actions={(row) => ([
                                { label: "Edit", onClick: () => { setEditingBylaw(row._raw); setIsFormOpen(true); } },
                                { label: "Grades", onClick: () => setGradeScalesTarget(row._raw) },
                                { label: "Toggle Active", onClick: () => handleToggleActive(row._raw) },
                                { label: "Delete", onClick: () => setDeleteTarget(row._raw) },
                            ])}
                        />
                    </div>
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
                    <GradeScalesForm
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

                {documentPreviewTarget && (
                    <ModelOverlay onClose={() => setDocumentPreviewTarget(null)} maxWidth="max-w-5xl">
                        <div className="relative z-50 w-full rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)]">
                            <div className="flex items-center justify-between gap-4 border-b border-border-primary-default-light px-6 py-4 dark:border-border-primary-default-dark">
                                <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                    {documentPreviewTarget.fileName || "Document Preview"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setDocumentPreviewTarget(null)}
                                    className="rounded-lg border border-border-primary-default-light bg-bg-surface-secondary-default-light p-2 text-icon-secondary-default-light transition-colors hover:bg-bg-surface-secondary-hover-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-icon-secondary-default-dark dark:hover:bg-bg-surface-secondary-hover-dark"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                        <path d="M18.3 5.71 12 12.01l-6.29-6.3-1.42 1.42 6.3 6.29-6.3 6.29 1.42 1.42 6.29-6.3 6.29 6.3 1.42-1.42-6.3-6.29 6.3-6.29z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <MaterialPreview
                                    type={0}
                                    title={documentPreviewTarget.fileName || "document"}
                                    viewUrl={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId}/download`}
                                    downloadUrl={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId}/download`}
                                />
                            </div>
                        </div>
                    </ModelOverlay>
                )}

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
