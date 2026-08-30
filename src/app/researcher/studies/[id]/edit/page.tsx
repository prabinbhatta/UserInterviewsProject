import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudyForm } from "../../StudyForm";
import { updateStudy } from "../../actions";
import { getLang } from "@/lib/getLang";
import { mutedLinkClasses } from "@/components/ui/link";

export default async function EditStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { t } = await getLang();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: study } = await supabase
    .from("studies")
    .select(
      "id, title, description, format, session_length_minutes, participants_needed, incentive_amount, district, status, researcher_id",
    )
    .eq("id", id)
    .single();

  if (!study || study.researcher_id !== user.id) {
    notFound();
  }

  if (study.status !== "draft") {
    redirect("/researcher/studies");
  }

  const boundUpdateStudy = updateStudy.bind(null, study.id);

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--paper)] px-6 py-16">
      <div className="w-full max-w-xl">
        <Link href="/researcher/studies" className={`text-sm ${mutedLinkClasses}`}>
          {t("backToStudies")}
        </Link>
        <h1 className="mt-2 font-display text-3xl font-medium text-[var(--ink)]">
          {t("editStudyTitle")}
        </h1>
        <div className="mt-6">
          <StudyForm
            action={boundUpdateStudy}
            defaultValues={{
              title: study.title,
              description: study.description,
              format: study.format,
              session_length_minutes: study.session_length_minutes,
              participants_needed: study.participants_needed,
              incentive_amount: study.incentive_amount,
              district: study.district,
            }}
            submitLabel={t("saveChanges")}
          />
        </div>
      </div>
    </div>
  );
}
