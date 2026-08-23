import Link from "next/link";
import { StudyForm } from "../StudyForm";
import { createStudy } from "../actions";
import { mutedLinkClasses } from "@/components/ui/link";

export default function NewStudyPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          Back to studies
        </Link>
        <h1 className="mt-2 font-serif-display text-3xl font-medium text-[var(--ink)]">
          New study
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          This saves as a draft. You can publish it once you&apos;re ready for
          participants to see it.
        </p>
        <div className="mt-6">
          <StudyForm action={createStudy} submitLabel="Save as draft" />
        </div>
      </div>
    </div>
  );
}
