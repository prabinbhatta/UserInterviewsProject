import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
import { one } from "@/lib/one";

type ApplicantRow = {
  status: string;
  created_at: string;
  profiles: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
  incentive_records:
    | { status: string; amount: number }
    | { status: string; amount: number }[]
    | null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { data: study } = await supabase
    .from("studies")
    .select("id, title, researcher_id")
    .eq("id", id)
    .single();

  if (!study || study.researcher_id !== user.id) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { data: applications } = (await supabase
    .from("applications")
    .select(
      "status, created_at, profiles(full_name, email), incentive_records(status, amount)",
    )
    .eq("study_id", id)
    .order("created_at", { ascending: true })) as { data: ApplicantRow[] | null };

  const rows: (string | number)[][] = [
    ["Name", "Email", "Status", "Applied at", "Incentive status", "Incentive amount"],
    ...(applications ?? []).map((application) => {
      const participant = one(application.profiles);
      const incentive = one(application.incentive_records);
      return [
        participant?.full_name ?? "",
        participant?.email ?? "",
        application.status,
        new Date(application.created_at).toISOString(),
        incentive?.status ?? "",
        incentive?.amount ?? "",
      ];
    }),
  ];

  const csv = toCsv(rows);
  const safeTitle = study.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeTitle || "applicants"}.csv"`,
    },
  });
}
