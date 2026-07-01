import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ManageEntity from "../../../components/ui/ManageEntity";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import ImportDialog from "../../../components/ui/ImportDialog";
import FilterDropdown from "../../../components/ui/FilterDropdown";
import CourseForm from "../../../feature/admin/components/CourseForm";
import useDeviceType from "../../../hooks/useDeviceType";
import {
  PlusIcon,
  ImportIcon,
  XIcon,
  CheckIcon,
  CalendarIcon,
} from "../../../components/ui/icons";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  activateCourse,
  deactivateCourse,
  reactivateCourse,
  updateCourseRegistrationSettings,
} from "../../../feature/admin/services/adminCoursesApi";
import { importCourses } from "../../../feature/admin/services/adminImportsApi";
import CourseRegistrationSettings from "../../../feature/admin/components/CourseRegistrationSettings";
import { useError } from '../../../contexts/ErrorContext.jsx';

function StatusBadge({ isActive, displaySemester }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isActive
          ? "bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark text-white"
          : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-secondary-active-light dark:text-text-secondary-active-dark"
      }`}
    >
      {isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
      {isActive ? displaySemester : "Inactive"}
    </span>
  );
}

export default function ManageCourses() {
  const navigate = useNavigate();
  const { isDesktop, isTablet, isPhone } = useDeviceType();
  const { showError } = useError();

  const [editingCourse, setEditingCourse] = useState(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState([]);
  const [isRegSettingsOpen, setIsRegSettingsOpen] = useState(false);

  const courseTableHeaders = useMemo(() => {
    if (isDesktop) return ["Course Code", "Course", "Department", "Credit Hours", "Status"];
    if (isTablet) return ["Course Code", "Course", "Department", "Status"];
    return ["Course", "Status"];
  }, [isDesktop, isTablet]);

  const columnAlignments = useMemo(() => {
    if (isDesktop) return ["text-center", "text-left", "text-center", "text-center", "text-center"];
    if (isTablet) return ["text-center", "text-left", "text-center", "text-center"];
    return ["text-left", "text-center"];
  }, [isDesktop, isTablet]);

  const fetchCoursesMapped = useCallback(async () => {
    const data = await fetchCourses();
    return (Array.isArray(data) ? data : []).map((c) => ({
      ...c,
      isActive:
        c.statusName?.toLowerCase() === "active" ||
        (typeof c.status === "string" && c.status.toLowerCase() === "active") ||
        c.status === 0,
    }));
  }, []);

  const buildCourseRow = useCallback((course, { isDesktop, isTablet }) => {
    const row = {};
    if (isDesktop || isTablet) row.courseCode = course.courseCode || course.courseId || "—";
    row.course = (
      <div className="flex flex-col text-left">
        <p className="font-medium">{course.courseName}</p>
        {course.courseNameAr && <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark" dir="rtl">{course.courseNameAr}</p>}
        {isDesktop && <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark max-w-50 truncate">{course.description}</p>}
      </div>
    );
    if (isDesktop || isTablet) row.department = course.departmentName || "—";
    if (isDesktop) { row.creditHours = course.creditHours || "—"; }
    row.status = <StatusBadge isActive={course.isActive} displaySemester={course.semester} />;
    return row;
  }, []);

  return (
    <ManageEntity
      entityName="Course"
      entityNamePlural="Courses"
      entityIdField="courseId"
      fetchItems={fetchCoursesMapped}
      createItem={createCourse}
      updateItem={updateCourse}
      deleteItem={deleteCourse}
      headerTitle="Manage Course"
      headerSubtitle="Administer course records, activate and assign instructors"
      onPreview={(course) => setViewingCourse(course)}
      searchPlaceholder="Search Courses..."
      searchFilter={(item, q) => {
        if (q) {
          if (!(item.courseName?.toLowerCase().includes(q) ||
            String(item.courseId)?.toLowerCase().includes(q) ||
            item.courseCode?.toLowerCase().includes(q) ||
            item.departmentName?.toLowerCase().includes(q) ||
            item.professor?.toLowerCase().includes(q))) return false;
        }
        if (filterDepartment.length > 0 && !filterDepartment.includes(item.departmentName)) return false;
        return true;
      }}
      tableRole="course"
      tableRoleLabel="Courses"
      tableHeaders={courseTableHeaders}
      columnAlignments={columnAlignments}
      buildRow={buildCourseRow}
      renderHeaderActions={() => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
            <ImportIcon size={24} />
            {!isPhone && "Import"}
          </Button>
          <Button variant="secondary" onClick={() => setIsRegSettingsOpen(true)}>
            <CalendarIcon size={24} />
            {!isPhone && "Registration"}
          </Button>
          <Button variant="primary" onClick={() => setIsCreateFormOpen(true)}>
            <PlusIcon size={24} />
            {!isPhone && "Add Course"}
          </Button>
        </div>
      )}
      rowActions={(item, { onDelete, loadItems }) => [
        ...(item.isActive ? [{
          label: "Manage Course",
          onClick: () => navigate(`/admin/courses/${item.courseId}`),
          className: "text-text-secondary-default-light dark:text-text-accent-active-dark font-medium",
        }] : []),
        {
          label: "Edit",
          onClick: () => setEditingCourse(item),
          className: "text-text-primary-default-light dark:text-text-primary-default-dark",
        },
        item.isActive
          ? { label: "Deactivate", onClick: async () => { await deactivateCourse(item.courseId); await loadItems(); setSuccessMessage(`Course "${item.courseName}" has been deactivated successfully.`); }, className: "text-text-warning-default-light dark:text-text-warning-default-dark" }
          : { label: "Reactivate", onClick: async () => { await reactivateCourse(item.courseId); await loadItems(); setSuccessMessage(`Course "${item.courseName}" has been reactivated successfully!`); }, className: "text-text-success-default-light dark:text-text-success-default-dark" },
        {
          label: "Delete",
          onClick: async () => {
            if (item.isActive) {
              try {
                await deactivateCourse(item.courseId);
                await loadItems();
              } catch (err) {
                showError(err.message);
                return;
              }
            }
            onDelete(item);
          },
          className: "text-text-danger-default-light dark:text-text-danger-default-dark",
        },
      ]}
      renderBeforeTable={({ selectedRowIds, rawItems, loadItems }) => {
        if (selectedRowIds.length === 0) return null;
        const selected = selectedRowIds.map(id => rawItems.find(c => c.courseId === id)).filter(Boolean);
        const allSelectedActive = selected.length > 0 && selected.every(c => c.isActive);
        const allSelectedInactive = selected.length > 0 && selected.every(c => !c.isActive);
        const handleActivateSelected = async () => {
          try {
            for (const id of selectedRowIds) {
              const course = rawItems.find(c => c.courseId === id);
              if (course && !course.isActive) {
                await activateCourse(id);
              }
            }
            setSuccessMessage(`${selectedRowIds.length} course(s) activated successfully!`);
            await loadItems();
          } catch (err) {
            showError(err.message);
          }
        };
        const handleDeactivateSelected = async () => {
          try {
            for (const id of selectedRowIds) {
              const course = rawItems.find(c => c.courseId === id);
              if (course && course.isActive) {
                await deactivateCourse(id);
              }
            }
            setSuccessMessage(`${selectedRowIds.length} course(s) deactivated successfully.`);
            await loadItems();
          } catch (err) {
            showError(err.message);
          }
        };
        return (
          <>
            <div className="flex items-center gap-2 sm:hidden mb-3">
              {allSelectedInactive && <Button variant="success" size="sm" onClick={handleActivateSelected}><CheckIcon size={18} /></Button>}
              {allSelectedActive && <Button variant="warning" size="sm" onClick={handleDeactivateSelected}><XIcon size={18} /></Button>}
            </div>
            <div className="hidden sm:flex items-center gap-3 mb-3">
              {allSelectedInactive && <Button variant="success" size="sm" onClick={handleActivateSelected}><CheckIcon size={20} /></Button>}
              {allSelectedActive && <Button variant="warning" size="sm" onClick={handleDeactivateSelected}><XIcon size={20} /></Button>}
            </div>
          </>
        );
      }}
      getDeleteMessage={(item) => (
        <>Are you sure you want to delete <strong>{item?.courseName}</strong> ({item?.courseCode || item?.courseId})? This action cannot be undone.</>
      )}
      extraDeps={[filterDepartment]}
      renderFilters={({ rawItems, setCurrentPage }) => {
        const departments = [...new Set(rawItems.map(c => c.departmentName).filter(Boolean))].sort();
        return (
          <FilterDropdown
            label="Department"
            options={departments.map(d => ({ value: d, label: d }))}
            selectedValues={filterDepartment}
            onChange={(v) => { setFilterDepartment(v); setCurrentPage(1); }}
          />
        );
      }}
      renderForm={({ rawItems, loadItems }) => {
        if (editingCourse) {
          return (
            <CourseForm
              method="put"
              initialData={editingCourse}
              onClose={() => setEditingCourse(null)}
              onSubmit={async (formData) => {
                try {
                  await updateCourse(editingCourse.courseId, formData);
                  setEditingCourse(null);
                  await loadItems();
                } catch (err) {
                  showError(err.message);
                }
              }}
              allCourses={rawItems}
            />
          );
        }
        if (isCreateFormOpen) {
          return (
            <CourseForm
              method="post"
              onClose={() => setIsCreateFormOpen(false)}
              onSubmit={async (formData) => {
                try {
                  await createCourse(formData);
                  setIsCreateFormOpen(false);
                  await loadItems();
                } catch (err) {
                  showError(err.message);
                }
              }}
              allCourses={rawItems}
            />
          );
        }
        return null;
      }}
      renderExtraDialogs={({ loadItems, rawItems }) => (
        <>
          {isImportOpen && (
            <ImportDialog
              title="Import Courses"
              subtitle="Upload a file to bulk-import course records."
              onClose={() => setIsImportOpen(false)}
              onImport={async (file) => {
                try {
                  await importCourses(file);
                  setIsImportOpen(false);
                  await loadItems();
                  setSuccessMessage("Courses imported successfully.");
                } catch (err) {
                  showError(err.message);
                }
              }}
            />
          )}

          {viewingCourse && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                    {viewingCourse.courseName || viewingCourse.title || "Course Details"}
                  </h2>
                  <button onClick={() => setViewingCourse(null)} className="text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark transition-colors">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Course Code</p>
                      <p className="text-lg font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                        {viewingCourse.courseCode || viewingCourse.id || viewingCourse.courseId || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Status</p>
                      <StatusBadge isActive={!!viewingCourse.isActive} />
                    </div>
                  </div>
                  {viewingCourse.description && (
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">Description</p>
                      <p className="text-text-primary-default-light dark:text-text-primary-default-dark">{viewingCourse.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Department</p>
                      <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{viewingCourse.departmentName || viewingCourse.department || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Credit Hours</p>
                      <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{viewingCourse.creditHours ?? viewingCourse.credits ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Semester</p>
                      <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{viewingCourse.semester || viewingCourse.level || viewingCourse.term || "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-lg p-4">
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Enrolled Students</p>
                      <p className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                        {viewingCourse.numOfStudents ?? viewingCourse.enrolledCount ?? viewingCourse.enrolled ?? "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Capacity</p>
                      <p className="text-2xl font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
                        {viewingCourse.capacity ?? viewingCourse.maxStudents ?? "—"}
                      </p>
                    </div>
                  </div>
                  {(viewingCourse.schedule || viewingCourse.room) && (
                    <div className="grid grid-cols-2 gap-4">
                      {viewingCourse.schedule && (
                        <div>
                          <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Schedule</p>
                          <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{viewingCourse.schedule}</p>
                        </div>
                      )}
                      {viewingCourse.room && (
                        <div>
                          <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark mb-1">Room</p>
                          <p className="text-text-primary-default-light dark:text-text-primary-default-dark font-medium">{viewingCourse.room}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
                    <Button variant="secondary" onClick={() => { const c = viewingCourse; setViewingCourse(null); setEditingCourse(c); }}>Edit Course</Button>
                    {viewingCourse.isActive && (
                      <Button variant="primary" onClick={() => { setViewingCourse(null); navigate(`/admin/courses/${viewingCourse.courseId}`); }}>Manage Course</Button>
                    )}
                    <Button variant="tertiary" onClick={() => setViewingCourse(null)}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Dialog
            isOpen={successMessage !== null}
            variant="success"
            title="Success"
            onClose={() => setSuccessMessage(null)}
            confirmText="OK"
            showCloseButton={true}
          >
            {successMessage}
          </Dialog>

          {isRegSettingsOpen && (
            <CourseRegistrationSettings
              onClose={() => setIsRegSettingsOpen(false)}
              onSave={async (data) => {
                try {
                  const activeCourses = rawItems.filter(c => c.isActive);
                  for (const c of activeCourses) {
                    await updateCourseRegistrationSettings(c.courseId, data);
                  }
                  await loadItems();
                  setSuccessMessage(`Registration settings applied to ${activeCourses.length} active course(s).`);
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
