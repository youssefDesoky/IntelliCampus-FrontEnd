import { useState, useEffect } from "react";
import Section from "./Section";
import PaginationButtons from "./PaginationButtons";
import { TableHeader, TableHeaderActions, TableBody } from "./table";


export default function Table({ role, headers, data, onDelete, onDeleteSelected, onEdit, actions, roleLabel, wrapInSection = true, showHeaderActions = true, showPagination = true, onSelectionChange }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (onSelectionChange) onSelectionChange(selectedRows);
    }, [selectedRows, onSelectionChange]);

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

            <div className="flex flex-col gap-4 overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-border-primary-default-light dark:border-border-primary-default-dark">
                    <TableHeader 
                        headerData={headers}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                    />

                    <TableBody
                        role={role}
                        rowData={data} 
                        columnCount={headers.length}
                        selectAll={selectAll} 
                        setSelectAll={setSelectAll} 
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        actions={actions}
                    />
                </table>

                {showPagination && (
                    <PaginationButtons 
                        totalPages={1}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
        </>
    );

    return wrapInSection ? <Section>{content}</Section> : content;
}