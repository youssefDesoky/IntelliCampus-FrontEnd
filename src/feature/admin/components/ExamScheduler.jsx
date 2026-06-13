import { useState, useMemo, useCallback } from "react";
import WeeklySchedule from "../../../components/ui/WeeklySchedule";

const COURSES = [
  { id: 1, name: "قواعد البيانات",       code: "CS301" },
  { id: 2, name: "هياكل البيانات",       code: "CS201" },
  { id: 3, name: "شبكات الحاسب",         code: "CS401" },
  { id: 4, name: "الخوارزميات",          code: "CS302" },
  { id: 5, name: "ذكاء اصطناعي",         code: "CS501" },
  { id: 6, name: "نظم التشغيل",          code: "CS402" },
  { id: 7, name: "برمجة متقدمة",         code: "CS202" },
  { id: 8, name: "رياضيات تطبيقية",      code: "MATH301" },
];

const ENROLLMENTS = {
  1:  [1,2,7],  2:  [1,2,6],  3:  [1,3,8],  4:  [1,3],
  5:  [1,4],    6:  [1,4,7],  7:  [1,5],    8:  [1,5,8],
  9:  [2,3],    10: [2,4],    11: [2,5,7],  12: [2,6,8],
  13: [3,4],    14: [3,5],    15: [3,6],    16: [4,5,8],
  17: [4,6],    18: [5,6],    19: [6,7],    20: [7,8],
};

const DAY_MAP = { d1: "sat", d2: "sun", d3: "mon", d4: "tue", d5: "wed" };

const SLOT_MAP = {
  s1: { startTime: "9:00 AM",  endTime: "11:00 AM" },
  s2: { startTime: "12:00 PM", endTime: "2:00 PM"  },
  s3: { startTime: "3:00 PM",  endTime: "5:00 PM"  },
};

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

function greedy(graph) {
  const slots = Object.keys(SLOT_MAP);
  const days = Object.keys(DAY_MAP);
  const allSlots = days.flatMap(d => slots.map(s => ({ dId: d, sId: s })));
  const ordered = [...COURSES].sort((a,b) => graph[b.id].size - graph[a.id].size);
  const schedule = {};

  for (const course of ordered) {
    const forbidden = new Set();
    graph[course.id].forEach(nId => {
      if (schedule[nId]) forbidden.add(`${schedule[nId].dId}|${schedule[nId].sId}`);
    });
    const pick = allSlots.find(s => !forbidden.has(`${s.dId}|${s.sId}`));
    if (pick) schedule[course.id] = { dId: pick.dId, sId: pick.sId };
  }
  return schedule;
}

function toWeeklyEvents(schedule) {
  return Object.entries(schedule).map(([cId, pos]) => {
    const course = COURSES.find(c => c.id === +cId);
    const slot = SLOT_MAP[pos.sId];
    return {
      id: cId,
      day: DAY_MAP[pos.dId],
      startTime: slot.startTime,
      endTime: slot.endTime,
      title: `${course.name} (${course.code})`,
      type: "lecture",
    };
  });
}

function countConflicts(rawSchedule, graph) {
  let conflicts = 0;
  for (const [cId, pos] of Object.entries(rawSchedule)) {
    const neighbors = [...graph[+cId]];
    for (const nId of neighbors) {
      const ns = rawSchedule[nId];
      if (ns && nId > +cId && ns.dId === pos.dId && ns.sId === pos.sId) conflicts++;
    }
  }
  return conflicts;
}

export default function ExamScheduler() {
  const graph = useMemo(() => buildGraph(), []);
  const [rawSchedule, setRawSchedule] = useState({});
  const [toast, setToast] = useState(null);

  const schedule = useMemo(() => toWeeklyEvents(rawSchedule), [rawSchedule]);
  const totalEdges = useMemo(() => {
    let n = 0;
    COURSES.forEach(c => { n += graph[c.id].size; });
    return n / 2;
  }, [graph]);
  const conflictCount = useMemo(() => countConflicts(rawSchedule, graph), [rawSchedule, graph]);

  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2800);
  }, []);

  const handleAuto = () => {
    const result = greedy(graph);
    setRawSchedule(result);
    showToast("Auto-scheduled successfully ✓");
  };

  const handleReset = () => {
    setRawSchedule({});
  };

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-lg border text-xs font-semibold text-white z-[999] shadow-lg ${
          toast.ok ? "bg-green-700 border-green-500" : "bg-red-800 border-red-500"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-text-primary-default-light dark:text-text-primary-default-dark">
            Exam Schedule
          </h3>
          <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">
            {COURSES.length} courses · {Object.keys(ENROLLMENTS).length} students · {totalEdges} conflict pairs
            {conflictCount > 0 && ` · ${conflictCount} conflict${conflictCount > 1 ? "s" : ""} remaining`}
          </p>
        </div>
        <div className="flex gap-2">
          {Object.keys(rawSchedule).length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleAuto}
            className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors"
          >
            ⚡ Auto Schedule
          </button>
        </div>
      </div>

      {Object.keys(rawSchedule).length > 0 ? (
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex gap-3 flex-wrap">
            {[
              { n: Object.keys(rawSchedule).length, l: "Scheduled",        c: "text-indigo-400" },
              { n: Object.keys(ENROLLMENTS).length,  l: "Students",          c: "text-emerald-400" },
              { n: totalEdges,                        l: "Conflict Pairs",    c: "text-amber-400" },
              { n: conflictCount,                     l: "Conflicts",         c: conflictCount > 0 ? "text-red-400" : "text-emerald-400" },
            ].map(st => (
              <div key={st.l} className="flex-1 min-w-[100px] bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg px-4 py-3 flex flex-col gap-0.5">
                <span className={`text-2xl font-bold ${st.c}`}>{st.n}</span>
                <span className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark">{st.l}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-secondary-default-light dark:text-text-secondary-default-dark">
          <span className="text-5xl">📅</span>
          <p className="text-sm m-0">No schedule yet</p>
          <p className="text-xs m-0">Click "Auto Schedule" to distribute exams without conflicts</p>
        </div>
      )}

      {Object.keys(rawSchedule).length > 0 && (
        <WeeklySchedule schedule={schedule} isMobile={false} variant="exam" />
      )}
    </div>
  );
}
