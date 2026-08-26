import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-48" />
        <div className="mt-8 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-2 h-11 w-full rounded-lg" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-8 h-11 w-40 rounded-full" />
      </div>
    </div>
  );
}
