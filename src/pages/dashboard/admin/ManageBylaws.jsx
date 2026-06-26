import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ManageEntity from "../../../components/ui/ManageEntity";
import Dialog from "../../../components/ui/Dialog";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import BylawForm from "../../../feature/admin/components/BylawForm";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import { API_URL } from "../../../config/api";
import {
  CheckIcon,
  DownloadIcon,
  XIcon,
} from "../../../components/ui/icons";
import {
  fetchBylaws,
  createBylaw,
  updateBylaw,
  deleteBylaw,
  toggleBylawActive,
  uploadBylawDocument,
} from "../../../feature/admin/services/adminBylawsApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

const tableHeaders = ["Bylaw", "Description", "Type", "Status", "Students", "Document"];

export default function ManageBylaws() {
  const navigate = useNavigate();
  const { showError } = useError();
  const [uploadTarget, setUploadTarget] = useState(null);
  const [documentPreviewTarget, setDocumentPreviewTarget] = useState(null);
  const fileInputRef = useRef(null);

  const handleDocumentPreview = useCallback((bylaw) => {
    setDocumentPreviewTarget(bylaw);
  }, []);

  const buildBylawRow = useCallback((bylaw) => ({
    bylaw: <p className="font-medium">{bylaw.name}</p>,
    description: bylaw.description ? (
      <span className="truncate max-w-xs" title={bylaw.description}>{bylaw.description}</span>
    ) : "—",
    type: <span className="text-sm font-medium">{bylaw.type}</span>,
    status: (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bylaw.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
        {bylaw.isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
        {bylaw.isActive ? "Active" : "Inactive"}
      </span>
    ),
    students: bylaw.studentCount ?? 0,
    document: bylaw.fileName ? (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handleDocumentPreview(bylaw); }}
        className="truncate max-w-[120px] block mx-auto text-center hover:text-text-accent-default-light dark:hover:text-text-accent-default-dark transition-colors"
        title={bylaw.fileName}
      >
        {bylaw.fileName}
      </button>
    ) : "—",
  }), [handleDocumentPreview]);

  const createBylawWithDoc = useCallback(async (formData) => {
    const { _file, ...bylawData } = formData;
    const created = await createBylaw(bylawData);
    if (_file && created?.bylawId) {
      await uploadBylawDocument(created.bylawId, _file);
    }
  }, []);

  const updateBylawWithDoc = useCallback(async (id, formData) => {
    const { _file, ...bylawData } = formData;
    const updated = await updateBylaw(id, bylawData);
    if (_file && updated?.bylawId) {
      await uploadBylawDocument(updated.bylawId, _file);
    }
  }, []);

  return (
    <ManageEntity
      entityName="Bylaw"
      entityNamePlural="Bylaws"
      entityIdField={(item) => item.bylawId ?? item.id}
      fetchItems={fetchBylaws}
      createItem={createBylawWithDoc}
      updateItem={updateBylawWithDoc}
      deleteItem={deleteBylaw}
      headerTitle="Manage Bylaws"
      headerSubtitle="Administer academic bylaws, grade scales, and documents"
      headerAddLabel="Add Bylaw"
      searchPlaceholder="Search bylaws..."
      searchFilter={(item, q) =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.fileName?.toLowerCase().includes(q)
      }
      tableRole="bylaw"
      tableHeaders={tableHeaders}
      columnAlignments={["text-left", "text-left", "text-center", "text-center", "text-center", "text-center"]}
      buildRow={(item) => buildBylawRow(item)}
      rowActions={(item, { onEdit, onDelete, loadItems }) => [
        { label: "Edit", onClick: () => onEdit(item) },
        {
          label: "Manage Bylaw",
          onClick: () => navigate(`/admin/bylaws/${item.bylawId}`),
        },
        {
          label: "Toggle Active",
          onClick: async () => {
            try {
              await toggleBylawActive(item.bylawId);
              await loadItems();
            } catch (err) {
              showError(err.message);
            }
          },
        },
        { label: "Delete", onClick: () => onDelete(item) },
      ]}
      getDeleteMessage={(item) => (
        <>Are you sure you want to delete <strong>{item?.name}</strong>? Students assigned to this bylaw will have their bylaw reference removed.</>
      )}
      getDeleteSelectedMessage={(count) =>
        `Are you sure you want to delete ${count} selected bylaw${count > 1 ? "s" : ""}? Students assigned to these bylaws will have their bylaw reference removed.`
      }
      renderForm={({ isFormOpen, editingItem, closeForm, handleFormSubmit, formIsLoading }) =>
        isFormOpen && (
          <BylawForm
            onClose={closeForm}
            onSubmit={handleFormSubmit}
            initialData={editingItem || {}}
            isLoading={formIsLoading}
          />
        )
      }
      renderExtraDialogs={({ loadItems }) => (
        <>
          {documentPreviewTarget && (
            <ModelOverlay onClose={() => setDocumentPreviewTarget(null)} maxWidth="max-w-5xl">
              <div className="w-full overflow-hidden rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-xl">
                <div className="flex items-center justify-between border-b border-border-primary-default-light dark:border-border-primary-default-dark px-5 py-4">
                  <div>
                    <h4 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                      {documentPreviewTarget.fileName || "Document Preview"}
                    </h4>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">Policy document preview</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId}/download`}
                      download
                      className="inline-flex items-center gap-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark px-3.5 py-2 text-xs font-semibold text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                    >
                      <DownloadIcon size={14} />
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => setDocumentPreviewTarget(null)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark text-text-secondary-default-light dark:text-text-secondary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark transition-colors"
                      aria-label="Close bylaw preview"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                </div>
                <MaterialPreview
                  type={0}
                  title={documentPreviewTarget.fileName || "document"}
                  viewUrl={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId}/view`}
                  downloadUrl={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId}/download`}
                />
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
                  uploadBylawDocument(uploadTarget.bylawId, file).then(() => {
                    setUploadTarget(null);
                    loadItems();
                  });
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
        </>
      )}
    />
  );
}
