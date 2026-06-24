import { useState, useCallback, useMemo } from "react";
import ManageEntity from "../../../components/ui/ManageEntity";
import Button from "../../../components/ui/Button";
import DepartmentForm from "../../../feature/admin/components/DepartmentForm";
import DepartmentSpecializationsForm from "../../../feature/admin/components/DepartmentSpecializationsForm";
import DepartmentRegistrationSettings from "../../../feature/admin/components/DepartmentRegistrationSettings";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, fetchInstructors, updateDepartmentRegistrationSettings } from "../../../feature/admin/services/adminApi";
import { PlusIcon, CalendarIcon } from "../../../components/ui/icons";
import { useError } from '../../../contexts/ErrorContext.jsx';

export default function ManageDepartments() {
  const { showError } = useError();
  const [instructors, setInstructors] = useState([]);
  const [specDepartment, setSpecDepartment] = useState(null);
  const [isRegSettingsOpen, setIsRegSettingsOpen] = useState(false);

  const instructorLookup = useMemo(() =>
    instructors.reduce((lookup, instructor) => {
      lookup[String(instructor.instructorId)] = instructor.name;
      return lookup;
    }, {}),
    [instructors]
  );

  const fetchAll = useCallback(async () => {
    const [departmentData, instructorData] = await Promise.all([
      fetchDepartments(),
      fetchInstructors(),
    ]);
    setInstructors(Array.isArray(instructorData) ? instructorData : []);
    return departmentData;
  }, []);

  const buildDepartmentRow = useCallback((department) => {
    const headName = department.headInstructorName || instructorLookup[String(department.instructorId)] || "—";
    return {
      department: (
        <div className="flex flex-col text-left">
          <p className="font-medium">{department.departmentName}</p>
          <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark" dir="rtl">{department.departmentNameAr || "—"}</p>
        </div>
      ),
      headInstructor: headName,
      courses: `${department.courseCount ?? 0}`,
      description: department.description ? (
        <span className="truncate max-w-xs" title={department.description}>
          {department.description}
        </span>
      ) : "—",
    };
  }, [instructorLookup]);

  const searchFilter = useCallback((department, q) => {
    const headName = department.headInstructorName || instructorLookup[String(department.instructorId)] || "";
    return (
      department.departmentName?.toLowerCase().includes(q) ||
      department.departmentNameAr?.toLowerCase().includes(q) ||
      department.description?.toLowerCase().includes(q) ||
      headName.toLowerCase().includes(q) ||
      department.id?.toLowerCase().includes(q)
    );
  }, [instructorLookup]);

  return (
    <ManageEntity
      entityName="Department"
      entityNamePlural="Departments"
      entityIdField={(item) => item.id ?? item.departmentId}
      fetchItems={fetchAll}
      createItem={createDepartment}
      updateItem={updateDepartment}
      deleteItem={deleteDepartment}
      headerTitle="Manage Departments"
      headerSubtitle="Administer department records and ownership"
      renderHeaderActions={({ openForm }) => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsRegSettingsOpen(true)}>
            <CalendarIcon size={24} />
            <span className="hidden sm:inline"> Registration</span>
          </Button>
          <Button variant="primary" onClick={() => openForm(null)}>
            <PlusIcon size={24} />
            <span className="hidden sm:inline"> Add Department</span>
          </Button>
        </div>
      )}
      searchPlaceholder="Search departments..."
      searchFilter={searchFilter}
      tableRole="department"
      tableHeaders={["Department Name", "Head Instructor", "Courses", "Description"]}
      columnAlignments={["text-left", "text-left", "text-center", "text-left"]}
      buildRow={(item) => buildDepartmentRow(item)}
      rowActions={(item, { onEdit, onDelete }) => [
        { label: "Edit", onClick: () => onEdit(item) },
        { label: "Set Specializations", onClick: () => setSpecDepartment(item) },
        { label: "Delete", onClick: () => onDelete(item) },
      ]}
      getDeleteMessage={(item) => (
        <>Are you sure you want to delete <strong>{item?.departmentName}</strong>?</>
      )}
      renderForm={({ isFormOpen, editingItem, closeForm, handleFormSubmit, formIsLoading }) =>
        isFormOpen && (
          <DepartmentForm
            onClose={closeForm}
            onSubmit={handleFormSubmit}
            initialData={editingItem || {}}
            instructors={instructors}
            isLoading={formIsLoading}
          />
        )
      }
      extraDeps={[instructorLookup]}
      renderExtraDialogs={({ loadItems }) => (
        <>
          {specDepartment && (
            <DepartmentSpecializationsForm
              department={specDepartment}
              onClose={() => setSpecDepartment(null)}
              onUpdate={loadItems}
            />
          )}
          {isRegSettingsOpen && (
            <DepartmentRegistrationSettings
              onClose={() => setIsRegSettingsOpen(false)}
              onSave={async (data) => {
                try {
                  await updateDepartmentRegistrationSettings(data);
                  await loadItems();
                } catch (err) {
                  showError(err.message);
                }
              }}
            />
          )}
        </>
      )}
    />
  );
}
