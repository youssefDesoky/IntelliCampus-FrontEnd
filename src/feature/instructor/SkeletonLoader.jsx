function SkeletonBar({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded ${className}`}
    />
  );
}

// ============================================================
// INSTRUCTOR COURSES
// ============================================================
function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <SkeletonBar className="hidden sm:flex w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SkeletonBar className="h-5 w-24 rounded-full" />
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-5 w-16 rounded-md" />
          </div>
          <SkeletonBar className="h-5 w-3/4" />
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBar className="w-9 h-9 rounded-full" />
                <div className="space-y-1">
                  <SkeletonBar className="h-3 w-14" />
                  <SkeletonBar className="h-4 w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0 min-w-[140px] gap-2">
          <SkeletonBar className="h-5 w-24 rounded-md" />
          <SkeletonBar className="h-9 w-full rounded-lg mt-auto" />
          <SkeletonBar className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function InstructorCoursesSkeleton({ viewMode }) {
  const isGrid = viewMode === "grid";
  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <SkeletonBar className="h-10 w-44 rounded-lg" />
        <div className="flex items-center gap-3">
          <SkeletonBar className="h-9 w-9 rounded-lg" />
          <SkeletonBar className="h-9 w-9 rounded-lg" />
        </div>
      </div>
      <div className="hidden md:grid grid-cols-3 gap-6 mb-6">
        <div className="rounded-2xl bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark p-4 sm:p-5">
          <SkeletonBar className="h-4 w-32 mb-4 sm:mb-5" />
          <div className="flex flex-col sm:flex-row sm:divide-x divide-y sm:divide-y-0 divide-border-primary-default-light dark:divide-border-primary-default-dark">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center py-3 sm:py-0 px-2">
                <SkeletonBar className="h-7 w-12" />
                <SkeletonBar className="h-3 w-20 mt-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`mb-6 ${isGrid ? "flex flex-wrap justify-evenly gap-4 sm:grid sm:grid-cols-2" : "flex flex-col gap-4"}`}>
        {Array.from({ length: isGrid ? 4 : 2 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

// ============================================================
// MEETING ROOM
// ============================================================
function MeetingCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded-xl p-4">
      <SkeletonBar className="w-10 h-10 shrink-0 rounded-full" />
      <div className="space-y-2 flex-1 w-full sm:w-auto">
        <SkeletonBar className="h-4 w-3/4 sm:w-48" />
        <SkeletonBar className="h-3 w-1/2 sm:w-32" />
      </div>
      <SkeletonBar className="h-9 w-full sm:w-20 rounded-lg" />
    </div>
  );
}

export function MeetingListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <MeetingCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================
// COURSE SUB-PAGES (Quizzes, Materials, Grades, Complaints, etc.)
// ============================================================
export function CourseQuizzesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonBar className="h-7 w-24" />
        <SkeletonBar className="h-9 w-36 rounded-lg" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <SkeletonBar className="h-5 w-3/4" />
                <SkeletonBar className="h-4 w-1/2" />
              </div>
              <SkeletonBar className="h-6 w-20 rounded-full shrink-0" />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <SkeletonBar className="h-4 w-36" />
              <SkeletonBar className="h-4 w-20" />
              <SkeletonBar className="h-4 w-16" />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border-tertiary-default-light dark:border-border-tertiary-default-dark">
              <SkeletonBar className="h-8 w-28 rounded-lg" />
              <SkeletonBar className="h-8 w-28 rounded-lg" />
              <SkeletonBar className="h-8 w-16 rounded-lg" />
              <SkeletonBar className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseMaterialsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonBar className="h-7 w-28" />
        <SkeletonBar className="h-9 w-40 rounded-lg" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex items-center gap-3">
              <SkeletonBar className="w-5 h-5 rounded" />
              <SkeletonBar className="h-5 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <SkeletonBar className="h-8 w-8 rounded-lg" />
              <SkeletonBar className="h-8 w-8 rounded-lg" />
            </div>
          </div>
          <div className="p-5 space-y-3">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark">
                <SkeletonBar className="w-8 h-8 rounded-lg shrink-0" />
                <div className="flex-1 space-y-1">
                  <SkeletonBar className="h-4 w-3/4" />
                  <SkeletonBar className="h-3 w-1/3" />
                </div>
                <SkeletonBar className="w-8 h-8 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CourseGradesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <SkeletonBar className="h-3 w-24" />
              <SkeletonBar className="w-5 h-5 rounded" />
            </div>
            <SkeletonBar className="h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end">
        <SkeletonBar className="h-9 w-40 rounded-lg" />
      </div>
      <div>
        <SkeletonBar className="h-5 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-3 sm:p-4">
              <div className="sm:flex sm:flex-row sm:items-center sm:gap-3">
                <SkeletonBar className="hidden sm:block w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <SkeletonBar className="sm:hidden w-10 h-10 rounded-lg shrink-0" />
                      <div className="min-w-0 space-y-1">
                        <SkeletonBar className="h-4 w-40" />
                        <SkeletonBar className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-center space-y-1">
                        <SkeletonBar className="h-5 w-12" />
                        <SkeletonBar className="h-3 w-14" />
                      </div>
                      <div className="text-center space-y-1">
                        <SkeletonBar className="h-5 w-8" />
                        <SkeletonBar className="h-3 w-14" />
                      </div>
                    </div>
                    <SkeletonBar className="sm:hidden h-5 w-14 rounded-full" />
                  </div>
                  <div className="mt-2 sm:mt-3 flex items-center gap-3">
                    <SkeletonBar className="flex-1 h-2 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:block">
        <SkeletonBar className="h-5 w-24 mb-4" />
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
          <div className="p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
            <div className="flex gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBar key={i} className="h-4 flex-1" />
              ))}
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, row) => (
            <div key={row} className="p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark last:border-b-0">
              <div className="flex gap-4 items-center">
                <SkeletonBar className="h-4 flex-[2]" />
                {Array.from({ length: 3 }).map((_, col) => (
                  <SkeletonBar key={col} className="h-4 flex-1" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CourseComplaintsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <SkeletonBar className="h-6 w-44" />
          <SkeletonBar className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-4">
            <div className="flex items-start gap-3">
              <SkeletonBar className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <SkeletonBar className="h-4 w-36" />
                    <SkeletonBar className="h-3 w-24" />
                  </div>
                  <SkeletonBar className="h-5 w-20 rounded-full shrink-0" />
                </div>
                <SkeletonBar className="h-4 w-3/4" />
                <SkeletonBar className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseAttendanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonBar className="h-7 w-28" />
        <div className="flex items-center gap-3">
          <SkeletonBar className="h-9 w-36 rounded-lg" />
          <SkeletonBar className="h-9 w-36 rounded-lg" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SkeletonBar className="h-4 w-12" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonBar key={i} className="h-9 w-28 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <SkeletonBar className="h-5 w-20 rounded-full" />
                  <SkeletonBar className="h-5 w-16 rounded-full" />
                </div>
                <SkeletonBar className="h-6 w-40" />
              </div>
              <SkeletonBar className="w-11 h-11 rounded-2xl shrink-0" />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <SkeletonBar className="h-16 rounded-2xl" />
              <SkeletonBar className="h-16 rounded-2xl" />
            </div>
            <SkeletonBar className="h-12 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseAttendanceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBar className="w-9 h-9 rounded-xl" />
          <SkeletonBar className="h-7 w-44" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonBar className="h-9 w-36 rounded-lg" />
          <SkeletonBar className="h-9 w-40 rounded-lg" />
        </div>
      </div>
      <SkeletonBar className="h-5 w-24 mb-4" />
      <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark rounded-lg border border-border-primary-default-light dark:border-border-primary-default-dark">
        <div className="p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBar key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="p-4 border-b border-border-primary-default-light dark:border-border-primary-default-dark last:border-b-0">
            <div className="flex gap-4 items-center">
              <SkeletonBar className="h-4 flex-1" />
              <SkeletonBar className="h-4 flex-[2]" />
              <SkeletonBar className="h-5 flex-1 rounded-full" />
              <SkeletonBar className="h-4 flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseAssignmentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SkeletonBar className="h-7 w-28" />
        <SkeletonBar className="h-9 w-44 rounded-lg" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-xl p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <SkeletonBar className="h-5 w-3/4" />
                <SkeletonBar className="h-4 w-1/2" />
              </div>
              <SkeletonBar className="h-6 w-20 rounded-full shrink-0" />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <SkeletonBar className="h-4 w-36" />
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border-tertiary-default-light dark:border-border-tertiary-default-dark">
              <SkeletonBar className="h-8 w-28 rounded-lg" />
              <SkeletonBar className="h-8 w-16 rounded-lg" />
              <SkeletonBar className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CourseAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-6">
        <SkeletonBar className="h-6 w-48 mb-4" />
        <SkeletonBar className="h-[320px] w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-6">
          <SkeletonBar className="h-6 w-36 mb-4" />
          <div className="flex items-center justify-center h-[260px]">
            <SkeletonBar className="w-48 h-48 rounded-full" />
          </div>
        </div>
        <div className="bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg p-6">
          <SkeletonBar className="h-6 w-44 mb-4" />
          <SkeletonBar className="h-[260px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
