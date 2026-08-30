import Link from "next/link";
import { StudyForm } from "../StudyForm";
import { createStudy } from "../actions";
import { getLang } from "@/lib/getLang";
import { mutedLinkClasses } from "@/components/ui/link";

export default async function NewStudyPage() {
  const { t } = await getLang();
  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToStudies")}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
          {t("newStudy")}
        </h1>
        <p className="mt-1 text-sm text-[var(--ink)]/60">
          {t("newStudyHint")}
        </p>
        <div className="mt-6">
          <StudyForm action={createStudy} submitLabel={t("saveAsDraft")} />
        </div>
      </div>
    </div>
  );
}
