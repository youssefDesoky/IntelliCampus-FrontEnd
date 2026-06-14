import { useState, useMemo, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import WeeklySchedule from "../../../components/ui/WeeklySchedule";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import DateInput from "../../../components/form/DateInput";
import TimeInput from "../../../components/form/TimeInput";
import { CalendarIcon } from "../../../components/ui/icons";

const COURSES = [
  { id: 1,  name: "قواعد البيانات",           code: "CS301" },
  { id: 2,  name: "هياكل البيانات",           code: "CS201" },
  { id: 3,  name: "شبكات الحاسب",             code: "CS401" },
  { id: 4,  name: "الخوارزميات",              code: "CS302" },
  { id: 5,  name: "ذكاء اصطناعي",             code: "CS501" },
  { id: 6,  name: "نظم التشغيل",              code: "CS402" },
  { id: 7,  name: "برمجة متقدمة",             code: "CS202" },
  { id: 8,  name: "رياضيات تطبيقية",          code: "MATH301" },
  { id: 9,  name: "Introduction to Programming", code: "CS101" },
  { id: 10, name: "Object-Oriented Programming", code: "CS102" },
  { id: 11, name: "Data Structures & Algorithms", code: "CS210" },
  { id: 12, name: "Computer Architecture",      code: "CS220" },
  { id: 13, name: "Database Management Systems", code: "CS330" },
  { id: 14, name: "Software Engineering",       code: "CS350" },
  { id: 15, name: "Computer Networks",          code: "CS410" },
  { id: 16, name: "Operating Systems",          code: "CS420" },
  { id: 17, name: "Machine Learning",           code: "CS450" },
  { id: 18, name: "Compiler Design",            code: "CS460" },
  { id: 19, name: "Computer Security",          code: "CS470" },
  { id: 20, name: "Web Development",            code: "CS480" },
  { id: 21, name: "Mobile App Development",     code: "CS490" },
  { id: 22, name: "Cloud Computing",            code: "CS510" },
  { id: 23, name: "Computer Graphics",          code: "CS520" },
  { id: 24, name: "Natural Language Processing", code: "CS530" },
  { id: 25, name: "Calculus I",                 code: "MATH101" },
  { id: 26, name: "Calculus II",                code: "MATH102" },
  { id: 27, name: "Linear Algebra",             code: "MATH201" },
  { id: 28, name: "Probability & Statistics",   code: "MATH202" },
  { id: 29, name: "Discrete Mathematics",       code: "MATH205" },
  { id: 30, name: "Physics I",                  code: "PHYS101" },
  { id: 31, name: "Physics II",                 code: "PHYS102" },
  { id: 32, name: "Digital Logic",              code: "EE200" },
  { id: 33, name: "Electronics",                code: "EE210" },
  { id: 34, name: "Signal Processing",          code: "EE310" },
  { id: 35, name: "Microprocessors",            code: "EE320" },
  { id: 36, name: "Technical Writing",          code: "ENG101" },
  { id: 37, name: "Professional Ethics",        code: "ENG105" },
  { id: 38, name: "Project Management",         code: "ENG201" },
];

function buildEnrollments() {
  const e = {};
  for (let s = 1; s <= 40; s++) e[s] = [];
  const assignments = [
    [1,2,7,9,10,25],    [1,2,6,11,12,30],  [1,3,8,13,14,31], [1,3,15,16,32,33],
    [1,4,17,18,29,34],  [1,4,7,19,20,35],  [1,5,21,22,36,37], [1,5,8,23,24,38],
    [2,3,9,11,25,26],   [2,4,10,12,27,28], [2,5,7,13,15,30],  [2,6,8,14,16,31],
    [3,4,17,19,26,32],  [3,5,18,20,27,33], [3,6,21,23,28,34], [4,5,8,22,24,29],
    [4,6,9,14,25,35],   [5,6,10,13,36,37], [6,7,11,16,26,38], [7,8,12,15,27,30],
    [9,10,11,25,26,36], [12,13,14,27,28,29],[15,16,17,30,31,32],[18,19,20,33,34,35],
    [21,22,23,24,37,38],[9,12,15,18,21,25], [10,13,16,19,22,26],[11,14,17,20,23,27],
    [24,28,29,30,31,32],[33,34,35,36,37,38],[9,10,15,20,25,30], [11,12,16,19,28,35],
    [13,17,21,24,32,36],[14,18,22,23,31,38],[19,24,26,27,33,37],[20,21,25,29,34,38],
    [1,9,17,25,33,36],  [2,10,18,26,34,37], [3,11,19,27,35,38], [4,12,20,28,30,31],
  ];
  assignments.forEach((courses, i) => { e[i + 1] = courses; });
  return e;
}

const ENROLLMENTS = buildEnrollments();

const DAY_MAP = { d1: "sat", d2: "sun", d3: "mon", d4: "tue", d5: "wed", d6: "thu", d7: "sat", d8: "sun", d9: "mon", d10: "tue", d11: "wed", d12: "thu", d13: "sat", d14: "sun", d15: "mon" };

const DATES = [
  { key: "d1",  label: "Sat 1/6",  date: "2024-06-01" },
  { key: "d2",  label: "Sun 2/6",  date: "2024-06-02" },
  { key: "d3",  label: "Mon 3/6",  date: "2024-06-03" },
  { key: "d4",  label: "Tue 4/6",  date: "2024-06-04" },
  { key: "d5",  label: "Wed 5/6",  date: "2024-06-05" },
  { key: "d6",  label: "Thu 6/6",  date: "2024-06-06" },
  { key: "d7",  label: "Sat 8/6",  date: "2024-06-08" },
  { key: "d8",  label: "Sun 9/6",  date: "2024-06-09" },
  { key: "d9",  label: "Mon 10/6", date: "2024-06-10" },
  { key: "d10", label: "Tue 11/6", date: "2024-06-11" },
  { key: "d11", label: "Wed 12/6", date: "2024-06-12" },
  { key: "d12", label: "Thu 13/6", date: "2024-06-13" },
  { key: "d13", label: "Sat 15/6", date: "2024-06-15" },
  { key: "d14", label: "Sun 16/6", date: "2024-06-16" },
  { key: "d15", label: "Mon 17/6", date: "2024-06-17" },
];

function to12Hour(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function parseMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function fmtLabel(slot) {
  if (!slot.startTime || !slot.endTime) return "No time set";
  return `${to12Hour(slot.startTime)} - ${to12Hour(slot.endTime)}`;
}

function overlaps(a, b) {
  return parseMin(a.startTime) < parseMin(b.endTime) && parseMin(b.startTime) < parseMin(a.endTime);
}

function nextSlotId(defs) {
  const max = defs.reduce((m, s) => Math.max(m, +(s.id.split("_")[1] || 0)), -1);
  return `slot_${max + 1}`;
}

function buildGraph() {
  const g = {};
  COURSES.forEach(c => { g[c.id] = new Set(); });
  Object.values(ENROLLMENTS).forEach(courses => {
    for (let i = 0; i < courses.length; i++)
      for (let j = i + 1; j < courses.length; j++) {
        g[courses[i]].add(courses[j]);
        g[courses[j]].add(courses[i]);
      }
  });
  return g;
}

const MAX_PER_CELL = 5;

function greedy(graph, dateKeys, slotDefs) {
  const days = dateKeys || Object.keys(DAY_MAP);
  const allSlots = days.flatMap(d => slotDefs.map(s => ({ dId: d, sId: s.id })));
  const ordered = [...COURSES].sort((a,b) => graph[b.id].size - graph[a.id].size);
  const schedule = {};
  const cellCount = {};

  for (const course of ordered) {
    const forbidden = new Set();
    graph[course.id].forEach(nId => {
      if (schedule[nId]) forbidden.add(`${schedule[nId].dId}|${schedule[nId].sId}`);
    });
    const pick = allSlots.find(s => {
      const k = `${s.dId}|${s.sId}`;
      return !forbidden.has(k) && (cellCount[k] || 0) < MAX_PER_CELL;
    });
    if (pick) {
      const k = `${pick.dId}|${pick.sId}`;
      cellCount[k] = (cellCount[k] || 0) + 1;
      schedule[course.id] = { dId: pick.dId, sId: pick.sId };
    }
  }
  return schedule;
}

function toWeeklyEvents(schedule, slotDefs) {
  return Object.entries(schedule).map(([cId, pos]) => {
    const course = COURSES.find(c => c.id === +cId);
    const slot = slotDefs.find(s => s.id === pos.sId);
    if (!slot) return null;
    return {
      id: cId,
      day: pos.dId,
      startTime: to12Hour(slot.startTime),
      endTime: to12Hour(slot.endTime),
      title: `${course.code} - ${course.name}`,
      type: "lecture",
    };
  }).filter(Boolean);
}

function getConflicts(courseId, dId, sId, schedule, graph) {
  const result = [];
  graph[courseId].forEach(nId => {
    const ns = schedule[nId];
    if (ns && ns.dId === dId && ns.sId === sId) {
      const course = COURSES.find(c => c.id === nId);
      const shared = Object.values(ENROLLMENTS)
        .filter(cs => cs.includes(courseId) && cs.includes(nId)).length;
      result.push({ course, shared });
    }
  });
  return result;
}

function countStudents(courseId) {
  return Object.values(ENROLLMENTS).filter(cs => cs.includes(courseId)).length;
}

function MovePanel({ course, current, schedule, graph, onMove, onClose, slotDefs }) {
  const [preview, setPreview] = useState(null);

  const previewConflicts = preview
    ? getConflicts(course.id, preview.dId, preview.sId, schedule, graph)
    : [];

  const currentSlot = slotDefs.find(s => s.id === current?.sId);

  return (
    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-2xl shadow-2xl max-w-3xl w-full mx-auto overflow-hidden">
      <div className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Move Exam</p>
          <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-0.5">
            {course.name} <span className="font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark text-xs">({course.code})</span>
          </h3>
          <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">
            Current: {DATES.find(d => d.key === current?.dId)?.label} · {currentSlot ? fmtLabel(currentSlot) : "—"}
          </p>
        </div>
        <button onClick={onClose} className="bg-transparent border-none text-text-secondary-default-light dark:text-text-secondary-default-dark cursor-pointer text-lg p-1 hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark">✕</button>
      </div>

      <div className="p-6">
        {preview && previewConflicts.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 mb-3 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-red-400 font-semibold">⚠️ Conflicts with:</span>
            {previewConflicts.map(({ course: nc, shared }) => (
              <span key={nc.id} className="bg-red-500/15 border border-red-500/30 rounded-md px-2.5 py-1 text-red-400 font-semibold">
                {nc.name} ({shared} shared students)
              </span>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr>
                <th className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2.5 py-2 text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark text-center border-b border-border-primary-default-light dark:border-border-primary-default-dark whitespace-nowrap"></th>
                {slotDefs.map(s => (
                  <th key={s.id} className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2.5 py-2 text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark text-center border-b border-border-primary-default-light dark:border-border-primary-default-dark whitespace-nowrap">{fmtLabel(s)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DATES.map(date => (
                <tr key={date.key}>
                  <td className="px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">{date.label}</td>
                  {slotDefs.map(slot => {
                    const isCurrent = current?.dId === date.key && current?.sId === slot.id;
                    const isPreview = preview?.dId === date.key && preview?.sId === slot.id;
                    const conflicts = getConflicts(course.id, date.key, slot.id, schedule, graph);
                    const hasConflict = conflicts.length > 0;

                    let cellStyle, label, labelColor;
                    if (isCurrent) {
                      cellStyle = "bg-indigo-500/20 border-2 border-indigo-400 cursor-default";
                      label = "Current";
                      labelColor = "text-indigo-300";
                    } else if (hasConflict) {
                      cellStyle = "bg-red-500/10 border border-red-500/40 cursor-not-allowed";
                      label = `✗ ${conflicts.map(x => x.course.name).join(", ")}`;
                      labelColor = "text-red-400";
                    } else if (isPreview) {
                      cellStyle = "bg-emerald-500/20 border-2 border-emerald-500 cursor-pointer";
                      label = "Click to confirm";
                      labelColor = "text-emerald-400";
                    } else {
                      cellStyle = "bg-emerald-500/5 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10";
                      label = "✓ Available";
                      labelColor = "text-emerald-400";
                    }

                    return (
                      <td key={slot.id} className="p-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark align-top min-w-[140px]">
                        <div
                          onClick={() => !hasConflict && !isCurrent && onMove(date.key, slot.id)}
                          onMouseEnter={() => !hasConflict && !isCurrent && setPreview({ dId: date.key, sId: slot.id })}
                          onMouseLeave={() => setPreview(null)}
                          className={`rounded-lg p-2 text-center min-h-[54px] flex flex-col items-center justify-center transition-all duration-150 ${cellStyle}`}
                        >
                          <span className={`text-xs font-semibold leading-tight ${labelColor}`}>{label}</span>
                          {!hasConflict && !isCurrent && (
                            <span className="text-[10px] text-text-secondary-default-light dark:text-text-secondary-default-dark mt-1">{countStudents(course.id)} students</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function nearestDateIdx(picked, all) {
  const p = new Date(picked);
  let best = 0, bestDiff = Infinity;
  all.forEach((d, i) => {
    const diff = Math.abs(new Date(d.date) - p);
    if (diff < bestDiff) { bestDiff = diff; best = i; }
  });
  return best;
}

function AutoScheduleDialog({ dates, initialSlots, onClose, onConfirm }) {
  const [startIdx, setStartIdx] = useState(null);
  const [endIdx, setEndIdx] = useState(null);
  const [slotDefs, setSlotDefs] = useState(() => initialSlots.map(s => ({ ...s })));
  const [errors, setErrors] = useState({});

  const filteredDateKeys = useMemo(() => {
    if (startIdx === null || endIdx === null) return [];
    return dates.slice(startIdx, endIdx + 1).map(d => d.key);
  }, [dates, startIdx, endIdx]);

  const validate = useCallback((defs) => {
    const errs = {};
    for (const s of defs) {
      if (parseMin(s.startTime) >= parseMin(s.endTime)) {
        errs[s.id] = "Start must be before end";
      }
    }
    for (let i = 0; i < defs.length; i++) {
      for (let j = i + 1; j < defs.length; j++) {
        if (overlaps(defs[i], defs[j])) {
          errs[defs[i].id] = errs[defs[i].id] || "Overlaps with another slot";
          errs[defs[j].id] = errs[defs[j].id] || "Overlaps with another slot";
        }
      }
    }
    return errs;
  }, []);

  const handleAdd = () => {
    const id = nextSlotId(slotDefs);
    const newSlot = { id, startTime: "", endTime: "" };
    const next = [...slotDefs, newSlot];
    setSlotDefs(next);
    setErrors(validate(next));
  };

  const handleChange = (id, field, value) => {
    const next = slotDefs.map(s => s.id === id ? { ...s, [field]: value } : s);
    setSlotDefs(next);
    setErrors(validate(next));
  };

  const handleRemove = (id) => {
    const next = slotDefs.filter(s => s.id !== id);
    setSlotDefs(next);
    setErrors(validate(next));
  };

  const hasErrors = Object.keys(errors).length > 0 && slotDefs.some(s => errors[s.id]);

  return (
    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-2xl shadow-2xl max-w-2xl w-full mx-auto overflow-hidden">
      <div className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Auto Schedule</p>
          <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-0.5">Configure Exam Schedule</h3>
        </div>
        <button onClick={onClose} className="bg-transparent border-none text-text-secondary-default-light dark:text-text-secondary-default-dark cursor-pointer text-lg p-1 hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark">✕</button>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <DateInput
            label="Start Date"
            value={startIdx !== null ? dates[startIdx].date : ""}
            min={dates[0].date}
            max={endIdx !== null ? dates[endIdx].date : dates[dates.length - 1].date}
            onChange={e => {
              if (!e.target.value) { setStartIdx(null); return; }
              const v = nearestDateIdx(e.target.value, dates);
              setStartIdx(v);
              if (endIdx === null || v > endIdx) setEndIdx(v);
            }}
          />
          <DateInput
            label="End Date"
            value={endIdx !== null ? dates[endIdx].date : ""}
            min={startIdx !== null ? dates[startIdx].date : dates[0].date}
            max={dates[dates.length - 1].date}
            onChange={e => {
              if (!e.target.value) { setEndIdx(null); return; }
              const v = nearestDateIdx(e.target.value, dates);
              setEndIdx(v);
              if (startIdx === null || v < startIdx) setStartIdx(v);
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">Time Slots</label>
            {slotDefs.length >= 4 ? (
              <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">Max time slots reached</span>
            ) : (
              <button
                onClick={handleAdd}
                className="text-xs font-semibold cursor-pointer bg-transparent border border-border-primary-default-light dark:border-border-primary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark px-3 py-1 rounded-lg hover:bg-bg-fill-secondary-default-light dark:hover:bg-bg-fill-secondary-default-dark transition-colors"
              >
                + Add Slot
              </button>
            )}
          </div>
          <div className="max-h-56 overflow-y-auto space-y-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-3">
            {slotDefs.map(s => (
              <div key={s.id} className="flex items-center gap-2">
                <TimeInput
                  value={s.startTime}
                  onChange={e => handleChange(s.id, "startTime", e.target.value)}
                  className="flex-1"
                />
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">to</span>
                <TimeInput
                  value={s.endTime}
                  onChange={e => handleChange(s.id, "endTime", e.target.value)}
                  className="flex-1"
                />
                <span className="text-[11px] text-text-secondary-default-light dark:text-text-secondary-default-dark w-28 text-left whitespace-nowrap">{fmtLabel(s)}</span>
                <button
                  onClick={() => handleRemove(s.id)}
                  className="bg-transparent border-none text-red-400 cursor-pointer text-base p-1 hover:text-red-300"
                  disabled={slotDefs.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {hasErrors && (
            <div className="mt-2 space-y-0.5">
              {Object.entries(errors).map(([id, msg]) => {
                if (!msg) return null;
                const s = slotDefs.find(x => x.id === id);
                return (
                  <p key={id} className="text-[11px] text-red-400 m-0">
                    {fmtLabel(s)}: {msg}
                  </p>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
          <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">
            {filteredDateKeys.length > 0 ? `${filteredDateKeys.length} day${filteredDateKeys.length > 1 ? "s" : ""} · ${slotDefs.length} slot${slotDefs.length > 1 ? "s" : ""} · ${filteredDateKeys.length * slotDefs.length} available cells` : "Select start and end date"}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark transition-colors">Cancel</button>
            <button
              onClick={() => onConfirm(filteredDateKeys, slotDefs)}
              disabled={hasErrors || filteredDateKeys.length === 0}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultSlotDefs() {
  return [
    { id: "s1", startTime: "", endTime: "" },
  ];
}

const ExamScheduler = forwardRef(function ExamScheduler({ onScheduleChange }, ref) {
  const graph = useMemo(() => buildGraph(), []);
  const [rawSchedule, setRawSchedule] = useState({});
  const [slotDefs, setSlotDefs] = useState(getDefaultSlotDefs);
  const [editing, setEditing] = useState(null);
  const [showAutoDialog, setShowAutoDialog] = useState(false);

  const schedule = useMemo(() => toWeeklyEvents(rawSchedule, slotDefs), [rawSchedule, slotDefs]);
  const ready = Object.keys(rawSchedule).length > 0;

  useEffect(() => { onScheduleChange?.(ready); }, [ready, onScheduleChange]);

  const handleAutoClick = useCallback(() => {
    setShowAutoDialog(true);
  }, []);

  const handleAutoConfirm = useCallback((dateKeys, newSlotDefs) => {
    const result = greedy(graph, dateKeys, newSlotDefs);
    setSlotDefs(newSlotDefs);
    setRawSchedule(result);
    setEditing(null);
    setShowAutoDialog(false);
  }, [graph]);

  const handleReset = useCallback(() => {
    setRawSchedule({});
    setEditing(null);
  }, []);

  useImperativeHandle(ref, () => ({
    handleAuto: handleAutoClick,
    handleReset,
    hasSchedule: ready,
    getScheduleData: () => COURSES.map(c => {
      const pos = rawSchedule[c.id];
      if (!pos) return null;
      const slot = slotDefs.find(s => s.id === pos.sId);
      const date = DATES.find(d => d.key === pos.dId);
      const students = countStudents(c.id);
      return {
        Code: c.code,
        Name: c.name,
        Date: date?.label || "",
        "Start Time": slot ? to12Hour(slot.startTime) : "",
        "End Time": slot ? to12Hour(slot.endTime) : "",
        Students: students,
      };
    }).filter(Boolean),
  }), [handleAutoClick, handleReset, ready, rawSchedule, slotDefs]);

  const handleMove = (dId, sId) => {
    if (!editing) return;
    const conflicts = getConflicts(editing.id, dId, sId, rawSchedule, graph);
    if (conflicts.length > 0) return;
    setRawSchedule(p => ({ ...p, [editing.id]: { ...p[editing.id], dId, sId } }));
    setEditing(null);
  };

  const handleEventClick = useCallback((ev) => {
    const course = COURSES.find(c => c.id === +ev.id);
    if (course) setEditing(course);
  }, []);

  return (
    <div className="relative">

      {!ready ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-secondary-default-light dark:text-text-secondary-default-dark">
          <span className="text-5xl"><CalendarIcon size={64} /></span>
          <p className="text-sm m-0">No schedule yet</p>
          <p className="text-xs m-0">Click "Auto Schedule" to configure and generate the exam timetable</p>
        </div>
      ) : (
        <>
          <WeeklySchedule schedule={schedule} isMobile={false} variant="exam" onEventClick={handleEventClick} examDays={DATES} />

          {editing && (
            <ModelOverlay onClose={() => setEditing(null)} maxWidth="max-w-3xl">
              <MovePanel
                course={editing}
                current={rawSchedule[editing.id]}
                schedule={rawSchedule}
                graph={graph}
                onMove={handleMove}
                onClose={() => setEditing(null)}
                slotDefs={slotDefs}
              />
            </ModelOverlay>
          )}
        </>
      )}

      {showAutoDialog && (
        <ModelOverlay onClose={() => setShowAutoDialog(false)} maxWidth="max-w-2xl">
          <AutoScheduleDialog
            dates={DATES}
            initialSlots={slotDefs}
            onClose={() => setShowAutoDialog(false)}
            onConfirm={handleAutoConfirm}
          />
        </ModelOverlay>
      )}
    </div>
  );
});

export default ExamScheduler;
