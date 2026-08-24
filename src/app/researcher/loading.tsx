import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-4 w-full max-w-md" />
        <Skeleton className="mt-6 h-11 w-44 rounded-full" />
      </div>
    </div>
  );
}
