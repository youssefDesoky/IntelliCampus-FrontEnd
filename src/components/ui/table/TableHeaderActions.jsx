import { useState } from 'react';
import { TrashIcon } from '../icons';
import Button from '../../ui/Button';
import SearchBar from '../../ui/SearchBar';
import Dialog from '../../ui/Dialog';

export default function TableHeaderActions({ role, selectedRows, onDeleteSelected }) {
    const [DeleteSelected, setDeleteSelected] = useState(false);

    return (
        <div className="flex items-center justify-between gap-8 mb-4">
            <h2 className="text-xl font-semibold">{role === 'student' ? 'Students' : role === 'admin' ? 'Admins' : 'Instructors'}</h2>
            <div className="flex items-center gap-2">
                <SearchBar placeholder={`Search ${role === 'student' ? 'Students' : role === 'admin' ? 'Admins' : 'Instructors'}...`} />
                
                {selectedRows.length > 0 && (
                    <Button 
                        variant="danger"
                        onClick={() => setDeleteSelected(true)}
                    >
                        <TrashIcon size={20} />
                        Delete
                    </Button>
                )}
            </div>

            <Dialog 
                isOpen={DeleteSelected} 
                variant="warning"
                confirmText="Yes, Delete"
                cancelText="No, Keep"
                onConfirm={() => {
                    if (onDeleteSelected) {
                        onDeleteSelected(selectedRows);
                    }
                    setDeleteSelected(false);
                }}
                onClose={() => setDeleteSelected(false)}
            >
                Are you sure you want to delete {selectedRows.length} selected {
                    role === 'student' ? selectedRows.length > 1 ? 'students' : 'student' : 
                    role === 'admin' ? selectedRows.length > 1 ? 'admins' : 'admin' : 
                    selectedRows.length > 1 ? 'instructors' : 'instructor'
                }
                ? This action cannot be undone.
            </Dialog>
        </div>
    );
}