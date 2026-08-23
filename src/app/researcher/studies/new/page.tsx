import Link from "next/link";
import { StudyForm } from "../StudyForm";
import { createStudy } from "../actions";

export default function NewStudyPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className="text-sm text-zinc-500 underline">
          Back to studies
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">New study</h1>
        <p className="mt-1 text-sm text-zinc-600">
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
