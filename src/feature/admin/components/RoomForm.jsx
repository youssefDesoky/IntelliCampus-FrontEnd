import { useState } from "react";
import InputItem from "../../../components/form/InputItem";
import SelectBox from "../../../components/ui/SelectBox";
import Button from "../../../components/ui/Button";
import BaseFormComponent from "../../../components/ui/BaseFormComponent";
import { XIcon } from "../../../components/ui/icons";

const roomTypes = [
    { value: "Hall", label: "Hall" },
    { value: "Lab", label: "Lab" },
    { value: "Classroom", label: "Classroom" },
    { value: "Office", label: "Office" },
    { value: "Conference", label: "Conference Room" },
];

const capacityOptions = [
    { value: "20", label: "Up to 20" },
    { value: "40", label: "Up to 40" },
    { value: "60", label: "Up to 60" },
    { value: "100", label: "Up to 100" },
    { value: "150", label: "Up to 150" },
    { value: "200", label: "Up to 200" },
];

export default function RoomForm({ onClose, onSubmit, initialData = {}, isLoading = false, isOpen = true }) {
    const isEdit = !!(initialData.id ?? initialData.roomId);

    const [selectedType, setSelectedType] = useState(() => {
        if (initialData.type) {
            return roomTypes.find(t => t.value === initialData.type) || roomTypes[0];
        }
        return roomTypes[0];
    });

    const [selectedCapacity, setSelectedCapacity] = useState(() => {
        if (initialData.capacity) {
            return capacityOptions.find(c => c.value === String(initialData.capacity)) || capacityOptions[0];
        }
        return capacityOptions[0];
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = Object.fromEntries(new FormData(form));
        formData.type = selectedType.value;
        formData.capacity = parseInt(selectedCapacity.value);
        if (onSubmit) onSubmit(formData);
    };

    const handleTypeChange = (option) => {
        setSelectedType(option);
    };

    const handleCapacityChange = (option) => {
        setSelectedCapacity(option);
    };

    return (
        <BaseFormComponent
            isOpen={isOpen}
            title={`${isEdit ? "Edit" : "Create New"} Room`}
            description={isEdit ? "Update the details below to edit this room." : "Fill in the details below to add a new room to the system."}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText={isEdit ? (isLoading ? "Saving..." : "Save Changes") : (isLoading ? "Saving..." : "Create Room")}
            submitLoading={isLoading}
        >
            <div className="space-y-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputItem
                        label="Room Name"
                        type="text"
                        id="name"
                        name="name"
                        placeholder="e.g., Hall 1, Lab A, Office 101"
                        defaultValue={initialData.name || initialData.roomName || ""}
                        required
                    />

                    <div dir="rtl">
                        <InputItem
                            label="اسم الغرفة"
                            type="text"
                            id="nameAr"
                            name="nameAr"
                            placeholder="قاعة 1، معمل أ، مكتب 101"
                            defaultValue={initialData.nameAr || initialData.roomNameAr || ""}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectBox
                        className="w-full"
                        label="Room Type"
                        name="type"
                        labelDirection="flex-col"
                        options={roomTypes}
                        selectedOption={selectedType}
                        onChange={handleTypeChange}
                    />

                    <SelectBox
                        className="w-full"
                        label="Capacity"
                        name="capacity"
                        labelDirection="flex-col"
                        options={capacityOptions}
                        selectedOption={selectedCapacity}
                        onChange={handleCapacityChange}
                    />
                </div>

                <InputItem
                    label="Location"
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g., Building A, Floor 2"
                    defaultValue={initialData.location || initialData.roomLocation || initialData.Location || initialData.RoomLocation || ""}
                />

                <div dir="rtl">
                    <InputItem
                        label="الموقع"
                        type="text"
                        id="locationAr"
                        name="locationAr"
                        placeholder="المبنى أ، الطابق 2"
                        defaultValue={initialData.locationAr || initialData.roomLocationAr || ""}
                    />
                </div>
            </div>
        </BaseFormComponent>
    );
}
