import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import UserHeader from "./UserHeader";
import PageHeader from "./PageHeader";
import Section from "./Section";
import SearchBar from "./SearchBar";
import Button from "./Button";
import Dialog from "./Dialog";
import Table from "./Table";
import { TrashIcon, PlusIcon } from "./icons";
import useDeviceType from "../../hooks/useDeviceType";

export default function ManageEntity({
  entityName,
  entityNamePlural,
  entityIdField = "id",
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  headerType = "page",
  headerRole,
  onImportComplete,
  headerTitle,
  headerSubtitle,
  headerAddLabel,
  searchPlaceholder,
  searchFilter,
  tableRole,
  tableRoleLabel,
  tableHeaders,
  columnAlignments,
  buildRow,
  rowActions,
  showSelectionColumn = true,
  onPreview,
  renderForm,
  renderHeaderActions,
  getDeleteMessage,
  getDeleteSelectedTitle,
  getDeleteSelectedMessage,
  renderFilters,
  renderExtraDialogs,
  renderBeforeTable,
  extraDeps = [],
}) {
  const { isDesktop, isTablet, isPhone } = useDeviceType();
  const isSm = !isPhone;

  const [rawItems, setRawItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableContainerRef = useRef(null);

  const getId = useMemo(
    () => (typeof entityIdField === "function" ? entityIdField : (item) => item?.[entityIdField]),
    [entityIdField]
  );
  const pluralLower = entityNamePlural.toLowerCase();

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (!tableContainerRef.current) return;
      const rect = tableContainerRef.current.getBoundingClientRect();
      const bottomPaddingOffset = isPhone ? 60 : isTablet ? 30 : 0;
      const availableHeight = window.innerHeight - rect.top - bottomPaddingOffset;
      setItemsPerPage(Math.max(3, Math.floor(availableHeight / 65)));
    };
    const timer = setTimeout(calculateItemsPerPage, 50);
    window.addEventListener("resize", calculateItemsPerPage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateItemsPerPage);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawItems.length, isPhone, isTablet, ...extraDeps]);

  const loadItems = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchItems();
      setRawItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Failed to load ${pluralLower}:`, err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchItems, pluralLower]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const filteredItems = useMemo(() => {
    const q = (searchQuery || "").toLowerCase();
    return rawItems.filter((item) => searchFilter(item, q));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawItems, searchQuery, searchFilter, ...extraDeps]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedItems = useMemo(() =>
    filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredItems, currentPage, itemsPerPage]
  );

  const resolvedHeaders = useMemo(() => {
    if (Array.isArray(tableHeaders)) return tableHeaders;
    if (tableHeaders) {
      if (isDesktop) return tableHeaders.desktop;
      if (isTablet) return tableHeaders.tablet;
      return tableHeaders.phone;
    }
    return [];
  }, [tableHeaders, isDesktop, isTablet]);

  const resolvedAlignments = useMemo(() => {
    if (Array.isArray(columnAlignments)) return columnAlignments;
    if (columnAlignments) {
      if (isDesktop) return columnAlignments.desktop;
      if (isTablet) return columnAlignments.tablet;
      return columnAlignments.phone;
    }
    return [];
  }, [columnAlignments, isDesktop, isTablet]);

  const tableRows = useMemo(() =>
    paginatedItems.map(item => {
      const row = buildRow(item, { isDesktop, isTablet });
      if (!row._id) row._id = getId(item);
      if (!row._raw) row._raw = item;
      return row;
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginatedItems, buildRow, isDesktop, isTablet, getId, ...extraDeps]
  );

  const selectedIndices = useMemo(() =>
    tableRows.map((row, i) => selectedRowIds.includes(row._id) ? i : -1).filter(i => i !== -1),
    [tableRows, selectedRowIds]
  );

  const handleCreate = useCallback(async (formData) => {
    try {
      await createItem(formData);
      setIsFormOpen(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      console.error(`Failed to create ${entityName.toLowerCase()}:`, err);
    }
  }, [createItem, loadItems, entityName]);

  const handleUpdate = useCallback(async (formData) => {
    if (!updateItem || !editingItem) return;
    try {
      await updateItem(getId(editingItem), formData);
      setIsFormOpen(false);
      setEditingItem(null);
      await loadItems();
    } catch (err) {
      console.error(`Failed to update ${entityName.toLowerCase()}:`, err);
    }
  }, [updateItem, editingItem, getId, loadItems, entityName]);

  const handleFormSubmit = useCallback(async (formData) => {
    setFormIsLoading(true);
    try {
      if (getId(editingItem) && updateItem) {
        await handleUpdate(formData);
      } else {
        await handleCreate(formData);
      }
    } finally {
      setFormIsLoading(false);
    }
  }, [editingItem, getId, updateItem, handleUpdate, handleCreate]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(getId(deleteTarget));
      await loadItems();
    } catch (err) {
      console.error(`Failed to delete ${entityName.toLowerCase()}:`, err);
    }
    setDeleteTarget(null);
  }, [deleteTarget, getId, deleteItem, loadItems, entityName]);

  const handleDeleteSelected = useCallback(async () => {
    for (const id of selectedRowIds) {
      try { await deleteItem(id); } catch (err) { console.error(err); }
    }
    setSelectedRowIds([]);
    setIsDeleteSelectedOpen(false);
    await loadItems();
  }, [selectedRowIds, deleteItem, loadItems]);

  const openForm = useCallback((item = null) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(null);
  }, []);

  const formHelpers = {
    isFormOpen, editingItem, openForm, closeForm,
    handleCreate, handleUpdate, handleFormSubmit,
    formIsLoading, setFormIsLoading, loadItems, rawItems,
  };

  const filterHelpers = { filteredItems, setCurrentPage, selectedRowIds, rawItems };
  const dialogHelpers = {
    editingItem, isFormOpen, deleteTarget, setDeleteTarget,
    openForm, closeForm, loadItems,
    selectedRowIds, setSelectedRowIds, rawItems, filteredItems,
  };

  const actionsHelpers = { onEdit: openForm, onDelete: setDeleteTarget, loadItems };

  return (
    <>
      {headerType === "user" ? (
        <UserHeader
          role={headerRole}
          setIsUserFormOpen={setIsFormOpen}
          onImportComplete={onImportComplete}
        />
      ) : renderHeaderActions ? (
        <PageHeader title={headerTitle} subtitle={headerSubtitle}>
          {renderHeaderActions({ openForm })}
        </PageHeader>
      ) : (
        <PageHeader title={headerTitle} subtitle={headerSubtitle}>
          <Button variant="primary" onClick={() => openForm(null)}>
            <PlusIcon size={24} />
            {headerAddLabel || `Add ${entityName}`}
          </Button>
        </PageHeader>
      )}

      {error && (
        <div className="bg-bg-status-error-light dark:bg-bg-status-error-dark text-text-status-error-light dark:text-text-status-error-dark p-4 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">
          Loading {pluralLower}...
        </p>
      ) : (
        <Section>
          <div className="flex flex-col gap-4 mb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between gap-3 sm:contents">
                <h2 className="text-xl font-semibold whitespace-nowrap shrink-0">
                  {entityNamePlural}{" "}
                  <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    ({filteredItems.length})
                  </span>
                </h2>
                <div className="flex-1 min-w-0 sm:hidden">
                  <SearchBar
                    placeholder={searchPlaceholder || `Search ${pluralLower}...`}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="hidden sm:block sm:w-auto sm:flex-1">
                  <SearchBar
                    placeholder={searchPlaceholder || `Search ${pluralLower}...`}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                {renderFilters?.(filterHelpers)}
                {selectedRowIds.length > 0 && (
                  <Button variant="danger" onClick={() => setIsDeleteSelectedOpen(true)} className="px-2 sm:px-4" size="sm">
                    <TrashIcon size={18} />
                    <span className="hidden sm:inline">Delete ({selectedRowIds.length})</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Dialog
            isOpen={isDeleteSelectedOpen}
            variant="warning"
            title={getDeleteSelectedTitle || `Delete Selected ${entityNamePlural}`}
            onClose={() => setIsDeleteSelectedOpen(false)}
            onConfirm={() => { handleDeleteSelected(); return true; }}
            confirmText="Yes, Delete"
            cancelText="No, Keep"
            showCloseButton={true}
          >
            {getDeleteSelectedMessage
              ? getDeleteSelectedMessage(selectedRowIds.length)
              : `Are you sure you want to delete ${selectedRowIds.length} selected ${entityName.toLowerCase()}${selectedRowIds.length > 1 ? "s" : ""}? This action cannot be undone.`
            }
          </Dialog>

          {renderBeforeTable?.(filterHelpers)}

          {paginatedItems.length > 0 ? (
            <div className="mb-6" ref={tableContainerRef}>
              <Table
                role={tableRole}
                roleLabel={tableRoleLabel}
                headers={resolvedHeaders}
                data={tableRows}
                columnAlignments={resolvedAlignments}
                wrapInSection={false}
                showHeaderActions={false}
                showPagination={false}
                showSelectionColumn={showSelectionColumn}
                selectedRows={selectedIndices}
                page={currentPage}
                onPageChange={setCurrentPage}
                totalPages={totalPages}
                totalItems={isSm ? filteredItems.length : undefined}
                itemsLabel={entityNamePlural}
                from={isSm ? (currentPage - 1) * itemsPerPage + 1 : undefined}
                to={isSm ? Math.min(currentPage * itemsPerPage, filteredItems.length) : undefined}
                onSelectionChange={(indices) => {
                  const visibleIds = new Set(tableRows.map(r => r._id).filter(Boolean));
                  setSelectedRowIds([
                    ...selectedRowIds.filter(id => !visibleIds.has(id)),
                    ...indices.map(i => tableRows[i]?._id).filter(Boolean),
                  ]);
                }}
                onDelete={(rowIndex) => {
                  const row = tableRows[rowIndex];
                  if (row?._raw) setDeleteTarget(row._raw);
                }}
                onPreview={(rowData) => onPreview?.(rowData._raw || rowData)}
                actions={(rowData) => rowActions(rowData._raw, actionsHelpers)}
              />
            </div>
          ) : (
            <p className="text-center py-12 text-text-secondary-default-light dark:text-text-secondary-default-dark">
              No {pluralLower} found.
            </p>
          )}

        </Section>
      )}

      {renderForm?.(formHelpers)}

      <Dialog
        isOpen={deleteTarget !== null}
        variant="error"
        title={`Delete ${entityName}`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { handleDeleteConfirm(); return true; }}
        confirmText="Delete"
        cancelText="Cancel"
        showCloseButton={true}
      >
        {getDeleteMessage
          ? getDeleteMessage(deleteTarget)
          : `Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`
        }
      </Dialog>

      {renderExtraDialogs?.(dialogHelpers)}
    </>
  );
}
