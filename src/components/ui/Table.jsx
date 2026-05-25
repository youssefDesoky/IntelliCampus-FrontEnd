import { useState, useEffect } from "react";
import Section from "./Section";
import PaginationButtons from "./PaginationButtons";
import BaseComponent from "./BaseComponent";
import { TableHeader, TableHeaderActions, TableBody } from "./table";


export default function Table({ role, headers, data, onDelete, onDeleteSelected, onEdit, actions, roleLabel, wrapInSection = true, showHeaderActions = true, showPagination = true, totalPages = 1, paginationSummary, onSelectionChange, showSelectionColumn = true, showActionsColumn = true, grouped = false, title, description, componentButton, displayRowLimit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (onSelectionChange) onSelectionChange(selectedRows);
    }, [selectedRows, onSelectionChange]);

    const rawData = data || [];
    const hasPagingLimit = typeof displayRowLimit === 'number' && displayRowLimit > 0;
    const computedTotalPages = hasPagingLimit ? Math.max(1, Math.ceil(rawData.length / displayRowLimit)) : totalPages || 1;
    const displayData = hasPagingLimit ? rawData.slice((currentPage - 1) * displayRowLimit, currentPage * displayRowLimit) : rawData;

    const content = (
        <>
            {showHeaderActions && (
                <TableHeaderActions 
                    role={role}
                    roleLabel={roleLabel}
                    selectedRows={selectedRows}
                    onDeleteSelected={onDeleteSelected}
                />
            )}

            {grouped ? (
                <BaseComponent
                    title={title}
                    description={description}
                    componentButton={componentButton}
                    contentClassName="flex flex-col gap-4 overflow-x-auto"
                >
                    <table className="min-w-full table-auto border-separate border-spacing-0">
                    <TableHeader 
                        headerData={headers}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                        showSelectionColumn={showSelectionColumn}
                        showActionsColumn={showActionsColumn}
                    />

                    <TableBody
                        role={role}
                        rowData={displayData} 
                        columnCount={headers.length}
                        selectAll={selectAll} 
                        setSelectAll={setSelectAll} 
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        actions={actions}
                        showSelectionColumn={showSelectionColumn}
                        showActionsColumn={showActionsColumn}
                    />
                </table>

                {(showPagination || paginationSummary || (hasPagingLimit && rawData.length > displayRowLimit)) && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-3 pt-3">
                        <div className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {(hasPagingLimit && rawData.length > displayRowLimit)
                                ? `Showing first ${displayRowLimit} of ${rawData.length} rows`
                                : paginationSummary || ""}
                        </div>

                        {showPagination && (
                            <PaginationButtons 
                                totalPages={computedTotalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                )}
                </BaseComponent>
            ) : (
                <div className="flex flex-col gap-4 overflow-x-auto">
                    <table className={`min-w-full table-auto border-separate border-spacing-0 border border-border-primary-default-light dark:border-border-primary-default-dark`}>
                    <TableHeader 
                        headerData={headers}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                        showSelectionColumn={showSelectionColumn}
                        showActionsColumn={showActionsColumn}
                    />

                    <TableBody
                        role={role}
                        rowData={displayData} 
                        columnCount={headers.length}
                        selectAll={selectAll} 
                        setSelectAll={setSelectAll} 
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        actions={actions}
                        showSelectionColumn={showSelectionColumn}
                        showActionsColumn={showActionsColumn}
                    />
                </table>

                {(showPagination || paginationSummary || (hasPagingLimit && rawData.length > displayRowLimit)) && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-3 pt-3">
                        <div className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                            {(hasPagingLimit && rawData.length > displayRowLimit)
                                ? `Showing first ${displayRowLimit} of ${rawData.length} rows`
                                : paginationSummary || ""}
                        </div>

                        {showPagination && (
                            <PaginationButtons 
                                totalPages={computedTotalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                )}
                </div>
            )}
        </>
    );

    return wrapInSection ? <Section>{content}</Section> : content;
}