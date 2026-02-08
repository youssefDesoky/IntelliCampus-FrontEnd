import { useState } from "react";
import Section from "./Section";
import PaginationButtons from "./PaginationButtons";
import { TableHeader, TableHeaderActions, TableBody } from "./table";


export default function Table({ role, headers, data, onDelete, onDeleteSelected, onEdit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    return (
        <Section>
            <TableHeaderActions 
                role={role} 
                selectedRows={selectedRows}
                onDeleteSelected={onDeleteSelected}
            />

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
                    />
                </table>

                <PaginationButtons 
                    totalPages={1}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </Section>
    );
}