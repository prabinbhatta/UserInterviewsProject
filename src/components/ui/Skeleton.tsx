export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--mist)]/40 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--mist)] bg-white p-5">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-1.5 h-3 w-5/6" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-8 space-y-4" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
