import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-8 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-5/6" />
        <div className="mt-8 space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <Skeleton className="mt-6 h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
