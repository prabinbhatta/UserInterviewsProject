import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

// RFC 5545 requires content lines over 75 octets to be folded onto
// continuation lines starting with a single space. Study titles can be
// long (and, since this app is bilingual, multi-byte Devanagari text), so
// this folds on UTF-8 byte boundaries — stricter clients like Outlook
// desktop reject or mangle unfolded long lines.
function foldIcsLine(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const chunks: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Don't split in the middle of a multi-byte UTF-8 sequence
    // (continuation bytes are 10xxxxxx, i.e. 0x80-0xBF).
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    chunks.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74; // continuation lines start with a folding space
  }
  return chunks.join("\r\n ");
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
    "PRODID:-//PanelMeet//Calendar Export//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${slot.id}@panelmeet.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(title)}`),
    ...(slot.location ? [foldIcsLine(`LOCATION:${escapeIcsText(slot.location)}`)] : []),
    foldIcsLine(
      `DESCRIPTION:${escapeIcsText(`Research session for "${title}" via PanelMeet.`)}`,
    ),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const filenameSlug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "session";

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filenameSlug}.ics"`,
    },
  });
}
