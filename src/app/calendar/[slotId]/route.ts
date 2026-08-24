import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slotId: string }> },
) {
  const { slotId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Not authorized", { status: 401 });
  }

  const { data: slot } = await supabase
    .from("study_slots")
    .select(
      "id, starts_at, location, application_id, study_id, studies(title, session_length_minutes, researcher_id), applications(participant_id)",
    )
    .eq("id", slotId)
    .single();

  if (!slot || !slot.application_id) {
    return new NextResponse("Not found", { status: 404 });
  }

  const study = Array.isArray(slot.studies) ? slot.studies[0] : slot.studies;
  const application = Array.isArray(slot.applications)
    ? slot.applications[0]
    : slot.applications;

  const isParticipant = application?.participant_id === user.id;
  const isResearcher = study?.researcher_id === user.id;
  if (!isParticipant && !isResearcher) {
    return new NextResponse("Not authorized", { status: 403 });
  }

  const start = new Date(slot.starts_at);
  const end = new Date(start.getTime() + (study?.session_length_minutes ?? 30) * 60_000);
  const title = study?.title ?? "Research session";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nepal User Research//Calendar Export//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${slot.id}@research.prabinbhatta.com.np`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    ...(slot.location ? [`LOCATION:${escapeIcsText(slot.location)}`] : []),
    `DESCRIPTION:${escapeIcsText(`Research session for "${title}" via Nepal User Research.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="session.ics"`,
    },
  });
}
