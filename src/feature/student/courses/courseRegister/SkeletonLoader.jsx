function SkeletonBar({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-bg-surface-secondary-default-light dark:bg-bg-surface-secondary-default-dark rounded ${className}`}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="relative flex flex-col justify-between gap-4 p-4 border border-border-primary-default-light dark:border-border-primary-default-dark rounded-lg bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark">
      <SkeletonBar className="absolute top-4 right-4 w-8 h-8 rounded-full" />
      <div className="flex-1 flex flex-col justify-center space-y-3">
        <div className="flex gap-4">
          <SkeletonBar className="h-6 w-24 rounded-full" />
          <SkeletonBar className="h-6 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <SkeletonBar className="h-5 w-3/4" />
          <SkeletonBar className="h-4 w-1/2" />
          <div className="flex gap-6">
            <SkeletonBar className="h-4 w-32" />
            <SkeletonBar className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-t-border-primary-default-light dark:border-t-border-primary-default-dark">
        <SkeletonBar className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function RegistrationPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <SkeletonBar className="h-5 w-48 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div>
        <SkeletonBar className="h-5 w-40 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <SkeletonBar className="h-5 w-52 mb-4" />
        <SkeletonBar className="h-48 w-full rounded-xl" />
      </div>
      <div className="md:col-span-2 flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-6">
        <div className="flex gap-3">
          <SkeletonBar className="h-10 w-32 rounded-lg" />
          <SkeletonBar className="h-10 w-32 rounded-lg" />
        </div>
        <SkeletonBar className="h-4 w-64" />
      </div>
    </div>
  );
}
