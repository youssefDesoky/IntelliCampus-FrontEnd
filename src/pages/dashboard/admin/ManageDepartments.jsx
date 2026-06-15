import { useState, useCallback, useMemo } from "react";
import ManageEntity from "../../../components/ui/ManageEntity";
import DepartmentForm from "../../../feature/admin/components/DepartmentForm";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, fetchInstructors } from "../../../feature/admin/services/adminApi";

export default function ManageDepartments() {
  const [instructors, setInstructors] = useState([]);

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
      headerAddLabel="Add Department"
      searchPlaceholder="Search departments..."
      searchFilter={searchFilter}
      tableRole="department"
      tableHeaders={["Department Name", "Head Instructor", "Courses", "Description"]}
      columnAlignments={["text-left", "text-left", "text-center", "text-left"]}
      buildRow={(item) => buildDepartmentRow(item)}
      rowActions={(item, { onEdit, onDelete }) => [
        { label: "Edit", onClick: () => onEdit(item) },
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
    />
  );
}
