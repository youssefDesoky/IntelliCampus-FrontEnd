import { useState, useCallback, useMemo } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import ManageEntity from "../../../components/ui/ManageEntity";
import InstructorForm from "../../../feature/admin/components/InstructorForm";
import AssignRoleModal from "../../../feature/admin/components/AssignRoleModal";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import { UserIcon } from "../../../components/ui/icons";
import useDeviceType from "../../../hooks/useDeviceType";
import { fetchInstructors, createInstructor, deleteInstructor } from "../../../feature/admin/services/adminApi";

export default function ManageInstructors() {
  const { isDesktop, isTablet } = useDeviceType();
  const navigate = useNavigate();
  const user = useRouteLoaderData("root");
  const isSuperAdmin = (user?.roles || []).some(r => r.toLowerCase() === 'superadmin');

  const [assignRoleTarget, setAssignRoleTarget] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [filterType, setFilterType] = useState([]);

  const instructorTableHeaders = useMemo(() => {
    if (isDesktop) return ["Instructor ID", "Instructor", "Department", "Specialization", "Role"];
    if (isTablet) return ["Instructor ID", "Instructor", "Department"];
    return ["Instructor"];
  }, [isDesktop, isTablet]);

  const instructorColumnAlignments = useMemo(() => {
    if (isDesktop) return ['text-center', 'text-left', 'text-left', 'text-left', 'text-center'];
    if (isTablet) return ['text-center', 'text-left', 'text-left'];
    return ['text-left'];
  }, [isDesktop, isTablet]);

  const searchFilter = useCallback((instructor, q) => {
    if (q) {
      if (!(instructor.fullName?.toLowerCase().includes(q) ||
          instructor.instructorId?.toLowerCase().includes(q) ||
          instructor.email?.toLowerCase().includes(q) ||
          instructor.departmentName?.toLowerCase().includes(q) ||
                      (instructor.specialization || instructor.specializationName)?.toLowerCase().includes(q))) return false;
    }
    if (filterDepartment.length > 0 && !filterDepartment.includes(instructor.departmentName)) return false;
    if (filterType.length > 0 && !filterType.includes(instructor.role)) return false;
    return true;
  }, [filterDepartment, filterType]);

  const buildInstructorRow = useCallback((instructor, { isDesktop, isTablet }) => {
    const row = {};
    if (isDesktop || isTablet) row.instructorID = instructor.instructorId || "—";
    row.instructor = (
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark overflow-hidden shrink-0">
          {instructor.profileImage ? <img src={instructor.profileImage} alt={instructor.fullName} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-text-secondary-default-light dark:text-text-secondary-default-dark" />}
        </div>
        <div className="flex flex-col text-left min-w-0 max-w-40">
          <p className="truncate">{instructor.fullName}</p>
          <p className="text-xs truncate text-text-secondary-default-light dark:text-text-secondary-default-dark">{instructor.email}</p>
        </div>
      </div>
    );
    if (isDesktop || isTablet) row.department = instructor.departmentName || "—";
    if (isDesktop) { row.specialization = instructor.specialization || instructor.specializationName || "—"; row.role = instructor.role || instructor.instructorRole || "—"; }
    return row;
  }, []);

  return (
    <ManageEntity
      entityName="Instructor"
      entityNamePlural="Instructors"
      entityIdField="userId"
      fetchItems={fetchInstructors}
      createItem={createInstructor}
      deleteItem={deleteInstructor}
      headerType="user"
      headerRole="instructor"
      searchPlaceholder="Search Instructors..."
      searchFilter={searchFilter}
      tableRole="instructor"
      tableHeaders={instructorTableHeaders}
      columnAlignments={instructorColumnAlignments}
      buildRow={buildInstructorRow}
      onPreview={(instructor) => navigate(`/admin/instructors/${instructor.userId || instructor._id || instructor.instructorId}`)}
      rowActions={(item, { onEdit, onDelete }) => {
        const isTargetSuperAdmin = item.roles?.some(r => r.toLowerCase() === 'superadmin');
        const items = [
          { label: 'View Details', onClick: () => navigate(`/admin/instructors/${item.userId || item._id || item.instructorId}`) },
          { label: 'Edit', onClick: () => onEdit(item) },
          { label: 'Delete', className: 'text-text-danger-default-light dark:text-text-danger-default-dark', onClick: () => onDelete(item) },
        ];
        if (isSuperAdmin && !isTargetSuperAdmin) {
          items.push({ label: 'Assign Role', onClick: () => setAssignRoleTarget(item) });
        }
        return items;
      }}
      getDeleteMessage={(item) => (
        <>Are you sure you want to delete <strong>{item?.fullName}</strong> ({item?.instructorId})? This action cannot be undone.</>
      )}
      renderFilters={({ rawItems, setCurrentPage }) => {
        const departments = [...new Set(rawItems.map(i => i.departmentName).filter(Boolean))].sort();
        const instructorTypes = [...new Set(rawItems.map(i => i.role).filter(Boolean))].sort();
        return (
          <>
            <FilterDropdown
              label="Department"
              options={departments.map(d => ({ value: d, label: d }))}
              selectedValues={filterDepartment}
              onChange={(v) => { setFilterDepartment(v); setCurrentPage(1); }}
            />
            <FilterDropdown
              label="Type"
              options={instructorTypes.map(t => ({ value: t, label: t }))}
              selectedValues={filterType}
              onChange={(v) => { setFilterType(v); setCurrentPage(1); }}
            />
          </>
        );
      }}
      renderForm={({ isFormOpen, editingItem, closeForm, handleCreate, handleFormSubmit }) => {
        if (!isFormOpen) return null;
        if (editingItem) {
          return <InstructorForm method="put" initialData={editingItem} onClose={closeForm} onSubmit={handleFormSubmit} />;
        }
        return <InstructorForm method="post" onClose={closeForm} onSubmit={handleCreate} />;
      }}
      renderExtraDialogs={({ loadItems }) => (
        assignRoleTarget && (
          <AssignRoleModal
            userId={assignRoleTarget.userId}
            userName={assignRoleTarget.fullName}
            onClose={() => setAssignRoleTarget(null)}
            onRolesUpdated={loadItems}
          />
        )
      )}
    />
  );
}
