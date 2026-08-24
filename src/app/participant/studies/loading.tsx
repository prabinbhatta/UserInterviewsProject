import { Skeleton, SkeletonList } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-48" />
        <SkeletonList count={4} />
      </div>
    </div>
  );
}
