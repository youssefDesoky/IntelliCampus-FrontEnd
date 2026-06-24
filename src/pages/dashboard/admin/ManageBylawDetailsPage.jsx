import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Section from "../../../components/ui/Section";
import Button from "../../../components/ui/Button";
import Dialog from "../../../components/ui/Dialog";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import SelectBox from "../../../components/ui/SelectBox";
import PaginationButtons from "../../../components/ui/PaginationButtons";
import NumberInput from "../../../components/form/NumberInput";
import { PlusIcon, TrashIcon, FloppyDiskIcon, CheckIcon, XIcon, ArrowRightIcon, CloudUploadIcon, LinkIcon, ClipboardCheckIcon, CalendarDaysIcon, UserIcon, WarningIcon, ClockIcon, DownloadIcon, FileIcon, PenSquareIcon } from "../../../components/ui/icons";
import useDeviceType from "../../../hooks/useDeviceType";
import MaterialPreview from "../../../components/ui/MaterialPreview";
import { API_URL } from "../../../config/api";
import {
  fetchBylawById,
  fetchCourses,
  updateBylaw,
  toggleBylawActive,
  setBylawGradeScales,
  setBylawLevelScales,
  uploadBylawDocument,
  updateBylawRequirements,
  updateBylawPassingGrade,
  updateBylawProbation,
  updateBylawMinHours,
  mapCourseToBylaw,
  unmapCourseFromBylaw,
  setCoursePrerequisites,
  createBucket as apiCreateBucket,
  updateBucket as apiUpdateBucket,
  fetchDepartments,
  fetchSpecializations,
  deleteBucket as apiDeleteBucket,
  updateBylawGradeWeights,
  fetchSpecializationPrerequisites,
  setSpecializationPrerequisites,
} from "../../../feature/admin/services/adminApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

const allTabs = [
  { key: "bylawDetails", label: "Bylaw Details" },
  { key: "general", label: "General Settings & Status" },
  { key: "registration", label: "Registration & Credit Hours Rules" },
  { key: "grading", label: "Grading System Configuration" },
  { key: "probation", label: "Academic Probation Rules" },
  { key: "levels", label: "Academic Levels", bachelorOnly: true },
  { key: "majorDeclaration", label: "Major Declaration Rules", bachelorOnly: true },
  { key: "courseMapping", label: "Course Mapping" },
];

const inputClass = "w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light";
const cardInputClass = "w-full px-2 py-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light";

const defaultGradeScale = { gradeLetter: "", minPercentage: 0, gpaValue: 0, sortOrder: 0 };
const defaultLevelScale = { level: 1, minHours: 0 };
const bylawTypes = [
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "PhD", label: "PhD" },
  { value: "Diploma", label: "Diploma" },
];

