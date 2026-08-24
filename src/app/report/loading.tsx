import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-6 h-24 w-full rounded-xl" />
        <Skeleton className="mt-4 h-11 w-32 rounded-full" />
      </div>
    </div>
  );
}
