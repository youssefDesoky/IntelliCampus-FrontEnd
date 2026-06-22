import { useMemo } from "react";
import ManageEntity from "../../../components/ui/ManageEntity";
import RoomForm from "../../../feature/admin/components/RoomForm";
import useDeviceType from "../../../hooks/useDeviceType";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../../../feature/admin/services/adminApi";

function buildRoomRow(room, isDesktop, isTablet) {
  const nameAr = room.nameAr || room.roomNameAr;
  return {
    roomName: (
      <div className="flex flex-col text-left">
        <p className="font-medium">{room.name || room.roomName || "—"}</p>
        {nameAr && <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark" dir="rtl">{nameAr}</p>}
      </div>
    ),
        type: room.type || "—",
    capacity: room.capacity ?? "—",
    ...((isDesktop || isTablet) ? { location: room.location || room.roomLocation || room.Location || room.RoomLocation || "—" } : {}),
    id: room.id ?? room.roomId,
  };
}

export default function ManageRooms() {
  const { isDesktop, isTablet } = useDeviceType();

  const tableHeaders = useMemo(() => {
    if (isDesktop) return ["Room Name", "Type", "Capacity", "Location"];
    if (isTablet) return ["Room Name", "Type", "Capacity", "Location"];
    return ["Room Name", "Type"];
  }, [isDesktop, isTablet]);

  const columnAlignments = useMemo(() => {
    if (isDesktop || isTablet) return ["text-left", "text-center", "text-center", "text-center"];
    return ["text-left", "text-center"];
  }, [isDesktop, isTablet]);

  return (
    <ManageEntity
      entityName="Room"
      entityNamePlural="Rooms"
      entityIdField={(item) => item.id ?? item.roomId}
      fetchItems={fetchRooms}
      createItem={createRoom}
      updateItem={updateRoom}
      deleteItem={deleteRoom}
      headerTitle="Manage Rooms"
      headerSubtitle="Administer room records and facilities"
      headerAddLabel="Add Room"
      searchPlaceholder="Search rooms..."
      searchFilter={(item, q) =>
        (item.name || item.roomName || "").toLowerCase().includes(q) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q))
      }
      tableRole="room"
      tableHeaders={tableHeaders}
      columnAlignments={columnAlignments}
      buildRow={(item, { isDesktop, isTablet }) => buildRoomRow(item, isDesktop, isTablet)}
      rowActions={(item, { onEdit, onDelete }) => [
        { label: "Edit", onClick: () => onEdit(item), className: "text-text-primary-default-light dark:text-text-primary-default-dark font-medium" },
        { label: "Delete", onClick: () => onDelete(item), className: "text-text-danger-default-light dark:text-text-danger-default-dark" },
      ]}
      getDeleteMessage={(item) => (
        <>Are you sure you want to delete <strong>{item?.name || item?.roomName}</strong>?</>
      )}
      renderForm={({ isFormOpen, editingItem, closeForm, handleFormSubmit, formIsLoading }) =>
        isFormOpen && (
          <RoomForm
            onClose={closeForm}
            onSubmit={handleFormSubmit}
            initialData={editingItem || {}}
            isLoading={formIsLoading}
          />
        )
      }
    />
  );
}
