import { useState, useMemo, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import WeeklySchedule from "../../../components/ui/WeeklySchedule";
import ModelOverlay from "../../../components/ui/ModelOverlay";
import DateInput from "../../../components/form/DateInput";
import TimeInput from "../../../components/form/TimeInput";
import { CalendarIcon } from "../../../components/ui/icons";
import { autoSchedule, getAvailableSlots, updateExam, fetchExams, deleteExam } from "../services/adminApi";
import { useError } from '../../../contexts/ErrorContext.jsx';

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

function getDateLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayName = days[d.getDay()];
  const month = d.getMonth() + 1;
  return `${dayName} ${d.getDate()}/${month}`;
}

function getDayKey(dateStr) {
  return "d" + dateStr.replace(/-/g, "");
}

function AutoScheduleDialog({ onClose, onConfirm }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [examType, setExamType] = useState(0);
  const [slotDefs, setSlotDefs] = useState([{ id: "slot_0", startTime: "", endTime: "" }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
  const dailySlots = slotDefs.filter(s => s.startTime && s.endTime);
  const validDailySlots = dailySlots.filter(s => !errors[s.id]);

  const handleSchedule = async () => {
    if (!startDate || !endDate || validDailySlots.length === 0) return;
    setLoading(true);
    try {
      await onConfirm({
        scheduleFrom: startDate,
        scheduleTo: endDate,
        examType,
        dailySlots: validDailySlots.map(s => ({
          startTime: s.startTime + ":00",
          endTime: s.endTime + ":00",
        })),
      });
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput
            label="Start Date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <DateInput
            label="End Date"
            value={endDate}
            minDate={startDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark mb-2 block">Exam Type</label>
          <select
            value={examType}
            onChange={e => setExamType(Number(e.target.value))}
            className="w-full rounded-md border border-border-primary-default-light dark:border-border-primary-default-dark px-3 py-2 bg-bg-fill-primary-default-light dark:bg-bg-fill-primary-default-dark text-sm"
          >
            <option value={0}>Midterm</option>
            <option value={1}>Final</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-text-secondary-default-light dark:text-text-secondary-default-dark">Time Slots</label>
            {slotDefs.length >= 5 ? (
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
          <div className="space-y-2 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-3">
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
            {startDate && endDate ? `${validDailySlots.length} slot${validDailySlots.length !== 1 ? "s" : ""}` : "Select start and end date"}
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark transition-colors">Cancel</button>
            <button
              onClick={handleSchedule}
              disabled={!startDate || !endDate || validDailySlots.length === 0 || hasErrors || loading}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ROWS_PER_PAGE = 8;

function MovePanel({ exam, scheduleFrom, scheduleTo, dailySlots, onMove, onClose }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [moving, setMoving] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await getAvailableSlots({
          courseId: exam.courseId,
          scheduleFrom,
          scheduleTo,
          dailySlots,
          excludeExamId: exam.examId,
        });
        setSlots(result);
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [exam, scheduleFrom, scheduleTo, dailySlots]);

  const handleConfirmMove = async () => {
    if (!selectedSlot) return;
    setMoving(true);
    try {
      const startParts = selectedSlot.startTime.split(":");
      const endParts = selectedSlot.endTime.split(":");
      const startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
      const duration = endMin - startMin;

      await onMove(exam.examId, selectedSlot.date, selectedSlot.startTime, duration);
      onClose();
    } finally {
      setMoving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-2xl shadow-2xl max-w-3xl w-full mx-auto overflow-hidden p-12 text-center text-sm text-text-secondary-default-light dark:text-text-secondary-default-dark">
        Loading available slots...
      </div>
    );
  }

  const slotMap = {};
  slots.forEach(s => {
    const key = `${s.startTime.substring(0, 5)} - ${s.endTime.substring(0, 5)}`;
    if (!slotMap[key]) slotMap[key] = [];
    slotMap[key].push(s);
  });

  const timeSlots = Object.keys(slotMap).sort((a, b) => {
    const aStart = parseMin(a.split(" - ")[0]);
    const bStart = parseMin(b.split(" - ")[0]);
    return aStart - bStart;
  });

  const dateLabels = {};
  slots.forEach(s => {
    dateLabels[s.date] = getDateLabel(s.date);
  });
  const uniqueDates = [...new Set(slots.map(s => s.date))].sort();
  const totalPages = Math.ceil(uniqueDates.length / ROWS_PER_PAGE);
  const paginatedDates = uniqueDates.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  return (
    <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-2xl shadow-2xl max-w-3xl w-full mx-auto overflow-hidden max-h-[90vh] flex flex-col">
      <div className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Move Exam</p>
          <h3 className="text-base font-semibold text-text-primary-default-light dark:text-text-primary-default-dark mt-0.5">
            {exam.courseName} <span className="font-normal text-text-secondary-default-light dark:text-text-secondary-default-dark text-xs">({exam.courseCode})</span>
          </h3>
          <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">
            Current: {exam.date} · {to12Hour(exam.startTime.substring(0, 5))} - {to12Hour(exam.endTime.substring(0, 5))}
          </p>
        </div>
        <button onClick={onClose} className="bg-transparent border-none text-text-secondary-default-light dark:text-text-secondary-default-dark cursor-pointer text-lg p-1 hover:text-text-primary-default-light dark:hover:text-text-primary-default-dark">✕</button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr>
                <th className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2.5 py-2 text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark text-center border-b border-border-primary-default-light dark:border-border-primary-default-dark whitespace-nowrap"></th>
                {timeSlots.map(ts => (
                  <th key={ts} className="bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark px-2.5 py-2 text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark text-center border-b border-border-primary-default-light dark:border-border-primary-default-dark whitespace-nowrap">{ts}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedDates.map(date => (
                <tr key={date}>
                  <td className="px-3 py-2 border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark text-xs font-semibold text-text-secondary-default-light dark:text-text-secondary-default-dark whitespace-nowrap">{dateLabels[date]}</td>
                  {timeSlots.map(ts => {
                    const slotInfo = slotMap[ts]?.find(s => s.date === date);
                    if (!slotInfo) return <td key={ts} className="p-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark"><div className="rounded-lg p-2 text-center min-h-[54px] flex items-center justify-center"><span className="text-xs text-text-tertiary-default-light dark:text-text-tertiary-default-dark">—</span></div></td>;
                    const { isAvailable, conflicts } = slotInfo;
                    const isSelected = selectedSlot?.date === date && selectedSlot?.startTime === slotInfo.startTime;

                    let cellStyle, label, labelColor;
                    if (isSelected) {
                      cellStyle = "bg-indigo-500/20 border-2 border-indigo-400 cursor-pointer";
                      label = "Click to confirm";
                      labelColor = "text-indigo-300";
                    } else if (!isAvailable) {
                      cellStyle = "bg-red-500/10 border border-red-500/40 cursor-not-allowed";
                      label = `✗ ${conflicts.length} conflict${conflicts.length > 1 ? "s" : ""}`;
                      labelColor = "text-red-400";
                    } else {
                      cellStyle = "bg-emerald-500/5 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10";
                      label = "✓ Available";
                      labelColor = "text-emerald-400";
                    }

                    return (
                      <td key={ts} className="p-1.5 border border-border-primary-default-light dark:border-border-primary-default-dark align-top min-w-[140px]">
                        <div
                          onClick={() => isAvailable && setSelectedSlot(isSelected ? null : slotInfo)}
                          className={`rounded-lg p-2 text-center min-h-[54px] flex flex-col items-center justify-center transition-all duration-150 ${cellStyle}`}
                        >
                          <span className={`text-xs font-semibold leading-tight ${labelColor}`}>{label}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                  i === page
                    ? "bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border-border-accent-default-light dark:border-border-accent-default-dark"
                    : "bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border-primary-default-light dark:border-border-primary-default-dark">
          {selectedSlot && (
            <button
              onClick={handleConfirmMove}
              disabled={moving}
              className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-accent-default-light dark:bg-bg-fill-accent-default-dark text-text-accent-active-light dark:text-text-accent-active-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-primary-hover-light dark:hover:bg-bg-fill-primary-hover-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {moving ? "Moving..." : "Confirm Move"}
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer bg-bg-fill-secondary-default-light dark:bg-bg-fill-secondary-default-dark text-text-primary-default-light dark:text-text-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark hover:bg-bg-fill-secondary-active-light dark:hover:bg-bg-fill-secondary-active-dark transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const ExamScheduler = forwardRef(function ExamScheduler({ onScheduleChange }, ref) {
  const { showError } = useError();
  const [scheduleResult, setScheduleResult] = useState(null);
  const [lastAutoConfig, setLastAutoConfig] = useState(null);
  const [showAutoDialog, setShowAutoDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const schedule = useMemo(() => {
    if (!scheduleResult?.scheduled) return [];
    return scheduleResult.scheduled.map(exam => ({
      id: String(exam.examId),
      day: getDayKey(exam.date),
      startTime: to12Hour(exam.startTime.substring(0, 5)),
      endTime: to12Hour(exam.endTime.substring(0, 5)),
      title: `${exam.courseCode} - ${exam.courseName}`,
      type: "exam",
    }));
  }, [scheduleResult]);

  const examDays = useMemo(() => {
    if (!scheduleResult?.scheduled) return [];
    const dateSet = new Set(scheduleResult.scheduled.map(exam => exam.date));
    return Array.from(dateSet).sort().map(date => ({
      key: getDayKey(date),
      label: getDateLabel(date),
    }));
  }, [scheduleResult]);

  const ready = schedule.length > 0;

  useEffect(() => { onScheduleChange?.(ready); }, [ready, onScheduleChange]);

  useEffect(() => {
    (async () => {
      try {
        const exams = await fetchExams();
        if (exams && exams.length > 0) {
          const scheduled = exams.map(exam => ({
            courseId: exam.courseId,
            courseCode: exam.courseCode || "",
            courseName: exam.courseName || exam.title,
            examId: exam.examId,
            date: exam.date.split("T")[0],
            startTime: exam.time.substring(0, 8),
            endTime: (() => {
              const [h, m] = exam.time.split(":").map(Number);
              const total = h * 60 + m + exam.durationMinutes;
              const endH = Math.floor(total / 60);
              const endM = total % 60;
              return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;
            })(),
            studentCount: 0,
          }));
          setScheduleResult({ success: true, scheduled, unscheduledCourseIds: [] });
        }
      } catch {
        // No exams exist yet, that's fine
      }
    })();
  }, []);

  const handleAutoClick = useCallback(() => {
    setShowAutoDialog(true);
  }, []);

  const handleAutoConfirm = useCallback(async (request) => {
    setLoading(true);
    try {
      const result = await autoSchedule(request);
      setScheduleResult(result);
      setLastAutoConfig({
        scheduleFrom: request.scheduleFrom,
        scheduleTo: request.scheduleTo,
        dailySlots: request.dailySlots,
      });
      setShowAutoDialog(false);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleReset = useCallback(async () => {
    try {
      setLoading(true);
      const exams = await fetchExams();
      await Promise.all(exams.map(e => deleteExam(e.examId)));
      setScheduleResult(null);
      setLastAutoConfig(null);
      setEditing(null);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleEventClick = useCallback((ev) => {
    const exam = scheduleResult?.scheduled?.find(e => String(e.examId) === ev.id);
    if (exam) setEditing(exam);
  }, [scheduleResult]);

  const handleMoveExam = useCallback(async (examId, date, startTime, durationMinutes) => {
    await updateExam(examId, {
      date: `${date}T00:00:00`,
      time: startTime,
      durationMinutes,
    });
    setScheduleResult(prev => ({
      ...prev,
      scheduled: prev.scheduled.map(e =>
        e.examId === examId
          ? { ...e, date, startTime, endTime: (() => {
              const [h, m] = startTime.split(":");
              const total = parseInt(h) * 60 + parseInt(m) + durationMinutes;
              const endH = Math.floor(total / 60);
              const endM = total % 60;
              return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;
            })() }
          : e
      ),
    }));
  }, []);

  useImperativeHandle(ref, () => ({
    handleAuto: handleAutoClick,
    handleReset,
    hasSchedule: ready,
    getScheduleData: () => {
      if (!scheduleResult?.scheduled) return [];
      return scheduleResult.scheduled.map(exam => ({
        Code: exam.courseCode,
        Name: exam.courseName,
        Date: exam.date,
        "Start Time": to12Hour(exam.startTime.substring(0, 5)),
        "End Time": to12Hour(exam.endTime.substring(0, 5)),
        Students: exam.studentCount,
      }));
    },
  }), [handleAutoClick, handleReset, ready, scheduleResult]);

  return (
    <div className="relative">

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-secondary-default-light dark:text-text-secondary-default-dark">
          <span className="text-5xl"><CalendarIcon size={64} /></span>
          <p className="text-sm m-0">Generating schedule...</p>
          <p className="text-xs m-0">The backend is computing a conflict-free timetable</p>
        </div>
      )}

      {!loading && !ready && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-text-secondary-default-light dark:text-text-secondary-default-dark">
          <span className="text-5xl"><CalendarIcon size={64} /></span>
          <p className="text-sm m-0">No schedule yet</p>
          <p className="text-xs m-0">Click "Auto Schedule" to configure and generate the exam timetable</p>
        </div>
      )}

      {!loading && ready && (
        <WeeklySchedule schedule={schedule} isMobile={false} variant="exam" examDays={examDays} onEventClick={handleEventClick} />
      )}

      {showAutoDialog && !loading && (
        <ModelOverlay onClose={() => setShowAutoDialog(false)} maxWidth="max-w-2xl">
          <AutoScheduleDialog
            onClose={() => setShowAutoDialog(false)}
            onConfirm={handleAutoConfirm}
          />
        </ModelOverlay>
      )}

      {editing && lastAutoConfig && (
        <ModelOverlay onClose={() => setEditing(null)} maxWidth="max-w-3xl">
          <MovePanel
            exam={editing}
            scheduleFrom={lastAutoConfig.scheduleFrom}
            scheduleTo={lastAutoConfig.scheduleTo}
            dailySlots={lastAutoConfig.dailySlots}
            onMove={handleMoveExam}
            onClose={() => setEditing(null)}
          />
        </ModelOverlay>
      )}
    </div>
  );
});

export default ExamScheduler;
