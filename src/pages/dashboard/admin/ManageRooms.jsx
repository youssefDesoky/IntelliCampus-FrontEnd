import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import RoomForm from "../../../feature/admin/components/RoomForm";
import {
    FilePenIcon,
    TrashIcon,
    LocationDotIcon,
    UsersIcon,
    PlusIcon,
} from "../../../components/ui/icons";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 10;
const roomTableHeaders = ["Room Name", "Room Name Arabic", "Type", "Capacity", "Location"];

function buildRoomRow(room) {
    return {
        roomName: (
            <div className="flex flex-col text-left">
                <p className="font-medium">{room.name || room.roomName || "—"}</p>
                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{room.type || ""}</p>
            </div>
        ),
        roomNameAr: room.roomNameAr || room.nameAr || "—",
        type: <span className="inline-block px-2 py-1 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark text-xs font-medium">{room.type || "—"}</span>,
        capacity: `${room.capacity ?? "?"} people`,
        location: room.location || room.roomLocation || room.Location || room.RoomLocation || "—",
        _id: room.id ?? room.roomId,
        _raw: room,
    };
}

export default function ManageRooms() {
    const [isAddRoomFormOpen, setIsAddRoomFormOpen] = useState(false);
    const [rawRooms, setRawRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formIsLoading, setFormIsLoading] = useState(false);

    // Load rooms on mount
    useEffect(() => {
        const loadRooms = async () => {
            try {
                setIsLoading(true);
                const data = await fetchRooms();
                const list = Array.isArray(data) ? data : [];
                setRawRooms(list);
                setError(null);
            } catch (err) {
                setError(err.message);
                setRawRooms([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadRooms();
    }, []);

    // Search and filter
    const filteredRooms = useCallback(() => {
        const query = searchQuery.toLowerCase();
        return rawRooms.filter(room =>
            (room.name || room.roomName || "").toLowerCase().includes(query) ||
            (room.type && room.type.toLowerCase().includes(query)) ||
            (room.location && room.location.toLowerCase().includes(query))
        );
    }, [rawRooms, searchQuery])();

    // Pagination
    const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
    const paginatedRooms = filteredRooms.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const selectedIndices = paginatedRooms.map((r, i) => selectedRowIds.includes(r.id ?? r.roomId) ? i : -1).filter(i => i !== -1);

    // Edit handling
    const handleEdit = (room) => {
        setEditingRoom(room);
        setIsAddRoomFormOpen(true);
    };

    const handleDelete = (room) => {
        setDeleteTarget(room);
    };

    const handleFormSubmit = async (data) => {
        try {
            setFormIsLoading(true);
            if (editingRoom?.id ?? editingRoom?.roomId) {
                await updateRoom(editingRoom.id ?? editingRoom.roomId, data);
            } else {
                await createRoom(data);
            }
            // Reload rooms
            const updatedRooms = await fetchRooms();
            setRawRooms(Array.isArray(updatedRooms) ? updatedRooms : []);
            setEditingRoom(null);
            setIsAddRoomFormOpen(false);
        } catch (err) {
            console.error("Form submission error:", err);
            throw err;
        } finally {
            setFormIsLoading(false);
        }
    };

    // Delete handling
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deleteRoom(deleteTarget.id ?? deleteTarget.roomId);
            setRawRooms(rawRooms.filter(r => (r.id ?? r.roomId) !== (deleteTarget.id ?? deleteTarget.roomId)));
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Bulk delete
    const handleDeleteSelected = async () => {
        try {
            for (const id of selectedRowIds) {
                await deleteRoom(id);
            }
            setSelectedRowIds([]);
            setIsDeleteSelectedOpen(false);
            const updatedRooms = await fetchRooms();
            setRawRooms(Array.isArray(updatedRooms) ? updatedRooms : []);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Manage Rooms" 
                subtitle="Administer room records and facilities"
            >
                <Button 
                    variant="primary"
                    onClick={() => { setEditingRoom(null); setIsAddRoomFormOpen(true); }}
                >
                    <PlusIcon size={24} />
                    Add Room
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
                        Rooms{" "}
                        <span className="text-sm font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            ({filteredRooms.length})
                        </span>
                    </h2>
                    <div className="flex items-center gap-3">
                        <SearchBar
                            placeholder="Search rooms..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                        {selectedRowIds.length > 0 && (
                            <Button
                                variant="danger"
                                onClick={() => setIsDeleteSelectedOpen(true)}
                            >
                                <TrashIcon size={20} />
                                Delete ({selectedRowIds.length})
                            </Button>
                        )}
                    </div>
                </div>
            </Section>

            {isLoading ? (
                <Section className="text-center py-12">
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">Loading rooms...</p>
                </Section>
            ) : filteredRooms.length === 0 ? (
                <Section className="text-center py-12">
                    <p className="text-text-secondary-default-light dark:text-text-secondary-default-dark">No rooms found</p>
                </Section>
            ) : (
                <>
                    <div className="mb-6">
                        {(() => {
                            const tableRows = paginatedRooms.map(buildRoomRow);
                            return (
                                <Table
                                    role="room"
                                    headers={roomTableHeaders}
                                    data={tableRows}
                                    wrapInSection={false}
                                    showHeaderActions={false}
                                    showPagination={false}
                                    selectedRows={selectedIndices}
                                    onSelectionChange={(indices) => {
                                        const visibleIds = new Set(paginatedRooms.map(r => (r.id ?? r.roomId)).filter(Boolean));
                                        setSelectedRowIds([...selectedRowIds.filter(id => !visibleIds.has(id)), ...indices.map(i => (paginatedRooms[i]?.id ?? paginatedRooms[i]?.roomId)).filter(Boolean)]);
                                    }}
                                    actions={(row) => [
                                        {
                                            label: "Edit",
                                            onClick: () => {
                                                if (row._raw) {
                                                    setEditingRoom(row._raw);
                                                    setIsAddRoomFormOpen(true);
                                                }
                                            },
                                            className: "text-text-primary-default-light dark:text-text-primary-default-dark font-medium",
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => {
                                                if (row._raw) setDeleteTarget(row._raw);
                                            },
                                            className: "text-text-danger-default-light dark:text-text-danger-default-dark",
                                        },
                                    ]}
                                />
                            );
                        })()}
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

            {/* Add/Edit Room Form */}
            {isAddRoomFormOpen && (
                <RoomForm
                    onClose={() => {
                        setIsAddRoomFormOpen(false);
                        setEditingRoom(null);
                    }}
                    onSubmit={handleFormSubmit}
                    initialData={editingRoom || {}}
                    isLoading={formIsLoading}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Room"
            >
                <div className="space-y-4">
                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark">
                        Are you sure you want to delete <strong>{deleteTarget?.name || deleteTarget?.roomName}</strong>?
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Delete Selected Dialog */}
            <Dialog
                isOpen={isDeleteSelectedOpen}
                onClose={() => setIsDeleteSelectedOpen(false)}
                title="Delete Selected Rooms"
            >
                <div className="space-y-4">
                    <p className="text-text-primary-default-light dark:text-text-primary-default-dark">
                        Are you sure you want to delete {selectedRowIds.length} room{selectedRowIds.length !== 1 ? "s" : ""}?
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setIsDeleteSelectedOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteSelected}>
                            Delete All
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}