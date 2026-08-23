import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function closeStudyIfFull(
  supabase: SupabaseServerClient,
  studyId: string,
) {
  const { data: study } = await supabase
    .from("studies")
    .select("status, participants_needed")
    .eq("id", studyId)
    .single();

  if (!study || study.status !== "active" || study.participants_needed <= 0) {
    return;
  }

  const { count } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("study_id", studyId)
    .in("status", ["approved", "scheduled", "completed"]);

  if ((count ?? 0) >= study.participants_needed) {
    await supabase.from("studies").update({ status: "closed" }).eq("id", studyId);
  }
}
