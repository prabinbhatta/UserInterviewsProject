import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendSessionReminderEmail } from "@/lib/email";

type DueReminder = {
  slot_id: string;
  starts_at: string;
  study_title: string;
  participant_email: string | null;
  participant_name: string | null;
};

// Runs once daily at 08:00 UTC (see vercel.json — Vercel's Hobby plan
// caps cron frequency at once/day) and reminds anyone whose booked
// session starts within the next hour of that run. In practice this
// only catches sessions between 08:00-09:00 UTC on the day it runs;
// everything else gets no reminder. Revisit (either the schedule, if
// upgrading to Pro, or the window/logic here) rather than treating this
// as the real fix. pop_due_session_reminders() marks each slot reminded
// in the same call it reads them, so overlapping runs can't double-send.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Not authorized", { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = (await supabase.rpc("pop_due_session_reminders", {
    window_minutes: 60,
  })) as { data: DueReminder[] | null; error: unknown };

  if (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }

  const reminders = data ?? [];
  let sent = 0;

  for (const reminder of reminders) {
    if (!reminder.participant_email) continue;
    // Emails render server-side with no browser to infer a timezone from,
    // so this defaults to the app's primary audience (Nepal). Once
    // per-user timezone preferences exist this should use the
    // participant's own.
    const slotTime = new Date(reminder.starts_at).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kathmandu",
    });
    await sendSessionReminderEmail(
      reminder.participant_email,
      reminder.study_title,
      slotTime,
    );
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent });
}
