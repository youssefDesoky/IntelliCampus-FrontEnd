import { useState, useEffect, useCallback } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Section from "../../../components/ui/Section";
import SearchBar from "../../../components/ui/SearchBar";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import Table from "../../../components/ui/Table";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import ToggleViewMode from "../../../components/ui/ToggleViewMode";
import RoomForm from "../../../feature/admin/components/RoomForm";
import {
    FilePenIcon,
    TrashIcon,
    HouseIcon,
    LocationDotIcon,
    UsersIcon,
    Grid3ColIcon,
    TableIcon,
    PlusIcon,
} from "../../../components/ui/icons";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../../feature/admin/services/adminApi";

const ITEMS_PER_PAGE = 9;
const roomTableHeaders = ["Room Name", "Type", "Capacity", "Location", "Equipment"];

function buildRoomRow(room) {
    return {
        roomName: (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark">
                    <HouseIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{room.type}</p>
                </div>
            </div>
        ),
        type: <span className="inline-block px-2 py-1 rounded-full bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark text-xs font-medium">{room.type}</span>,
        capacity: `${room.capacity} people`,
        location: room.location || "—",
        equipment: room.equipment ? (
            <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate max-w-xs" title={room.equipment}>
                {room.equipment}
            </span>
        ) : "—",
        _id: room.id,
        _raw: room,
    };
}

import AdminCard from "../../../components/ui/AdminCard";

function RoomCard({ room, onEdit, onDelete }) {
    const meta = [];
    if (room.capacity) meta.push({ icon: UsersIcon, label: `Capacity: ${room.capacity}` });
    if (room.location) meta.push({ icon: LocationDotIcon, label: room.location });
    if (room.equipment) meta.push({ icon: HouseIcon, label: room.equipment });

    const actions = [
        { label: 'Edit', variant: 'secondary', icon: FilePenIcon, onClick: () => onEdit(room) },
        { label: 'Delete', variant: 'danger', icon: TrashIcon, onClick: () => onDelete(room) },
    ];

        return (
            <AdminCard
                icon={<HouseIcon className="w-5 h-5" />}
                title={room.name}
                subtitle={room.type}
                idLabel={room.id} // Assuming room.id is the correct property for room ID
                meta={meta}
                footerActions={actions}
            />
        );
}

export default function ManageRooms() {
    const [isAddRoomFormOpen, setIsAddRoomFormOpen] = useState(false);
    const [rawRooms, setRawRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminRoomsViewMode") || "grid");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formIsLoading, setFormIsLoading] = useState(false);
    useEffect(() => { localStorage.setItem("adminRoomsViewMode", viewMode); }, [viewMode]);

    // Load rooms on mount
    useEffect(() => {
        const loadRooms = async () => {
            try {
                setIsLoading(true);
                const data = await fetchRooms();
                setRawRooms(Array.isArray(data) ? data : []);
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
            room.name.toLowerCase().includes(query) ||
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

    // View mode is controlled via ToggleViewMode handlers

    // Edit handling
    const handleEdit = (room) => {
        setEditingRoom(room);
        setIsAddRoomFormOpen(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setFormIsLoading(true);
            if (editingRoom?.id) {
                await updateRoom(editingRoom.id, data);
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
    const handleDelete = (room) => {
        setDeleteTarget(room);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteRoom(deleteTarget.id);
            setRawRooms(rawRooms.filter(r => r.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setError(err.message);
        }
    };

    // Bulk delete
    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedRows.map(id => deleteRoom(id)));
            setRawRooms(rawRooms.filter(r => !selectedRows.includes(r.id)));
            setSelectedRows([]);
            setIsDeleteSelectedOpen(false);
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
                        <ToggleViewMode
                            isFirstMode={viewMode === "grid"}
                            onFirstModeSelect={() => { setViewMode("grid"); setSelectedRows([]); }}
                            onSecondModeSelect={() => { setViewMode("list"); setSelectedRows([]); }}
                            firstModeLabel={<Grid3ColIcon className="w-5 h-5" />}
                            secondModeLabel={<TableIcon className="w-5 h-5" />}
                        />
                        {viewMode === "list" && selectedRows.length > 0 && (
                            <Button
                                variant="danger"
                                onClick={() => setIsDeleteSelectedOpen(true)}
                            >
                                <TrashIcon size={20} />
                                Delete ({selectedRows.length})
                            </Button>
                        )}
                    </div>
                </div>

                {/* inline delete button is shown in header when in list view */}
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
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedRooms.map(room => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
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
                                        onSelectionChange={setSelectedRows}
                                        onDelete={(index) => {
                                            const r = tableRows[index];
                                            if (r && r._raw) setDeleteTarget(r._raw);
                                        }}
                                        onEdit={(index) => {
                                            const r = tableRows[index];
                                            if (r && r._raw) {
                                                setEditingRoom(r._raw);
                                                setIsAddRoomFormOpen(true);
                                            }
                                        }}
                                    />
                                );
                            })()}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Section>
                            <PaginationButtons
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
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
                        Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
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
                        Are you sure you want to delete {selectedRows.length} room{selectedRows.length !== 1 ? "s" : ""}?
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
