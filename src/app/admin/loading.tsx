import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-3xl">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-2 h-8 w-56" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
