import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-24" />
        <div className="mt-2 flex items-start justify-between gap-4">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-48" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-5/6" />
        <Skeleton className="mt-1.5 h-4 w-2/3" />
        <div className="mt-8 rounded-2xl border border-[var(--mist)] bg-white p-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-56" />
          <Skeleton className="mt-4 h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
