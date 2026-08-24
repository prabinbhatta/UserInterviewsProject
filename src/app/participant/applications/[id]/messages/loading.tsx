import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-3 h-7 w-56" />
        <Skeleton className="mt-1.5 h-4 w-40" />

        <div className="mt-8 space-y-3">
          <div className="flex justify-start">
            <Skeleton className="h-12 w-2/3 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-1/2 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-14 w-3/5 rounded-2xl" />
          </div>
        </div>

        <Skeleton className="mt-6 h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}