function GradeScaleCard({ scale, index, onChange, onRemove }) {
  return (
    <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
        <span className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wider">
          Grade #{scale.sortOrder || index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-auto p-1.5 rounded-lg text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Remove grade scale"
        >
          <TrashIcon size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">Grade</label>
          <input type="text" value={scale.gradeLetter} onChange={(e) => onChange(index, "gradeLetter", e.target.value)} placeholder="A" className={cardInputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">Min %</label>
          <NumberInput step="0.01" value={scale.minPercentage} onChange={(e) => onChange(index, "minPercentage", e.target.value)} placeholder="90" className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">GPA</label>
          <NumberInput step="0.01" value={scale.gpaValue} onChange={(e) => onChange(index, "gpaValue", e.target.value)} placeholder="4.0" className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">Order</label>
          <NumberInput value={scale.sortOrder} onChange={(e) => onChange(index, "sortOrder", parseInt(e.target.value) || 0)} className="w-full" />
        </div>
      </div>
    </div>
  );
}

function LevelScaleCard({ scale, index, onChange, onRemove }) {
  return (
    <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
        <span className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wider">
          Level {scale.level}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-auto p-1.5 rounded-lg text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Remove level scale"
        >
          <TrashIcon size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">Level</label>
          <NumberInput min="1" value={scale.level} onChange={(e) => onChange(index, "level", parseInt(e.target.value) || 1)} className="w-full" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5 text-text-secondary-default-light dark:text-text-secondary-default-dark">Min Passed Credits</label>
          <NumberInput min="0" value={scale.minHours} onChange={(e) => onChange(index, "minHours", parseInt(e.target.value) || 0)} className="w-full" />
        </div>
      </div>
    </div>
  );
}

function CourseMappingTable({ title, items, allCourses, onAdd, onRemove, onSetPrerequisites }) {
  const getCourse = (courseId) => allCourses.find((c) => c.courseId === courseId);

  return (
    <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
        <span className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wider">
          {title} ({items.length})
        </span>
        <Button variant="secondary" type="button" onClick={onAdd}>
          <PlusIcon size={14} />
          Add Courses
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-6 text-center border-b border-border-primary-default-light dark:border-border-primary-default-dark">
          No courses mapped. Click "Add Courses" to select courses.
        </p>
      ) : (
        <div className="divide-y divide-border-primary-default-light dark:divide-border-primary-default-dark">
          {items.map((entry, idx) => {
            const course = getCourse(entry.courseId);
            return (
              <div key={entry.courseId} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                    {course?.courseName || "Unknown Course"}
                  </p>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                    {course?.courseCode || entry.courseId}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark whitespace-nowrap">Credits:</label>
                    <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark w-8 text-center">
                      {course?.creditHours ?? "—"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSetPrerequisites?.(entry.courseId)}
                    className="p-1.5 rounded-lg text-text-accent-active-light dark:text-text-accent-active-dark hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                    title="Set prerequisites"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    className="p-1.5 rounded-lg text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Remove course"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ManageBylawDetailsPage() {
  const { bylawId } = useParams();
  const navigate = useNavigate();
  const { isPhone, isTablet } = useDeviceType();
  const { showError } = useError();

  const [bylaw, setBylaw] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bylawDetails");

  const isBachelor = bylaw?.type === "Bachelor";
  const tabs = useMemo(() => allTabs.filter(t => !t.bachelorOnly || isBachelor), [isBachelor]);

  // ── General Settings & Status ──
  const [totalGraduationHours, setTotalGraduationHours] = useState("");
  const [thesisCreditHours, setThesisCreditHours] = useState("");
  const [hasComprehensiveExam, setHasComprehensiveExam] = useState(false);

  // ── Registration & Credit Hours Rules ──
  const [minCreditHoursPerSemester, setMinCreditHoursPerSemester] = useState("");
  const [maxCreditHoursPerSemester, setMaxCreditHoursPerSemester] = useState("");
  const [summerMaxCreditHours, setSummerMaxCreditHours] = useState("");

  // ── Grading System Configuration ──
  const [gradeScales, setGradeScales] = useState([]);
  const [minPassingGradeLetter, setMinPassingGradeLetter] = useState("");
  const [minPassingGpa, setMinPassingGpa] = useState("");
  const [courseWorkGrade, setCourseWorkGrade] = useState("");
  const [finalExamGrade, setFinalExamGrade] = useState("");

  // ── Academic Probation Rules ──
  const [probationThreshold, setProbationThreshold] = useState("");
  const [probationRegistrationLimit, setProbationRegistrationLimit] = useState("");

  // ── Academic Levels ──
  const [levelScales, setLevelScales] = useState([]);
  // ── Major Declaration Rules ──
  const [minHoursToChooseDepartment, setMinHoursToChooseDepartment] = useState("");
  const [minHoursToChooseSpecialization, setMinHoursToChooseSpecialization] = useState("");
  const [minCreditHoursForGraduationProject, setMinCreditHoursForGraduationProject] = useState("");

  // ── Major Declaration: Specializations table & prerequisites ──
  const [allDepartments, setAllDepartments] = useState([]);
  const [deptSpecializations, setDeptSpecializations] = useState({});
  const [deptSpecsLoading, setDeptSpecsLoading] = useState(false);
  const [specPrerequisites, setSpecPrerequisites] = useState({});
  const [specPrereqTarget, setSpecPrereqTarget] = useState(null);
  const [specPrereqSelectedCourses, setSpecPrereqSelectedCourses] = useState([]);
  const [specPrereqMinGrades, setSpecPrereqMinGrades] = useState({});
  const [specPrereqSearchQuery, setSpecPrereqSearchQuery] = useState("");
  const modifiedSpecPrereqIds = useRef(new Set());

  // ── Course Mapping ──
  const [allCourses, setAllCourses] = useState([]);
  const [allCoursesLoading, setAllCoursesLoading] = useState(false);
  const [universityRequired, setUniversityRequired] = useState([]);
  const [collegeRequired, setCollegeRequired] = useState([]);
  const [majorRequired, setMajorRequired] = useState([]);
  const [courseSelectTarget, setCourseSelectTarget] = useState(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseIdToBylawCourseId, setCourseIdToBylawCourseId] = useState({});

  // ── Prerequisites ──
  const [prerequisites, setPrerequisites] = useState({});
  const [prereqTarget, setPrereqTarget] = useState(null);
  const [prereqSelectedIds, setPrereqSelectedIds] = useState([]);
  const [prereqSearchQuery, setPrereqSearchQuery] = useState("");

  // ── Buckets ──
  const [buckets, setBuckets] = useState([]);
  const [bucketCourseTarget, setBucketCourseTarget] = useState(null);
  const [bucketSelectedIds, setBucketSelectedIds] = useState([]);
  const [bucketSearchQuery, setBucketSearchQuery] = useState("");
  const [bucketDepartments, setBucketDepartments] = useState([]);
  const [newBucketForm, setNewBucketForm] = useState({ name: "", nameAr: "", department: "", departmentId: null });
  const [isNewBucketOpen, setIsNewBucketOpen] = useState(false);
  const [editingBucket, setEditingBucket] = useState(null);
  const originalBucketsRef = useRef([]);

  // ── Pagination ──
  const [gradeScalesPage, setGradeScalesPage] = useState(1);
  const [levelScalesPage, setLevelScalesPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const cardsContainerRef = useRef(null);

  // ── Saving / Status ──
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [savingRegistration, setSavingRegistration] = useState(false);
  const [savingGradeScales, setSavingGradeScales] = useState(false);
  const [savingProbation, setSavingProbation] = useState(false);
  const [savingLevelScales, setSavingLevelScales] = useState(false);
  const [savingMinHours, setSavingMinHours] = useState(false);
  const [savingCourseMapping, setSavingCourseMapping] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // ── Toggle Active Dialog ──
  const [isToggleActiveOpen, setIsToggleActiveOpen] = useState(false);

  // ── Bylaw Details Form ──
  const [editName, setEditName] = useState("");
  const [editNameAr, setEditNameAr] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionAr, setEditDescriptionAr] = useState("");
  const [selectedBylawType, setSelectedBylawType] = useState(bylawTypes[0]);
  const [newFiles, setNewFiles] = useState([]);
  const [savingBylawDetails, setSavingBylawDetails] = useState(false);
  const [documentPreviewTarget, setDocumentPreviewTarget] = useState(null);
  const fileInputRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchBylawById(bylawId);
      setBylaw(data);

      setEditName(data.name || "");
      setEditNameAr(data.nameAr || "");
      setEditDescription(data.description || "");
      setEditDescriptionAr(data.descriptionAr || "");
      setSelectedBylawType(bylawTypes.find(t => t.value === data.type) || bylawTypes[0]);
      setTotalGraduationHours(data.totalHoursToCompleteDegree ?? "");
      setThesisCreditHours(data.thesisCreditHours ?? "");
      setHasComprehensiveExam(data.hasComprehensiveExam ?? false);

      setMinCreditHoursPerSemester(data.minCreditHoursPerSemester ?? "");
      setMaxCreditHoursPerSemester(data.maxCreditHoursPerSemester ?? "");
      setSummerMaxCreditHours(data.summerMaxCreditHours ?? "");

      setGradeScales(data.gradeScales?.length
        ? data.gradeScales.map((g, i) => ({ ...g, sortOrder: i + 1 }))
        : []);
      setMinPassingGradeLetter(data.minPassingGradeLetter ?? "");
      setMinPassingGpa(data.minPassingGpa ?? "");
      setCourseWorkGrade(data.courseWorkGrade ?? "");
      setFinalExamGrade(data.finalExamGrade ?? "");

      setProbationThreshold(data.probationThreshold ?? "");
      setProbationRegistrationLimit(data.probationRegistrationLimit ?? "");

      setLevelScales(data.levelScales?.length
        ? data.levelScales.map((l) => ({ ...l }))
        : []);

      setMinHoursToChooseDepartment(data.minHoursToChooseDepartment ?? "");
      setMinHoursToChooseSpecialization(data.minHoursToChooseSpecialization ?? "");
      setMinCreditHoursForGraduationProject(data.minCreditHoursForGraduationProject ?? "");

      // Parse BylawCourses into course arrays and prerequisites
      const courseMap = {}, bcToCourse = {};
      const uni = [], college = [], major = [];
      const prereqMap = {};
      (data.bylawCourses || []).forEach(bc => {
        courseMap[bc.courseId] = bc.bylawCourseId;
        bcToCourse[bc.bylawCourseId] = bc.courseId;
        const entry = { courseId: bc.courseId, bylawCourseId: bc.bylawCourseId, creditHours: bc.creditHours ?? null };
        const type = bc.courseType?.toLowerCase() || "";
        if (type === "generaluniversity") uni.push(entry);
        else if (type === "faculty") college.push(entry);
        else if (type === "department" || type === "specialization") major.push(entry);
        if (bc.prerequisites?.length) {
          prereqMap[bc.courseId] = bc.prerequisites.map(p => bcToCourse[p.prerequisiteBylawCourseId] || p.prerequisiteBylawCourseId);
        }
      });
      setCourseIdToBylawCourseId(courseMap);
      setUniversityRequired(uni);
      setCollegeRequired(college);
      setMajorRequired(major);
      setPrerequisites(prereqMap);
      const loadedBuckets = (data.electiveBuckets || []).map(b => ({
        id: b.electiveBucketId,
        name: b.name,
        nameAr: b.nameAr,
        minCourses: b.requiredCourseCount || 1,
        requiredCreditHours: b.requiredCreditHours || 0,
        courseIds: (b.courses || []).map(c => ({ courseId: c.courseId, creditHours: c.creditHours })),
        departmentId: b.departmentId || null,
        department: b.departmentName || "",
      }));
      setBuckets(loadedBuckets);
      originalBucketsRef.current = loadedBuckets.map(b => b.id);
      setNewFiles([]);
    } catch (err) {
      showError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [bylawId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (!cardsContainerRef.current) return;
      const rect = cardsContainerRef.current.getBoundingClientRect();
      const bottomPaddingOffset = isPhone ? 60 : isTablet ? 30 : 0;
      const availableHeight = window.innerHeight - rect.top - bottomPaddingOffset;
      setItemsPerPage(Math.max(3, Math.floor(availableHeight / 95)));
    };
    const timer = setTimeout(calculateItemsPerPage, 50);
    window.addEventListener("resize", calculateItemsPerPage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateItemsPerPage);
    };
  }, [gradeScales.length, levelScales.length, isPhone, isTablet]);

  const gradeScalesTotalPages = Math.max(1, Math.ceil(gradeScales.length / itemsPerPage));
  const levelScalesTotalPages = Math.max(1, Math.ceil(levelScales.length / itemsPerPage));

  useEffect(() => {
    if (gradeScalesPage > gradeScalesTotalPages) setGradeScalesPage(gradeScalesTotalPages);
  }, [gradeScalesTotalPages, gradeScalesPage]);

  useEffect(() => {
    if (levelScalesPage > levelScalesTotalPages) setLevelScalesPage(levelScalesTotalPages);
  }, [levelScalesTotalPages, levelScalesPage]);

  const paginatedGradeScales = useMemo(() =>
    gradeScales.slice((gradeScalesPage - 1) * itemsPerPage, gradeScalesPage * itemsPerPage),
    [gradeScales, gradeScalesPage, itemsPerPage]
  );

  const paginatedLevelScales = useMemo(() =>
    levelScales.slice((levelScalesPage - 1) * itemsPerPage, levelScalesPage * itemsPerPage),
    [levelScales, levelScalesPage, itemsPerPage]
  );

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ── Handlers: General Settings & Status ──

  const handleToggleActive = async () => {
    try {
      await toggleBylawActive(bylawId);
      showSuccess("Bylaw status toggled successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to toggle status");
    }
    setIsToggleActiveOpen(false);
  };

  const handleSaveGeneral = async () => {
    
    setSavingGeneral(true);
    try {
      if (isBachelor) {
        await updateBylawRequirements(bylawId, {
          totalHoursToCompleteDegree: parseInt(totalGraduationHours) || null,
        });
        await updateBylawMinHours(bylawId, {
          minCreditHoursForGraduationProject: parseInt(minCreditHoursForGraduationProject) || null,
        });
      } else {
        await updateBylawRequirements(bylawId, {
          totalHoursToCompleteDegree: parseInt(totalGraduationHours) || null,
          thesisCreditHours: parseInt(thesisCreditHours) || null,
          hasComprehensiveExam: hasComprehensiveExam,
        });
      }
      showSuccess("General settings saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save general settings");
    } finally {
      setSavingGeneral(false);
    }
  };

  // ── Handlers: Registration & Credit Hours Rules ──

  const handleSaveRegistration = async () => {
    
    setSavingRegistration(true);
    try {
      await updateBylawRequirements(bylawId, {
        minCreditHoursPerSemester: parseInt(minCreditHoursPerSemester) || null,
        maxCreditHoursPerSemester: parseInt(maxCreditHoursPerSemester) || null,
        summerMaxCreditHours: parseInt(summerMaxCreditHours) || null,
      });
      showSuccess("Registration rules saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save registration rules");
    } finally {
      setSavingRegistration(false);
    }
  };

  // ── Handlers: Grading System Configuration ──

  const addGradeScale = () => {
    setGradeScales(prev => [...prev, { ...defaultGradeScale, sortOrder: prev.length + 1 }]);
  };

  const removeGradeScale = (index) => {
    setGradeScales(prev => prev.filter((_, i) => i !== index).map((g, i) => ({ ...g, sortOrder: i + 1 })));
  };

  const updateGradeScale = (index, field, value) => {
    setGradeScales(prev => prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)));
  };

  const handleSaveGrading = async () => {
    
    const valid = gradeScales.filter((g) => g.gradeLetter.trim() !== "");
    if (valid.length === 0) {
      showError("At least one grade scale is required");
      return;
    }
    setSavingGradeScales(true);
    try {
      await setBylawGradeScales(bylawId, valid.map((g) => ({
        gradeLetter: g.gradeLetter,
        minPercentage: parseFloat(g.minPercentage) || 0,
        gpaValue: parseFloat(g.gpaValue) || 0,
        sortOrder: g.sortOrder,
      })));
      await updateBylawPassingGrade(bylawId, {
        minPassingGradeLetter: minPassingGradeLetter || null,
        minPassingGpa: parseFloat(minPassingGpa) || null,
      });
      await updateBylawGradeWeights(bylawId, {
        courseWorkGrade: parseFloat(courseWorkGrade) || null,
        finalExamGrade: parseFloat(finalExamGrade) || null,
      });
      showSuccess("Grading configuration saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save grading configuration");
    } finally {
      setSavingGradeScales(false);
    }
  };

  // ── Handlers: Academic Probation Rules ──

  const handleSaveProbation = async () => {
    
    setSavingProbation(true);
    try {
      await updateBylawProbation(bylawId, {
        probationThreshold: parseFloat(probationThreshold) || null,
        probationRegistrationLimit: parseInt(probationRegistrationLimit) || null,
      });
      showSuccess("Probation rules saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save probation rules");
    } finally {
      setSavingProbation(false);
    }
  };

  // ── Handlers: Academic Levels ──

  const addLevelScale = () => {
    const nextLevel = levelScales.length > 0 ? Math.max(...levelScales.map((l) => l.level)) + 1 : 1;
    setLevelScales(prev => [...prev, { ...defaultLevelScale, level: nextLevel }]);
  };

  const removeLevelScale = (index) => {
    setLevelScales(prev => prev.filter((_, i) => i !== index));
  };

  const updateLevelScale = (index, field, value) => {
    setLevelScales(prev => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const handleSaveLevels = async () => {
    
    const valid = levelScales.filter((l) => l.level > 0);
    if (valid.length === 0) {
      showError("At least one level scale is required");
      return;
    }
    setSavingLevelScales(true);
    try {
      await setBylawLevelScales(bylawId, valid.map((l) => ({
        level: l.level,
        minHours: parseInt(l.minHours) || 0,
      })));
      showSuccess("Academic levels saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save academic levels");
    } finally {
      setSavingLevelScales(false);
    }
  };

  // ── Handlers: Major Declaration Rules ──

  const handleSaveMinHours = async () => {
    
    setSavingMinHours(true);
    try {
      await updateBylawMinHours(bylawId, {
        minHoursToChooseDepartment: parseInt(minHoursToChooseDepartment) || null,
        minHoursToChooseSpecialization: parseInt(minHoursToChooseSpecialization) || null,
      });
      // Save only specialization prerequisites that were actually modified
      const modifiedSpecIds = [...modifiedSpecPrereqIds.current];
      await Promise.all(modifiedSpecIds.map(async (specId) => {
        const prereqs = specPrerequisites[specId] || [];
        await setSpecializationPrerequisites(parseInt(specId), prereqs);
      }));
      modifiedSpecPrereqIds.current.clear();
      showSuccess("Major declaration rules saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save major declaration rules");
    } finally {
      setSavingMinHours(false);
    }
  };

  // ── Handlers: Specialization Prerequisites ──

  const confirmSpecPrereqSelection = () => {
    if (!specPrereqTarget) return;
    const prereqs = specPrereqSelectedCourses.map(courseId => ({
      courseId,
      minGrade: specPrereqMinGrades[courseId] || null,
    }));
    setSpecPrerequisites(prev => ({ ...prev, [specPrereqTarget.specId]: prereqs }));
    modifiedSpecPrereqIds.current.add(specPrereqTarget.specId);
    setSpecPrereqTarget(null);
    setSpecPrereqSelectedCourses([]);
    setSpecPrereqMinGrades({});
    setSpecPrereqSearchQuery("");
  };

  // ── Handlers: Course Mapping ──

  const openCourseSelect = (target) => {
    setCourseSelectTarget(target);
    const existingIds = target === "university" ? universityRequired.map(c => c.courseId) :
                        target === "college" ? collegeRequired.map(c => c.courseId) :
                        majorRequired.map(c => c.courseId);
    setSelectedCourseIds(existingIds);
    setCourseSearchQuery("");
  };

  const confirmCourseSelection = () => {
    if (!courseSelectTarget || selectedCourseIds.length === 0) return;
    const updater = (prev) => {
      const existing = new Set(prev.map(c => c.courseId));
      const newIds = selectedCourseIds.filter(id => !existing.has(id));
      const result = [...prev, ...newIds.map(courseId => ({ courseId, bylawCourseId: null, creditHours: null }))];
      return result;
    };
    if (courseSelectTarget === "university") {
      setUniversityRequired(updater);
    } else if (courseSelectTarget === "college") {
      setCollegeRequired(updater);
    } else if (courseSelectTarget === "major") {
      setMajorRequired(updater);
    }
    setCourseSelectTarget(null);
    setSelectedCourseIds([]);
  };

  const removeCourseMappingRow = (list, setter, index) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // ── Handlers: Prerequisites ──

  const openPrereqSelect = (courseId) => {
    setPrereqTarget(courseId);
    setPrereqSelectedIds(prerequisites[courseId] || []);
    setPrereqSearchQuery("");
  };

  const confirmPrereqSelection = () => {
    if (!prereqTarget) return;
    setPrerequisites(prev => ({ ...prev, [prereqTarget]: prereqSelectedIds }));
    setPrereqTarget(null);
    setPrereqSelectedIds([]);
  };

  // ── Handlers: Buckets ──

  const createBucket = () => {
    setNewBucketForm({ name: "", nameAr: "", department: "", departmentId: null });
    setIsNewBucketOpen(true);
  };

  const confirmNewBucket = async () => {
    if (!newBucketForm.name.trim()) return;
    setIsNewBucketOpen(false);
    try {
      const created = await apiCreateBucket({
        name: newBucketForm.name.trim(),
        nameAr: newBucketForm.nameAr.trim(),
        bylawId: parseInt(bylawId),
        departmentId: newBucketForm.departmentId,
        requiredCreditHours: 0,
        requiredCourseCount: 1,
        courseIds: [],
      });
      setBuckets(prev => [...prev, {
        id: created.electiveBucketId,
        name: created.name,
        nameAr: created.nameAr,
        courseIds: [],
        minCourses: 1,
        requiredCreditHours: 0,
        department: newBucketForm.department || "",
        departmentId: newBucketForm.departmentId,
      }]);
      setNewBucketForm({ name: "", nameAr: "", department: "", departmentId: null });
    } catch (err) {
      showError(err.message || "Failed to create bucket");
    }
  };

  const updateBucket = (id, field, value) => {
    setBuckets(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const removeBucket = (id) => {
    setBuckets(prev => prev.filter(b => b.id !== id));
  };

  const openBucketCourseSelect = async (bucketId) => {
    const bucket = buckets.find(b => b.id === bucketId);
    setBucketCourseTarget(bucketId);
    setBucketSelectedIds((bucket?.courseIds || []).map(c => c.courseId));
    setBucketSearchQuery("");
    try {
      const depts = await fetchDepartments();
      setBucketDepartments(Array.isArray(depts) ? depts : []);
    } catch (err) {
      showError(err.message || "Failed to fetch departments");
    }
  };

  const confirmBucketCourseSelection = () => {
    if (!bucketCourseTarget) return;
    setBuckets(prev => prev.map(b =>
      b.id === bucketCourseTarget ? {
        ...b,
        courseIds: bucketSelectedIds.map(id => {
          const course = allCourses.find(c => c.courseId === id);
          return { courseId: id, creditHours: course?.creditHours || 0 };
        }),
      } : b
    ));
    setBucketCourseTarget(null);
    setBucketSelectedIds([]);
  };

  const removeBucketCourse = (bucketId, courseId) => {
    setBuckets(prev => prev.map(b =>
      b.id === bucketId ? { ...b, courseIds: b.courseIds.filter(c => c.courseId !== courseId) } : b
    ));
  };

  useEffect(() => {
    if (activeTab !== "courseMapping") return;
    let cancelled = false;
    setAllCoursesLoading(true);
    fetchCourses().then((data) => {
      if (!cancelled) setAllCourses(Array.isArray(data) ? data : []);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setAllCoursesLoading(false);
    });
    fetchDepartments().then((data) => {
      if (!cancelled) setBucketDepartments(Array.isArray(data) ? data : []);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "majorDeclaration") return;
    let cancelled = false;
    setDeptSpecsLoading(true);
    if (allCourses.length === 0) {
      fetchCourses().then((data) => {
        if (!cancelled) setAllCourses(Array.isArray(data) ? data : []);
      }).catch(() => {});
    }
    fetchDepartments().then(async (depts) => {
      if (cancelled) return;
      const deptList = Array.isArray(depts) ? depts : [];
      setAllDepartments(deptList);
      const specsMap = {};
      const prereqsMap = {};
      await Promise.all(deptList.map(async (dept) => {
        try {
          const specs = await fetchSpecializations(dept.departmentId ?? dept.id);
          const specList = Array.isArray(specs) ? specs : [];
          specsMap[dept.departmentId ?? dept.id] = specList;
          await Promise.all(specList.map(async (spec) => {
            try {
              const prereqs = await fetchSpecializationPrerequisites(spec.specializationId);
              prereqsMap[spec.specializationId] = (prereqs || []).map(p => ({
                courseId: p.courseId,
                minGrade: p.minGrade,
              }));
            } catch { prereqsMap[spec.specializationId] = []; }
          }));
        } catch {
          specsMap[dept.departmentId ?? dept.id] = [];
        }
      }));
      if (!cancelled) {
        setDeptSpecializations(specsMap);
        setSpecPrerequisites(prereqsMap);
        setDeptSpecsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setDeptSpecsLoading(false);
    });
    return () => { cancelled = true; };
  }, [activeTab]);

  const handleSaveCourseMapping = async () => {
    
    setSavingCourseMapping(true);
    try {
      const allCurrent = [...universityRequired, ...collegeRequired, ...majorRequired];
      const allCurrentIds = new Set(allCurrent.map(c => c.courseId));
      const allOriginal = [...Object.keys(courseIdToBylawCourseId).map(Number)];

      // Determine added courseIds (not in original mapping)
      const addedIds = allCurrent.filter(c => !courseIdToBylawCourseId[c.courseId]).map(c => c.courseId);

      // Determine removed courseIds (in original but not in current)
      const removedIds = allOriginal.filter(id => !allCurrentIds.has(id));

      // Map added courses
      const typeForCourse = {};
      universityRequired.forEach(c => { typeForCourse[c.courseId] = "GeneralUniversity"; });
      collegeRequired.forEach(c => { typeForCourse[c.courseId] = "Faculty"; });
      majorRequired.forEach(c => { typeForCourse[c.courseId] = "Department"; });

      const newBcIds = {};
      for (const courseId of addedIds) {
        const result = await mapCourseToBylaw(bylawId, {
          courseId,
          courseType: typeForCourse[courseId],
        });
        newBcIds[courseId] = result.bylawCourseId;
      }

      // Build updated courseId -> bylawCourseId map for prerequisite conversion
      const updatedMap = { ...courseIdToBylawCourseId, ...newBcIds };

      // Set prerequisites for ALL current courses that have them
      for (const entry of allCurrent) {
        const prereqCourseIds = prerequisites[entry.courseId];
        if (prereqCourseIds && prereqCourseIds.length > 0) {
          const prereqBcIds = prereqCourseIds
            .map(cid => updatedMap[cid])
            .filter(Boolean);
          if (prereqBcIds.length > 0) {
            await setCoursePrerequisites(updatedMap[entry.courseId], {
              prerequisiteBylawCourseIds: prereqBcIds,
            });
          }
        }
      }

      // Remove unmapped courses
      for (const courseId of removedIds) {
        const bcId = courseIdToBylawCourseId[courseId];
        if (bcId) {
          await unmapCourseFromBylaw(bcId);
        }
      }

      // Save buckets via ElectiveBuckets API
      const originalIds = new Set(originalBucketsRef.current);
      const currentIds = new Set(buckets.map(b => b.id));
      for (const bucket of buckets) {
        const isNew = !originalIds.has(bucket.id);
        if (isNew) {
          await apiCreateBucket({
            name: bucket.name,
            nameAr: bucket.nameAr,
            bylawId: parseInt(bylawId),
            departmentId: bucket.departmentId || null,
            requiredCreditHours: bucket.requiredCreditHours || 0,
            requiredCourseCount: bucket.minCourses || 1,
            courseIds: (bucket.courseIds || []).map(c => c.courseId),
          });
        } else {
          await apiUpdateBucket(bucket.id, {
            name: bucket.name,
            nameAr: bucket.nameAr,
            requiredCreditHours: bucket.requiredCreditHours || 0,
            requiredCourseCount: bucket.minCourses || 1,
            courseIds: (bucket.courseIds || []).map(c => c.courseId),
          });
        }
      }
      for (const id of originalBucketsRef.current) {
        if (!currentIds.has(id)) {
          await apiDeleteBucket(id);
        }
      }

      showSuccess("Course mapping saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save course mapping");
    } finally {
      setSavingCourseMapping(false);
    }
  };

  // ── Handlers: Bylaw Details ──

  const handleSaveBylawDetails = async () => {
    
    if (!editName.trim()) {
      showError("Bylaw name is required");
      return;
    }
    setSavingBylawDetails(true);
    try {
      await updateBylaw(bylawId, {
        name: editName.trim(),
        nameAr: editNameAr.trim(),
        description: editDescription.trim(),
        descriptionAr: editDescriptionAr.trim(),
        type: selectedBylawType.value,
      });
      for (const file of newFiles) {
        await uploadBylawDocument(bylawId, file);
      }
      showSuccess("Bylaw details saved successfully");
      await loadData();
    } catch (err) {
      showError(err.message || "Failed to save bylaw details");
    } finally {
      setSavingBylawDetails(false);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center py-10 text-text-secondary-default-light dark:text-text-secondary-default-dark">
        Loading bylaw...
      </p>
    );
  }

  return (
    <div className="p-0 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/admin/bylaws")}
            className="shrink-0 w-10 h-10 rounded-xl bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark flex items-center justify-center hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors"
          >
            <ArrowRightIcon className="w-5 h-5 rotate-180 text-text-secondary-default-light dark:text-text-secondary-default-dark" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary-active-light dark:text-text-primary-active-dark truncate">
              {bylaw.name}
            </h1>
            <p className="text-text-secondary-active-light dark:text-text-secondary-active-dark text-xs md:text-sm truncate">
              {bylaw.description || ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bylaw.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
            {bylaw.isActive ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
            {bylaw.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Success message */}
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

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border-primary-default-light dark:border-border-primary-default-dark overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key);  }}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-border-accent-active-light dark:border-border-accent-active-dark text-text-primary-default-light dark:text-text-primary-default-dark"
                : "border-transparent text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ General Settings & Status ═══ */}
      {activeTab === "general" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              General Settings & Status
            </span>
            <div className="flex items-center gap-2">
              <Button variant="warning" type="button" onClick={() => setIsToggleActiveOpen(true)}>
                {bylaw.isActive ? <XIcon size={16} /> : <CheckIcon size={16} />}
                {bylaw.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="primary" type="button" onClick={handleSaveGeneral} disabled={savingGeneral}>
                <FloppyDiskIcon size={16} />
                {savingGeneral ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                  <ClipboardCheckIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Total Graduation Hours</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Total credit hours required to graduate</p>
                </div>
              </div>
              <NumberInput min="0" value={totalGraduationHours} onChange={(e) => setTotalGraduationHours(e.target.value)} placeholder="e.g., 130" className="w-full" />
            </div>

            {isBachelor && (
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                  <UserIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Min Hours for Graduation Project</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Minimum credit hours required to register graduation project</p>
                </div>
              </div>
              <NumberInput min="0" value={minCreditHoursForGraduationProject} onChange={(e) => setMinCreditHoursForGraduationProject(e.target.value)} placeholder="e.g., 90" className="w-full" />
            </div>
            )}

            {!isBachelor && (
            <>
              <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                    <UserIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Thesis Credit Hours</h3>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Credit hours assigned to thesis work</p>
                  </div>
                </div>
                <NumberInput min="0" value={thesisCreditHours} onChange={(e) => setThesisCreditHours(e.target.value)} placeholder="e.g., 6" className="w-full" />
              </div>

              <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                    <ClipboardCheckIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Comprehensive Exam</h3>
                    <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Whether this program requires a comprehensive exam</p>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasComprehensiveExam}
                    onChange={(e) => setHasComprehensiveExam(e.target.checked)}
                    className="rounded border-border-primary-default-light dark:border-border-primary-default-dark text-text-accent-active-light focus:ring-text-accent-active-light"
                  />
                  <span className="text-sm text-text-primary-default-light dark:text-text-primary-default-dark">
                    {hasComprehensiveExam ? "Required" : "Not Required"}
                  </span>
                </label>
              </div>
            </>
            )}

            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                  <CalendarDaysIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Status</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Current bylaw status</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${bylaw.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                  {bylaw.isActive ? <CheckIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                  {bylaw.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

        </Section>
      )}

      {/* ═══ Registration & Credit Hours Rules ═══ */}
      {activeTab === "registration" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              Registration & Credit Hours Rules
            </span>
            <Button variant="primary" type="button" onClick={handleSaveRegistration} disabled={savingRegistration}>
              <FloppyDiskIcon size={16} />
              {savingRegistration ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                  <WarningIcon size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Minimum Credits Per Semester</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Lowest allowed course load per semester</p>
                </div>
              </div>
              <NumberInput min="0" value={minCreditHoursPerSemester} onChange={(e) => setMinCreditHoursPerSemester(e.target.value)} placeholder="e.g., 12" className="w-full" />
            </div>

            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                  <CheckIcon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Maximum Credits Per Semester</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Highest allowed course load per semester</p>
                </div>
              </div>
              <NumberInput min="0" value={maxCreditHoursPerSemester} onChange={(e) => setMaxCreditHoursPerSemester(e.target.value)} placeholder="e.g., 18" className="w-full" />
            </div>

            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 shrink-0">
                  <ClockIcon size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Summer Semester Max Credits</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Maximum credits allowed in summer</p>
                </div>
              </div>
              <NumberInput min="0" value={summerMaxCreditHours} onChange={(e) => setSummerMaxCreditHours(e.target.value)} placeholder="e.g., 6" className="w-full" />
            </div>
          </div>
        </Section>
      )}

      {/* ═══ Grading System Configuration ═══ */}
      {activeTab === "grading" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              {gradeScales.length} grade scale{gradeScales.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              {gradeScales.length >= 18 ? (
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Max grade scales reached</span>
              ) : (
                <Button variant="secondary" type="button" onClick={addGradeScale}>
                  <PlusIcon size={16} />
                  Add Grade Scale
                </Button>
              )}
              <Button variant="primary" type="button" onClick={handleSaveGrading} disabled={savingGradeScales}>
                <FloppyDiskIcon size={16} />
                {savingGradeScales ? "Saving..." : "Save Grading"}
              </Button>
            </div>
          </div>

          {/* Min Passing Grade & Min Graduation GPA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4">
              <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">Minimum Passing Grade</label>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">The lowest passing grade letter (e.g., D)</p>
              <input type="text" value={minPassingGradeLetter} onChange={(e) => setMinPassingGradeLetter(e.target.value)} className={inputClass} placeholder="e.g., D" />
            </div>
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4">
              <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">Minimum Graduation GPA</label>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">The minimum cumulative GPA to graduate</p>
              <NumberInput step="0.01" min="0" max="4" value={minPassingGpa} onChange={(e) => setMinPassingGpa(e.target.value)} placeholder="e.g., 2.0" className="w-full" />
            </div>
          </div>

          {/* Course Work & Final Exam Grade Weights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4">
              <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">Course Work Grade (%)</label>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">Percentage weight of course work in the total grade</p>
              <NumberInput step="0.1" min="0" max="100" value={courseWorkGrade} onChange={(e) => setCourseWorkGrade(e.target.value)} placeholder="e.g., 40" className="w-full" />
            </div>
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4">
              <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">Final Exam Grade (%)</label>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">Percentage weight of the final exam in the total grade</p>
              <NumberInput step="0.1" min="0" max="100" value={finalExamGrade} onChange={(e) => setFinalExamGrade(e.target.value)} placeholder="e.g., 60" className="w-full" />
            </div>
          </div>

          {gradeScales.length === 0 ? (
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
              No grade scales defined. Click "Add Grade Scale" to add one.
            </p>
          ) : (
            <div ref={cardsContainerRef} className="space-y-3">
              {paginatedGradeScales.map((scale, idx) => (
                <GradeScaleCard key={idx} scale={scale} index={(gradeScalesPage - 1) * itemsPerPage + idx} onChange={updateGradeScale} onRemove={removeGradeScale} />
              ))}
            </div>
          )}

          {gradeScales.length > itemsPerPage && (
            <div className="mt-4">
              <PaginationButtons
                totalPages={gradeScalesTotalPages}
                currentPage={gradeScalesPage}
                setCurrentPage={setGradeScalesPage}
                from={(gradeScalesPage - 1) * itemsPerPage + 1}
                to={Math.min(gradeScalesPage * itemsPerPage, gradeScales.length)}
                total={gradeScales.length}
                label="grade scales"
              />
            </div>
          )}
        </Section>
      )}

      {/* ═══ Academic Probation Rules ═══ */}
      {activeTab === "probation" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              Academic Probation Rules
            </span>
            <Button variant="primary" type="button" onClick={handleSaveProbation} disabled={savingProbation}>
              <FloppyDiskIcon size={16} />
              {savingProbation ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0">
                  <WarningIcon size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Probation Threshold</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Minimum GPA before student is placed on probation</p>
                </div>
              </div>
              <NumberInput step="0.1" min="0" max="4" value={probationThreshold} onChange={(e) => setProbationThreshold(e.target.value)} placeholder="e.g., 2.0" className="w-full" />
            </div>

            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 shrink-0">
                  <UserIcon size={20} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Probation Registration Limit</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">Maximum credits a student on probation can register</p>
                </div>
              </div>
              <NumberInput min="0" value={probationRegistrationLimit} onChange={(e) => setProbationRegistrationLimit(e.target.value)} placeholder="e.g., 12" className="w-full" />
            </div>
          </div>
        </Section>
      )}

      {/* ═══ Academic Levels ═══ */}
      {activeTab === "levels" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              {levelScales.length} level scale{levelScales.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" type="button" onClick={addLevelScale}>
                <PlusIcon size={16} />
                Add Level
              </Button>
              <Button variant="primary" type="button" onClick={handleSaveLevels} disabled={savingLevelScales}>
                <FloppyDiskIcon size={16} />
                {savingLevelScales ? "Saving..." : "Save Levels"}
              </Button>
            </div>
          </div>

          {levelScales.length === 0 ? (
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
              No level scales defined. Click "Add Level" to add one.
            </p>
          ) : (
            <div ref={cardsContainerRef} className="space-y-3">
              {paginatedLevelScales.map((scale, idx) => (
                <LevelScaleCard key={idx} scale={scale} index={(levelScalesPage - 1) * itemsPerPage + idx} onChange={updateLevelScale} onRemove={removeLevelScale} />
              ))}
            </div>
          )}

          {levelScales.length > itemsPerPage && (
            <div className="mt-4">
              <PaginationButtons
                totalPages={levelScalesTotalPages}
                currentPage={levelScalesPage}
                setCurrentPage={setLevelScalesPage}
                from={(levelScalesPage - 1) * itemsPerPage + 1}
                to={Math.min(levelScalesPage * itemsPerPage, levelScales.length)}
                total={levelScales.length}
                label="level scales"
              />
            </div>
          )}

        </Section>
      )}

      {/* ═══ Major Declaration Rules ═══ */}
      {activeTab === "majorDeclaration" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              Major Declaration Rules
            </span>
            <Button variant="primary" type="button" onClick={handleSaveMinHours} disabled={savingMinHours}>
              <FloppyDiskIcon size={16} />
              {savingMinHours ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                  <UserIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Department</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Minimum passed credits to choose a department</p>
                </div>
              </div>
              <NumberInput min="0" value={minHoursToChooseDepartment} onChange={(e) => setMinHoursToChooseDepartment(e.target.value)} placeholder="Enter minimum credits..." className="w-full" />
            </div>

            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                  <CheckIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Specialization</h3>
                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Minimum passed credits to choose a specialization</p>
                </div>
              </div>
              <NumberInput min="0" value={minHoursToChooseSpecialization} onChange={(e) => setMinHoursToChooseSpecialization(e.target.value)} placeholder="Enter minimum credits..." className="w-full" />
            </div>
          </div>

          {/* Specializations Table per Department */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mb-1">
              Specialization Prerequisites
            </h3>
            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-4">
              Set required courses and minimum grades for each specialization declaration
            </p>

            {deptSpecsLoading ? (
              <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-8 text-center">
                Loading specializations...
              </p>
            ) : allDepartments.length === 0 ? (
              <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-8 text-center border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                No departments found.
              </p>
            ) : (
              <div className="space-y-6">
                {allDepartments.map((dept) => {
                  const deptId = dept.departmentId ?? dept.id;
                  const specs = deptSpecializations[deptId] || [];
                  if (specs.length === 0) return null;
                  return (
                    <div key={deptId} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                      <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
                        <span className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wider">
                          {dept.departmentName || dept.name || `Department #${deptId}`}
                        </span>
                        <span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                          ({specs.length} specialization{specs.length !== 1 ? "s" : ""})
                        </span>
                      </div>
                      <div className="divide-y divide-border-primary-default-light dark:divide-border-primary-default-dark">
                        {specs.map((spec) => {
                          const specId = spec.specializationId ?? spec.id;
                          const prereqs = specPrerequisites[specId] || [];
                          const hasPrereqs = prereqs.length > 0;
                          return (
                            <div key={specId} className="flex items-center gap-4 px-4 py-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                  {spec.name}
                                </p>
                                {spec.nameAr && (
                                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark" dir="rtl">
                                    {spec.nameAr}
                                  </p>
                                )}
                                {hasPrereqs && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {prereqs.map((pr, i) => {
                                      const course = allCourses.find(c => c.courseId === pr.courseId);
                                      return (
                                        <span key={i} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark">
                                          {course?.courseCode || `#${pr.courseId}`}
                                          {pr.minGrade != null && <span className="opacity-70">≥{pr.minGrade}</span>}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const existing = specPrerequisites[specId] || [];
                                  setSpecPrereqTarget({ deptId, specId, specName: spec.name });
                                  setSpecPrereqSelectedCourses(existing.map(p => p.courseId));
                                  setSpecPrereqMinGrades(existing.reduce((acc, p) => {
                                    acc[p.courseId] = p.minGrade ?? "";
                                    return acc;
                                  }, {}));
                                  setSpecPrereqSearchQuery("");
                                }}
                                className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors"
                              >
                                <LinkIcon size={14} className="inline mr-1" />
                                {hasPrereqs ? "Edit Prerequisites" : "Set Prerequisites"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ═══ Course Mapping ═══ */}
      {activeTab === "courseMapping" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              Course Mapping
            </span>
            <Button variant="primary" type="button" onClick={handleSaveCourseMapping} disabled={savingCourseMapping}>
              <FloppyDiskIcon size={16} />
              {savingCourseMapping ? "Saving..." : "Save"}
            </Button>
          </div>

          {allCoursesLoading ? (
            <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center">
              Loading courses...
            </p>
          ) : (
            <div className="space-y-6">
              <CourseMappingTable
                title="University Required Courses"
                items={universityRequired}
                allCourses={allCourses}
                onAdd={() => openCourseSelect("university")}
                onRemove={(idx) => removeCourseMappingRow(universityRequired, setUniversityRequired, idx)}
                onSetPrerequisites={openPrereqSelect}
              />
              <CourseMappingTable
                title="College Required Courses"
                items={collegeRequired}
                allCourses={allCourses}
                onAdd={() => openCourseSelect("college")}
                onRemove={(idx) => removeCourseMappingRow(collegeRequired, setCollegeRequired, idx)}
                onSetPrerequisites={openPrereqSelect}
              />
              <CourseMappingTable
                title="Major Required Courses"
                items={majorRequired}
                allCourses={allCourses}
                onAdd={() => openCourseSelect("major")}
                onRemove={(idx) => removeCourseMappingRow(majorRequired, setMajorRequired, idx)}
                onSetPrerequisites={openPrereqSelect}
              />
            </div>
          )}
          {/* Buckets Section */}
          {buckets.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
                  Course Buckets
                </span>
                <Button variant="secondary" type="button" onClick={createBucket}>
                  <PlusIcon size={14} />
                  Create Bucket
                </Button>
              </div>
              <div className="space-y-4">
                {buckets.map((bucket, bi) => (
                  <div key={bucket.id} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark flex-wrap">
                      <span className="text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark uppercase tracking-wider shrink-0">
                        Bucket #{bi + 1}
                      </span>
                      <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate max-w-40">
                        {bucket.name || "Untitled"}
                      </span>
                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                        <Button variant="secondary" type="button" onClick={() => openBucketCourseSelect(bucket.id)}>
                          <PlusIcon size={14} />
                          Add Courses
                        </Button>
                        <button
                          type="button"
                          onClick={() => setEditingBucket(bucket)}
                          className="p-1.5 rounded-lg text-text-secondary-default-light dark:text-text-secondary-default-dark hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
                          title="Edit bucket"
                        >
                          <PenSquareIcon size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBucket(bucket.id)}
                          className="p-1.5 rounded-lg text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Remove bucket"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      {/* Min courses bar */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark flex-wrap">
                        <label className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">
                          Minimum selection:
                        </label>
                        <NumberInput
                          min="1"
                          max={bucket.courseIds.length || 1}
                          value={bucket.minCourses}
                          onChange={(e) => updateBucket(bucket.id, "minCourses", parseInt(e.target.value) || 1)}
                          className="w-16"
                        />
                        <span className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">
                          / {bucket.courseIds.length} course{bucket.courseIds.length !== 1 ? "s" : ""}
                        </span>
                        {bucket.courseIds.length > 0 && bucket.minCourses > bucket.courseIds.length && (
                          <span className="text-xs text-text-danger-default-light dark:text-text-danger-default-dark">(exceeds available courses)</span>
                        )}
                      </div>

                      {/* Courses */}
                      {bucket.courseIds.length === 0 ? (
                        <p className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark py-3 text-center border border-dashed border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg">
                          No courses in this bucket. Click "Add Courses" to select courses.
                        </p>
                      ) : (
                        <div className="divide-y divide-border-primary-default-light dark:divide-border-primary-default-dark -mx-4 -mb-4">
                          {bucket.courseIds.map((item) => {
                            const course = allCourses.find(c => c.courseId === item.courseId);
                            return (
                              <div key={item.courseId} className="flex items-center gap-4 px-4 py-2.5">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                                    {course?.courseName || "Unknown Course"}
                                  </p>
                                  <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                                    {course?.courseCode || `#${item.courseId}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <label className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">
                                    Credits:
                                  </label>
                                  <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark w-8 text-center">
                                    {course?.creditHours ?? item.creditHours ?? "—"}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeBucketCourse(bucket.id, item.courseId)}
                                  className="shrink-0 p-1.5 rounded-lg text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                  title="Remove course"
                                >
                                  <TrashIcon size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {buckets.length === 0 && (
            <div className="mt-6">
              <Button variant="secondary" type="button" onClick={createBucket}>
                <PlusIcon size={14} />
                Create Bucket
              </Button>
            </div>
          )}
        </Section> 
      )}

      {/* Course Selection Overlay */}
      {courseSelectTarget && (
        <ModelOverlay onClose={() => setCourseSelectTarget(null)} maxWidth="max-w-2xl">
          <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
              <h2 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                Select Courses
              </h2>
              <button type="button" onClick={() => setCourseSelectTarget(null)} className="p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <input
                type="text"
                value={courseSearchQuery}
                onChange={(e) => setCourseSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className={`w-full ${inputClass}`}
              />
            </div>

            {/* Course List */}
            <div className="flex-1 overflow-y-auto px-5 space-y-1 min-h-0 no-scrollbar">
              {allCourses
                .filter((c) =>
                  !courseSearchQuery ||
                  c.courseName?.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                  c.courseCode?.toLowerCase().includes(courseSearchQuery.toLowerCase())
                )
                .map((course) => {
                  const isSelected = selectedCourseIds.includes(course.courseId);
                  return (
                    <label
                      key={course.courseId}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark"
                          : "hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedCourseIds(prev => {
                            const next = isSelected
                              ? prev.filter(id => id !== course.courseId)
                              : [...prev, course.courseId];
                            return next;
                          });
                        }}
                        className="rounded border-border-primary-default-light dark:border-border-primary-default-dark text-text-accent-active-light focus:ring-text-accent-active-light"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                          {course.courseCode}{course.creditHours ? ` • ${course.creditHours} Credits` : ""}
                        </p>
                      </div>
                    </label>
                  );
                })}
              {allCourses.filter((c) =>
                !courseSearchQuery ||
                c.courseName?.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                c.courseCode?.toLowerCase().includes(courseSearchQuery.toLowerCase())
              ).length === 0 && (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center">
                  No courses found.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
              <button
                type="button"
                onClick={() => setCourseSelectTarget(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCourseSelection}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white hover:bg-bg-fill-accent-hover-light dark:hover:bg-bg-fill-accent-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedCourseIds.length === 0}
              >
                Add ({selectedCourseIds.length})
              </button>
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* Prerequisite Selection Overlay */}
      {prereqTarget && (
        <ModelOverlay onClose={() => setPrereqTarget(null)} maxWidth="max-w-2xl">
          <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
              <h2 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                Set Prerequisites
              </h2>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark ml-2 truncate">
                for {allCourses.find(c => c.courseId === prereqTarget)?.courseName || "course"}
              </p>
              <button type="button" onClick={() => setPrereqTarget(null)} className="ml-auto p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <input
                type="text"
                value={prereqSearchQuery}
                onChange={(e) => setPrereqSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className={`w-full ${inputClass}`}
              />
            </div>

            {/* Course List */}
            <div className="flex-1 overflow-y-auto px-5 space-y-1 min-h-0 no-scrollbar">
              {allCourses
                .filter((c) => c.courseId !== prereqTarget)
                .filter((c) =>
                  !prereqSearchQuery ||
                  c.courseName?.toLowerCase().includes(prereqSearchQuery.toLowerCase()) ||
                  c.courseCode?.toLowerCase().includes(prereqSearchQuery.toLowerCase())
                )
                .map((course) => {
                  const isSelected = prereqSelectedIds.includes(course.courseId);
                  return (
                    <label
                      key={course.courseId}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark"
                          : "hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setPrereqSelectedIds(prev =>
                            isSelected
                              ? prev.filter(id => id !== course.courseId)
                              : [...prev, course.courseId]
                          );
                        }}
                        className="rounded border-border-primary-default-light dark:border-border-primary-default-dark text-text-accent-active-light focus:ring-text-accent-active-light"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                          {course.courseCode}{course.creditHours ? ` • ${course.creditHours} Credits` : ""}
                        </p>
                      </div>
                    </label>
                  );
                })}
              {allCourses.filter((c) => c.courseId !== prereqTarget).filter((c) =>
                !prereqSearchQuery ||
                c.courseName?.toLowerCase().includes(prereqSearchQuery.toLowerCase()) ||
                c.courseCode?.toLowerCase().includes(prereqSearchQuery.toLowerCase())
              ).length === 0 && (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center">
                  No courses found.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
              <button
                type="button"
                onClick={() => setPrereqTarget(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPrereqSelection}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white hover:bg-bg-fill-accent-hover-light dark:hover:bg-bg-fill-accent-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save ({prereqSelectedIds.length})
              </button>
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* Bucket Course Selection Overlay */}
      {bucketCourseTarget && (
        <ModelOverlay onClose={() => setBucketCourseTarget(null)} maxWidth="max-w-2xl">
          <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
              <h2 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                Select Courses for Bucket
              </h2>
              <button type="button" onClick={() => setBucketCourseTarget(null)} className="p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <input
                type="text"
                value={bucketSearchQuery}
                onChange={(e) => setBucketSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className={`w-full ${inputClass}`}
              />
            </div>

            {/* Course List */}
            <div className="flex-1 overflow-y-auto px-5 space-y-1 min-h-0 no-scrollbar">
              {allCourses
                .filter((c) =>
                  !bucketSearchQuery ||
                  c.courseName?.toLowerCase().includes(bucketSearchQuery.toLowerCase()) ||
                  c.courseCode?.toLowerCase().includes(bucketSearchQuery.toLowerCase())
                )
                .map((course) => {
                  const isSelected = bucketSelectedIds.includes(course.courseId);
                  return (
                    <label
                      key={course.courseId}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark"
                          : "hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setBucketSelectedIds(prev =>
                            isSelected
                              ? prev.filter(id => id !== course.courseId)
                              : [...prev, course.courseId]
                          );
                        }}
                        className="rounded border-border-primary-default-light dark:border-border-primary-default-dark text-text-accent-active-light focus:ring-text-accent-active-light"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                          {course.courseName}
                        </p>
                        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                          {course.courseCode}{course.creditHours ? ` • ${course.creditHours} Credits` : ""}
                        </p>
                      </div>
                    </label>
                  );
                })}
              {allCourses.filter((c) =>
                !bucketSearchQuery ||
                c.courseName?.toLowerCase().includes(bucketSearchQuery.toLowerCase()) ||
                c.courseCode?.toLowerCase().includes(bucketSearchQuery.toLowerCase())
              ).length === 0 && (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center">
                  No courses found.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
              <button
                type="button"
                onClick={() => setBucketCourseTarget(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmBucketCourseSelection}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white hover:bg-bg-fill-accent-hover-light dark:hover:bg-bg-fill-accent-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={bucketSelectedIds.length === 0}
              >
                Add ({bucketSelectedIds.length})
              </button>
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* New Bucket Form Overlay */}
      {isNewBucketOpen && (
        <ModelOverlay onClose={() => { setIsNewBucketOpen(false); setNewBucketForm({ name: "", nameAr: "", department: "", departmentId: null }); }} maxWidth="max-w-lg">
          <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
              <h2 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                Create New Bucket
              </h2>
              <button type="button" onClick={() => { setIsNewBucketOpen(false); setNewBucketForm({ name: "", nameAr: "", department: "", departmentId: null }); }} className="p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
                  Elective Courses Bucket
                </label>
                <input
                  type="text"
                  value={newBucketForm.name}
                  onChange={(e) => setNewBucketForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter elective courses bucket name..."
                  className={inputClass}
                  autoFocus
                  />
                </div>

                <div dir="rtl">
                  <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
                    حزمة المقررات الاختيارية
                  </label>
                  <input
                    type="text"
                    value={newBucketForm.nameAr}
                    onChange={(e) => setNewBucketForm(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="أدخل اسم حزمة المقررات الاختيارية..."
                    className={inputClass}
                  />
                </div>
              </div>

              <SelectBox
                className="w-full"
                label="Department"
                name="bucketDepartment"
                labelDirection="flex-col"
                options={[
                  { value: "", label: "All Departments" },
                  ...bucketDepartments.map(d => ({ value: d.departmentName || d.name, label: d.departmentName || d.name }))
                ]}
                selectedOption={bucketDepartments.find(d => (d.departmentName || d.name) === newBucketForm.department) || { value: "", label: "All Departments" }}
                onChange={(opt) => {
                  const deptObj = bucketDepartments.find(d => (d.departmentName || d.name) === opt.value);
                  setNewBucketForm(prev => ({ ...prev, department: opt.value || "", departmentId: deptObj?.departmentId || deptObj?.id || null }));
                }}
              />
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 py-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
              <button
                type="button"
                onClick={() => { setIsNewBucketOpen(false); setNewBucketForm({ name: "", nameAr: "", department: "", departmentId: null }); }}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmNewBucket}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white hover:bg-bg-fill-accent-hover-light dark:hover:bg-bg-fill-accent-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newBucketForm.name.trim()}
              >
                Create Bucket
              </button>
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* Edit Bucket Overlay */}
      {editingBucket && (
        <ModelOverlay onClose={() => setEditingBucket(null)} maxWidth="max-w-lg">
          <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
              <h2 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">
                Edit Bucket
              </h2>
              <button type="button" onClick={() => setEditingBucket(null)} className="p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors">
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
                    Bucket Name
                  </label>
                  <input
                    type="text"
                    value={editingBucket.name}
                    onChange={(e) => setEditingBucket(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter bucket name..."
                    className={inputClass}
                    autoFocus
                  />
                </div>
                <div dir="rtl">
                  <label className="block text-sm font-medium mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
                    اسم الحزمة
                  </label>
                  <input
                    type="text"
                    value={editingBucket.nameAr || ""}
                    onChange={(e) => setEditingBucket(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder="أدخل اسم الحزمة بالعربية..."
                    className={inputClass}
                  />
                </div>
              </div>

              <SelectBox
                className="w-full"
                label="Department"
                name="editBucketDepartment"
                labelDirection="flex-col"
                options={[
                  { value: "", label: "All Departments" },
                  ...bucketDepartments.map(d => ({ value: d.departmentName || d.name, label: d.departmentName || d.name }))
                ]}
                selectedOption={bucketDepartments.find(d => (d.departmentName || d.name) === editingBucket.department) || { value: "", label: "All Departments" }}
                onChange={(opt) => {
                  const deptObj = bucketDepartments.find(d => (d.departmentName || d.name) === opt.value);
                  setEditingBucket(prev => ({
                    ...prev,
                    department: opt.value || "",
                    departmentId: deptObj?.departmentId || deptObj?.id || null,
                  }));
                }}
              />
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
              <button
                type="button"
                onClick={() => setEditingBucket(null)}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!editingBucket.name.trim()) return;
                  setBuckets(prev => prev.map(b => b.id === editingBucket.id ? editingBucket : b));
                  setEditingBucket(null);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white hover:bg-bg-fill-accent-hover-light dark:hover:bg-bg-fill-accent-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!editingBucket.name.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* ═══ Bylaw Details ═══ */}
      {activeTab === "bylawDetails" && (
        <Section>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark">
              Bylaw Details
            </span>
            <Button variant="primary" type="button" onClick={handleSaveBylawDetails} disabled={savingBylawDetails}>
              <FloppyDiskIcon size={16} />
              {savingBylawDetails ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
              <label className="block text-sm font-semibold mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
                Bylaw Name
              </label>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
                The official name of this academic bylaw
              </p>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={inputClass}
                placeholder="e.g., Credit Hour System"
              />
            </div>

            <div className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5" dir="rtl">
              <label className="block text-sm font-semibold mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
                اسم اللائحة
              </label>
              <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
                الاسم الرسمي لهذه اللائحة الأكاديمية
              </p>
              <input
                type="text"
                value={editNameAr}
                onChange={(e) => setEditNameAr(e.target.value)}
                className={inputClass}
                placeholder="نظام الساعات المعتمدة"
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark shrink-0">
                <ClipboardCheckIcon size={20} className="text-text-accent-active-light dark:text-text-accent-active-dark" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary-default-light dark:text-text-primary-default-dark">Bylaw Type</h3>
                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Academic program type</p>
              </div>
            </div>
            <SelectBox
              className="w-full"
              name="type"
              labelDirection="flex-col"
              showLabel={false}
              options={bylawTypes}
              selectedOption={selectedBylawType}
              onChange={(option) => setSelectedBylawType(option)}
            />
          </div>

          <div className="mt-6 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
            <label className="block text-sm font-semibold mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
              Description
            </label>
            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
              Describe the purpose and scope of this bylaw
            </p>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light resize-none"
              placeholder="Describe the bylaw purpose and scope"
            />
          </div>

          <div className="mt-6 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5" dir="rtl">
            <label className="block text-sm font-semibold mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
              الوصف
            </label>
            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
              وصف الغرض من هذه اللائحة ونطاقها
            </p>
            <textarea
              value={editDescriptionAr}
              onChange={(e) => setEditDescriptionAr(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-md bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark focus:outline-none focus:border-border-primary-active-light resize-none"
              placeholder="وصف الغرض من اللائحة ونطاقها"
            />
          </div>

          <div className="mt-6 rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
            <label className="block text-sm font-semibold mb-1.5 text-text-primary-default-light dark:text-text-primary-default-dark">
              Documents
            </label>
            <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2">
              Upload bylaw documents (PDF, DOC). Click on a document to preview.
            </p>

            {/* Existing documents */}
            {bylaw.fileName && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setDocumentPreviewTarget(bylaw)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors w-full text-left"
                >
                  <FileIcon size={18} className="shrink-0 text-text-accent-active-light dark:text-text-accent-active-dark" />
                  <span className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate flex-1">
                    {bylaw.fileName}
                  </span>
                  <span className="text-[10px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark uppercase shrink-0">Click to preview</span>
                </button>
              </div>
            )}

            {/* New files to upload */}
            {newFiles.length > 0 && (
              <div className="mb-3 space-y-1.5">
                {newFiles.map((file, fi) => (
                  <div key={fi} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark border border-border-accent-default-light dark:border-border-accent-default-dark">
                    <FileIcon size={16} className="shrink-0 text-text-accent-active-light dark:text-text-accent-active-dark" />
                    <span className="text-sm text-text-primary-default-light dark:text-text-primary-default-dark truncate flex-1">{file.name}</span>
                    <span className="text-[10px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">({(file.size / 1024).toFixed(0)} KB)</span>
                    <button
                      type="button"
                      onClick={() => setNewFiles(prev => prev.filter((_, i) => i !== fi))}
                      className="shrink-0 p-1 rounded-md text-text-danger-default-light dark:text-text-danger-default-dark hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Choose File button */}
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-sm text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-accent-default-light dark:hover:bg-bg-surface-accent-default-dark transition-colors cursor-pointer">
              <CloudUploadIcon size={18} />
              {newFiles.length > 0 ? "Add Another File" : "Choose File"}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setNewFiles(prev => [...prev, ...files]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="hidden"
              />
            </label>
          </div>
        </Section>
      )}

      {/* Document Preview Overlay */}
      {documentPreviewTarget && (
        <ModelOverlay onClose={() => setDocumentPreviewTarget(null)} maxWidth="max-w-5xl">
          <div className="w-full rounded-2xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark shadow-[0_32px_80px_-12px_rgba(0,0,0,0.28)]">
            <div className="flex items-center justify-between gap-4 border-b border-border-primary-default-light px-6 py-4 dark:border-border-primary-default-dark">
              <h3 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                {documentPreviewTarget.fileName || "Document Preview"}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId ?? documentPreviewTarget.id}/download`}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <DownloadIcon size={16} />
                  Download
                </a>
                <button
                  type="button"
                  onClick={() => setDocumentPreviewTarget(null)}
                  className="rounded-lg border border-border-primary-default-light bg-bg-surface-secondary-default-light p-2 text-icon-secondary-default-light transition-colors hover:bg-bg-surface-secondary-hover-light dark:border-border-primary-default-dark dark:bg-bg-surface-secondary-default-dark dark:text-icon-secondary-default-dark dark:hover:bg-bg-surface-secondary-hover-dark"
                >
                  <XIcon size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <MaterialPreview
                type={0}
                title={documentPreviewTarget.fileName || "document"}
                viewUrl={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId ?? documentPreviewTarget.id}/download`}
                downloadUrl={`${API_URL}/api/Bylaw/${documentPreviewTarget.bylawId ?? documentPreviewTarget.id}/download`}
              />
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* Specialization Prerequisite Selection Overlay */}
      {specPrereqTarget && (
        <ModelOverlay onClose={() => { setSpecPrereqTarget(null); setSpecPrereqSelectedCourses([]); setSpecPrereqMinGrades({}); }} maxWidth="max-w-2xl">
          <div className="w-full bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                  Set Prerequisites
                </h2>
                <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark truncate">
                  for {specPrereqTarget.specName}
                </p>
              </div>
              <button type="button" onClick={() => { setSpecPrereqTarget(null); setSpecPrereqSelectedCourses([]); setSpecPrereqMinGrades({}); }} className="ml-auto p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors shrink-0">
                <XIcon size={20} />
              </button>
            </div>

            <div className="px-5 py-3">
              <input
                type="text"
                value={specPrereqSearchQuery}
                onChange={(e) => setSpecPrereqSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className={`w-full ${inputClass}`}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-5 space-y-2 min-h-0 no-scrollbar">
              {allCourses
                .filter((c) =>
                  !specPrereqSearchQuery ||
                  c.courseName?.toLowerCase().includes(specPrereqSearchQuery.toLowerCase()) ||
                  c.courseCode?.toLowerCase().includes(specPrereqSearchQuery.toLowerCase())
                )
                .map((course) => {
                  const isSelected = specPrereqSelectedCourses.includes(course.courseId);
                  const sortedGrades = [...gradeScales]
                    .filter(g => g.gradeLetter.trim())
                    .sort((a, b) => b.sortOrder - a.sortOrder);
                  const gradeOptions = sortedGrades.map(g => ({
                    value: g.gradeLetter,
                    label: g.gradeLetter,
                  }));
                  const passingIndex = sortedGrades.findIndex(
                    g => g.gradeLetter?.toLowerCase() === minPassingGradeLetter?.toLowerCase()
                  );
                  const minGradeLetter = passingIndex >= 0 ? sortedGrades[passingIndex].gradeLetter : (sortedGrades[sortedGrades.length - 1]?.gradeLetter || "");
                  const selectedGrade = specPrereqMinGrades[course.courseId]
                    ? gradeOptions.find(o => o.value === specPrereqMinGrades[course.courseId]) || null
                    : null;
                  return (
                    <div
                      key={course.courseId}
                      className={`rounded-lg border transition-colors ${
                        isSelected
                          ? "border-border-accent-default-light dark:border-border-accent-default-dark bg-bg-surface-accent-default-light dark:bg-bg-surface-accent-default-dark"
                          : "border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-surface-secondary-default-light dark:hover:bg-bg-surface-secondary-default-dark"
                      }`}
                    >
                      <label className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSpecPrereqSelectedCourses(prev =>
                              isSelected
                                ? prev.filter(id => id !== course.courseId)
                                : [...prev, course.courseId]
                            );
                            if (isSelected) {
                              setSpecPrereqMinGrades(prev => {
                                const next = { ...prev };
                                delete next[course.courseId];
                                return next;
                              });
                            } else {
                              setSpecPrereqMinGrades(prev => ({
                                ...prev,
                                [course.courseId]: minGradeLetter,
                              }));
                            }
                          }}
                          className="rounded border-border-primary-default-light dark:border-border-primary-default-dark text-text-accent-active-light focus:ring-text-accent-active-light"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary-default-light dark:text-text-primary-default-dark truncate">
                            {course.courseName}
                          </p>
                          <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
                            {course.courseCode}{course.creditHours ? ` • ${course.creditHours} Credits` : ""}
                          </p>
                        </div>
                      </label>
                      {isSelected && (
                        <div className="px-3 pb-3 pt-0 border-t border-border-primary-default-light dark:border-border-primary-default-dark mx-3">
                          <div className="flex items-center gap-3 mt-2">
                            <label className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">
                              Min Grade for {course.courseCode || course.courseName}:
                            </label>
                            <SelectBox
                              options={gradeOptions}
                              selectedOption={selectedGrade}
                              onChange={(opt) => setSpecPrereqMinGrades(prev => ({
                                ...prev,
                                [course.courseId]: opt.value,
                              }))}
                              compact
                              showLabel={false}
                              className="w-24"
                            />
                            <span className="text-[10px] text-text-tertiary-default-light dark:text-text-tertiary-default-dark">
                              (passing is {minGradeLetter})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              {allCourses.filter((c) =>
                !specPrereqSearchQuery ||
                c.courseName?.toLowerCase().includes(specPrereqSearchQuery.toLowerCase()) ||
                c.courseCode?.toLowerCase().includes(specPrereqSearchQuery.toLowerCase())
              ).length === 0 && (
                <p className="text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark py-4 text-center">
                  No courses found.
                </p>
              )}
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
              <button
                type="button"
                onClick={() => { setSpecPrereqTarget(null); setSpecPrereqSelectedCourses([]); setSpecPrereqMinGrades({}); }}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark hover:bg-bg-surface-tertiary-default-light dark:hover:bg-bg-surface-tertiary-default-dark transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSpecPrereqSelection}
                className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-white hover:bg-bg-fill-accent-hover-light dark:hover:bg-bg-fill-accent-hover-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save ({specPrereqSelectedCourses.length})
              </button>
            </div>
          </div>
        </ModelOverlay>
      )}

      {/* Toggle Active Confirmation */}
      <Dialog
        isOpen={isToggleActiveOpen}
        variant="warning"
        title={bylaw.isActive ? "Deactivate Bylaw" : "Activate Bylaw"}
        onClose={() => setIsToggleActiveOpen(false)}
        onConfirm={() => { handleToggleActive(); return true; }}
        confirmText={bylaw.isActive ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        showCloseButton={true}
      >
        Are you sure you want to <strong>{bylaw.isActive ? "deactivate" : "activate"}</strong>{" "}
        <strong>{bylaw.name}</strong>?
      </Dialog>
    </div>
  );
}
