import { Skeleton, SkeletonList } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-8 w-56" />
        <SkeletonList count={3} />
      </div>
    </div>
  );
}
