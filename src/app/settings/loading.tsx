import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-40" />
        <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white p-6">
          <Skeleton className="h-4 w-28" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 shrink-0 rounded" />
                <Skeleton className="h-4 w-56" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-11 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
