import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-full max-w-md" />
        <Skeleton className="mt-6 h-20 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-20 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-11 w-40 rounded-full" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
