import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-7 w-48" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-[var(--mist)] bg-white p-5 ${i === 2 ? "sm:col-span-2" : ""}`}
            >
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-2 h-8 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--mist)] bg-white p-5">
          <Skeleton className="h-4 w-32" />
          <div className="mt-3 space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
