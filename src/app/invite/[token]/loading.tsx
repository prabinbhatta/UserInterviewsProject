import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <Card className="w-full max-w-lg">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-5/6" />
        <Skeleton className="mt-6 h-11 w-full rounded-full" />
      </Card>
    </div>
  );
}
