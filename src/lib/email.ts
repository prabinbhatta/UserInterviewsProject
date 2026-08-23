import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = "Nepal User Research <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function wrap(bodyHtml: string, ctaHref?: string, ctaLabel?: string) {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #18181b;">
      <p style="font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; color: #71717a;">Nepal User Research</p>
      ${bodyHtml}
      ${
        ctaHref && ctaLabel
          ? `<p style="margin-top: 24px;"><a href="${ctaHref}" style="display: inline-block; background: #18181b; color: #ffffff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 600;">${ctaLabel}</a></p>`
          : ""
      }
    </div>
  `;
}

// Best-effort — a failed notification email should never block the
// underlying action (approval, booking, message, incentive) it's attached to.
async function sendNotificationEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) return;
  try {
    await resend.emails.send({ from: FROM, to: params.to, subject: params.subject, html: params.html });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

export async function sendApprovedEmail(to: string, studyTitle: string) {
  await sendNotificationEmail({
    to,
    subject: `You're approved for "${studyTitle}"`,
    html: wrap(
      `<p>Good news — you're approved for <strong>${studyTitle}</strong>.</p><p>Pick a time that works for you to lock in your session.</p>`,
      `${SITE_URL}/participant/applications`,
      "Pick a time",
    ),
  });
}

export async function sendSlotBookedEmail(
  to: string,
  studyTitle: string,
  participantName: string,
  slotTime: string,
) {
  await sendNotificationEmail({
    to,
    subject: `${participantName} booked a session for "${studyTitle}"`,
    html: wrap(
      `<p><strong>${participantName}</strong> booked a session for <strong>${studyTitle}</strong>.</p><p>Time: ${slotTime}</p>`,
      undefined,
      undefined,
    ),
  });
}

export async function sendNewMessageEmail(
  to: string,
  senderName: string,
  studyTitle: string,
  messagesPath: string,
) {
  await sendNotificationEmail({
    to,
    subject: `New message from ${senderName}`,
    html: wrap(
      `<p><strong>${senderName}</strong> sent you a message about <strong>${studyTitle}</strong>.</p>`,
      `${SITE_URL}${messagesPath}`,
      "View message",
    ),
  });
}

export async function sendBookingCancelledEmail(
  to: string,
  studyTitle: string,
  cancelledByLabel: string,
  ctaPath: string,
) {
  await sendNotificationEmail({
    to,
    subject: `Your session for "${studyTitle}" was cancelled`,
    html: wrap(
      `<p>${cancelledByLabel} cancelled the scheduled session for <strong>${studyTitle}</strong>.</p><p>Pick a new time when you're ready.</p>`,
      `${SITE_URL}${ctaPath}`,
      "View options",
    ),
  });
}

export async function sendIncentiveSentEmail(to: string, studyTitle: string, amount: number) {
  await sendNotificationEmail({
    to,
    subject: `Your NPR ${amount} incentive for "${studyTitle}" has been sent`,
    html: wrap(
      `<p>The researcher marked your NPR ${amount} incentive for <strong>${studyTitle}</strong> as sent.</p><p>Once you've checked, confirm whether you received it.</p>`,
      `${SITE_URL}/participant/applications`,
      "Confirm receipt",
    ),
  });
}
