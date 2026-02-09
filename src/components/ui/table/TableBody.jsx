import { useEffect, useState, useRef, useCallback } from "react";
import DropdownMenu from "../DropdownMenu";
import { EllipsisVerticalIcon } from "../icons";
import Dialog from "../Dialog";
import AdminForm from "../../../feature/admin/components/AdminForm";
import InstructorForm from "../../../feature/admin/components/InstructorForm";
import StudentForm from "../../../feature/admin/components/StudentForm";

const buttonStyle = "w-full text-left px-3 py-2 rounded hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark ";

export default function TableBody({ role, rowData, columnCount, selectAll, setSelectAll, selectedRows, setSelectedRows, onDelete, onEdit, actions }) {
    const [editingRow, setEditingRow] = useState(null);
    const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
    const [actionButtonClicked, setActionButtonClicked] = useState(null);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const buttonRefs = useRef({});

    useEffect(() => {
        if (selectAll) {
            setSelectedRows(prev => prev.length === rowData.length ? prev : rowData.map((_, index) => index));
        } else if (selectedRows.length === rowData.length && rowData.length > 0) {
            setSelectedRows([]);
        }
    }, [selectAll]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.action-dropdown') && !event.target.closest('.action-btn')) {
                setActionButtonClicked(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleCheckboxChange = (index) => {
        if (selectedRows.includes(index)) {
            setSelectedRows(selectedRows.filter(i => i !== index));
            setSelectAll(false);
        } else {
            const newSelectedRows = [...selectedRows, index];
            setSelectedRows(newSelectedRows);
            if (newSelectedRows.length === rowData.length) {
                setSelectAll(true);
            }
        }
    };

    const handleActionClick = useCallback((e, rowIndex) => {
        e.stopPropagation();
        if (rowIndex === actionButtonClicked) {
            setActionButtonClicked(null);
            return;
        }
        const buttonEl = buttonRefs.current[rowIndex];
        if (buttonEl) {
            const rect = buttonEl.getBoundingClientRect();
            setDropdownStyle({
                top: rect.bottom + 8,
                left: rect.left + rect.width / 2,
                transform: 'translateX(-50%)',
            });
        }
        setActionButtonClicked(rowIndex);
    }, [actionButtonClicked]);


    const handleEditClick = useCallback((rowIndex) => {
        setEditingRow({ index: rowIndex, data: rowData[rowIndex] });
        setActionButtonClicked(null);
    }, [rowData]);

    const handleDeleteClick = useCallback((rowIndex) => {
        setDeleteButtonClicked(rowIndex);
        setActionButtonClicked(null);
    }, []);

    const getEditComponent = () => {
        if (editingRow === null) return null;

        const commonProps = {
            initialData: editingRow.data,
            onClose: () => setEditingRow(null),
            onSubmit: (data) => {
                if (onEdit) onEdit(editingRow.index, data);
                setEditingRow(null);
            },
        };

        switch (role) {
            case "admin":
                return <AdminForm {...commonProps} method="put" />;
            case "instructor":
                return <InstructorForm {...commonProps} method="put" />;
            case "student":
                return <StudentForm {...commonProps} method="put" />;
            default:
                return null;
        }
    };

    return (
    <>
        <tbody>
            {rowData.map((row, rowIndex) => (
                <tr
                    key={rowIndex}
                    className="text-center hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark 
                        divide-x divide-border-primary-default-light dark:divide-border-primary-default-dark hover:divide-border-primary-hover-light dark:hover:divide-border-primary-hover-dark                
                        border border-border-primary-default-light dark:border-border-primary-default-dark hover:border-border-primary-hover-light dark:hover:border-border-primary-hover-dark
                    "
                    onClick={() => handleCheckboxChange(rowIndex)}
                    style={{ backgroundColor: selectedRows.includes(rowIndex) ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
                >
                    <td className="p-3">
                        <input 
                            type="checkbox" 
                            checked={selectedRows.includes(rowIndex)}
                            onChange={() => handleCheckboxChange(rowIndex)}
                        />
                    </td>

                    {Object.values(row).slice(0, columnCount).map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-3">
                            {cell}
                        </td>
                    ))}
                    
                    <td className="p-3">
                        <button
                            ref={(el) => (buttonRefs.current[rowIndex] = el)}
                            onClick={(e) => handleActionClick(e, rowIndex)}
                            className="action-btn p-2 rounded-full hover:bg-bg-fill-tertiary-hover-light dark:hover:bg-bg-fill-tertiary-hover-dark"
                        >
                            <EllipsisVerticalIcon size={24} className="rotate-90" />
                        </button>
                    </td>
                </tr>
            ))}

            {actionButtonClicked !== null && 
                <DropdownMenu 
                    direction="bottom" 
                    position="middle" 
                    portal={true}
                    style={dropdownStyle}
                    className="action-dropdown"
                >
                    {actions ? (
                        actions(rowData[actionButtonClicked], actionButtonClicked).map((action, i) => (
                            <button
                                key={i}
                                className={`${buttonStyle} ${action.className || ""}`}
                                onClick={() => {
                                    action.onClick();
                                    setActionButtonClicked(null);
                                }}
                            >
                                {action.label}
                            </button>
                        ))
                    ) : (
                        <>
                            <button className={`${buttonStyle} text-text-primary-default-light dark:text-text-primary-default-dark hover:text-text-primary-hover-light dark:hover:text-text-primary-hover-dark`}>
                                View Details
                            </button>
                            <button 
                                className={`${buttonStyle} text-text-primary-default-light dark:text-text-primary-default-dark hover:text-text-primary-hover-light dark:hover:text-text-primary-hover-dark`}
                                onClick={() => handleEditClick(actionButtonClicked)}
                            >
                                Edit
                            </button>
                            <button 
                                className={`${buttonStyle} text-text-danger-default-light dark:text-text-danger-default-dark hover:text-text-danger-hover-light dark:hover:text-text-danger-hover-dark`}
                                onClick={() => handleDeleteClick(actionButtonClicked)}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </DropdownMenu>
            }
        </tbody>    

        {!actions && deleteButtonClicked !== false && (
            <Dialog
                isOpen={deleteButtonClicked !== false}
                variant="error"
                title={`Delete ${role === "admin" ? "Admin" : role === "student" ? "Student" : "Instructor"}`}
                onClose={() => setDeleteButtonClicked(false)}
                onConfirm={() => {
                    if (onDelete) {
                        onDelete(deleteButtonClicked);
                    } else {
                        console.log(`Deleting ${role} at index:`, deleteButtonClicked);
                    }
                    setDeleteButtonClicked(false);
                    return true;
                }}
                confirmText="Delete"
                cancelText="Cancel"
                showCloseButton={true}
            >
                Are you sure you want to delete this {role === "admin" ? "Admin" : role === "student" ? "Student" : "Instructor"}? This action cannot be undone.
            </Dialog>
        )}

        {!actions && editingRow !== null && getEditComponent()}
    </>    
    );
}