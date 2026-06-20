import { useState, useCallback, useMemo } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import ManageEntity from "../../../components/ui/ManageEntity";
import StudentForm from "../../../feature/admin/components/StudentForm";
import AssignRoleModal from "../../../feature/admin/components/AssignRoleModal";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import { UserIcon } from "../../../components/ui/icons";
import useDeviceType from "../../../hooks/useDeviceType";
import { fetchStudents, createStudent, updateStudent, deleteStudent } from "../../../feature/admin/services/adminApi";

export default function ManageStudents() {
  const { isDesktop, isTablet } = useDeviceType();
  const navigate = useNavigate();
  const user = useRouteLoaderData("root");
  const isSuperAdmin = (user?.roles || []).some(r => r.toLowerCase() === 'superadmin');
  const isPostgradAdmin = (user?.roles || []).some(r => r.toLowerCase() === 'admin_postgrad');
  const defaultStudentType = isPostgradAdmin ? 'masters' : 'undergrad';

  const [assignRoleTarget, setAssignRoleTarget] = useState(null);
  const [filterLevel, setFilterLevel] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState([]);

  const studentTableHeaders = useMemo(() => {
    if (isDesktop) return ["Student ID", "Student", "National ID", "Department", "Level", "Bylaw", "Program", "GPA"];
    if (isTablet) return ["Student ID", "Student", "Department", "Level"];
    return ["Student"];
  }, [isDesktop, isTablet]);

  const studentColumnAlignments = useMemo(() => {
    if (isDesktop) return ['text-center', 'text-left', 'text-center', 'text-left', 'text-center', 'text-left', 'text-center', 'text-center'];
    if (isTablet) return ['text-center', 'text-left', 'text-left', 'text-center'];
    return ['text-left'];
  }, [isDesktop, isTablet]);

  const searchFilter = useCallback((student, q) => {
    if (q) {
      if (!(student.fullName?.toLowerCase().includes(q) ||
          student.studentId?.toLowerCase().includes(q) ||
          student.email?.toLowerCase().includes(q) ||
          student.program?.toLowerCase().includes(q) ||
          student.faculty?.toLowerCase().includes(q) ||
          student.departmentName?.toLowerCase().includes(q))) return false;
    }
    if (filterLevel.length > 0 && student.level != null && !filterLevel.includes(String(student.level))) return false;
    if (filterDepartment.length > 0 && !filterDepartment.includes(student.department || student.departmentName || student.faculty)) return false;
    return true;
  }, [filterLevel, filterDepartment]);

  const buildStudentRow = useCallback((student, { isDesktop, isTablet }) => {
    const row = {};
    if (isDesktop || isTablet) row.studentID = student.studentId || "—";
    row.student = (
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full shrink-0 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center text-sm font-bold text-text-accent-active-light dark:text-text-accent-active-dark overflow-hidden">
          {student.profileImage ? <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-text-secondary-default-light dark:text-text-secondary-default-dark" />}
        </div>
        <div className="flex flex-col text-left min-w-0 max-w-40">
          <p className="truncate">{student.fullName}</p>
          <p className="text-xs truncate text-text-secondary-default-light dark:text-text-secondary-default-dark">{student.email}</p>
        </div>
      </div>
    );
    if (isDesktop) row.nationalId = student.nationalId || "—";
    if (isDesktop || isTablet) {
      row.specialization = student.department || student.departmentName || student.faculty || "—";
      row.level = student.level ?? "—";
    }
    if (isDesktop) {
      row.bylaw = student.bylawName ?? "—";
      row.program = student.program ?? "—";
      row.gpa = student.gpa != null ? Number(student.gpa).toFixed(2) : "—";
    }
    return row;
  }, []);

  return (
    <ManageEntity
      entityName="Student"
      entityNamePlural="Students"
      entityIdField="userId"
      fetchItems={fetchStudents}
      createItem={createStudent}
      updateItem={updateStudent}
      deleteItem={deleteStudent}
      headerType="user"
      headerRole="student"
      searchPlaceholder="Search Students..."
      searchFilter={searchFilter}
      tableRole="student"
      tableHeaders={studentTableHeaders}
      columnAlignments={studentColumnAlignments}
      buildRow={buildStudentRow}
      onPreview={(student) => navigate(`/admin/students/${student.userId || student._id || student.studentId}`)}
      rowActions={(item, { onEdit, onDelete }) => {
        const isTargetUndergrad = item.roles?.length === 1 && item.roles[0]?.toLowerCase() === 'student_undergrad';
        const isTargetSuperAdmin = item.roles?.some(r => r.toLowerCase() === 'superadmin');
        const items = [
          { label: 'View Details', onClick: () => navigate(`/admin/students/${item.userId || item._id}`) },
          { label: 'Edit', onClick: () => onEdit(item) },
          { label: 'Delete', className: 'text-text-danger-default-light dark:text-text-danger-default-dark', onClick: () => onDelete(item) },
        ];
        const isTargetMasters = item.roles?.length === 1 && item.roles[0]?.toLowerCase() === 'student_masters';
        const isTargetPhD = item.roles?.length === 1 && item.roles[0]?.toLowerCase() === 'student_phd';
        const isTargetDiploma = item.roles?.length === 1 && item.roles[0]?.toLowerCase() === 'student_diploma';
        if (isSuperAdmin && !isTargetUndergrad && !isTargetMasters && !isTargetPhD && !isTargetDiploma && !isTargetSuperAdmin) {
          items.push({ label: 'Assign Role', onClick: () => setAssignRoleTarget(item) });
        }
        return items;
      }}
      getDeleteMessage={(item) => (
        <>Are you sure you want to delete <strong>{item?.fullName}</strong> ({item?.studentId})? This action cannot be undone.</>
      )}
      renderFilters={({ rawItems, setCurrentPage }) => {
        const levels = [...new Set(rawItems.map(s => s.level).filter(l => l != null))].sort((a, b) => a - b);
        const departments = [...new Set(rawItems.map(s => s.department || s.departmentName || s.faculty).filter(Boolean))].sort();
        return (
          <>
            <FilterDropdown
              label="Level"
              options={levels.map(l => ({ value: String(l), label: `Level ${l}` }))}
              selectedValues={filterLevel}
              onChange={(v) => { setFilterLevel(v); setCurrentPage(1); }}
            />
            <FilterDropdown
              label="Department"
              options={departments.map(d => ({ value: d, label: d }))}
              selectedValues={filterDepartment}
              onChange={(v) => { setFilterDepartment(v); setCurrentPage(1); }}
            />
          </>
        );
      }}
      renderForm={({ isFormOpen, editingItem, closeForm, handleCreate, handleFormSubmit }) => {
        if (!isFormOpen) return null;
        if (editingItem) {
          return <StudentForm method="put" initialData={editingItem} onClose={closeForm} onSubmit={handleFormSubmit} isSuperAdmin={isSuperAdmin} defaultStudentType={defaultStudentType} />;
        }
        return <StudentForm method="post" onClose={closeForm} onSubmit={handleCreate} isSuperAdmin={isSuperAdmin} defaultStudentType={defaultStudentType} />;
      }}
      renderExtraDialogs={({ loadItems, deleteTarget, setDeleteTarget }) => (
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
