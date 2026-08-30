import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = "PanelMeet <no-reply@panelmeet.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Brand tokens mirrored from src/app/globals.css — email clients can't read
// CSS custom properties, so these stay hardcoded and in sync by hand.
const INK = "#12161d";
const INK_MUTED = "#5b6472";
const PAPER = "#eef1f4";
const ACCENT = "#29527c";
const LINE = "#d7dee5";
const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function wrap(bodyHtml: string, ctaHref?: string, ctaLabel?: string) {
  const preheader = stripTags(bodyHtml).slice(0, 140);

  return `
    <div style="background: ${PAPER}; padding: 32px 16px; font-family: ${FONT_STACK};">
      <span style="display: none; overflow: hidden; line-height: 1px; opacity: 0; max-height: 0; max-width: 0;">
        ${preheader}
      </span>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; border-collapse: separate;">
        <tr>
          <td style="border-radius: 16px 16px 0 0; overflow: hidden; line-height: 0;">
            <div style="height: 4px; background-color: ${ACCENT};"></div>
          </td>
        </tr>
        <tr>
          <td style="background: #ffffff; border-left: 1px solid ${LINE}; border-right: 1px solid ${LINE}; padding: 32px 36px 8px;">
            <p style="margin: 0 0 20px; font-family: ui-monospace, 'SF Mono', 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: ${ACCENT};">
              PanelMeet
            </p>
            <div style="font-size: 15px; line-height: 1.65; color: ${INK};">
              ${bodyHtml}
            </div>
            ${
              ctaHref && ctaLabel
                ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0 8px;"><tr><td style="border-radius: 999px; background: ${INK};">
                    <a href="${ctaHref}" style="display: inline-block; padding: 12px 26px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 999px;">${ctaLabel}</a>
                  </td></tr></table>`
                : ""
            }
          </td>
        </tr>
        <tr>
          <td style="background: #ffffff; border-left: 1px solid ${LINE}; border-right: 1px solid ${LINE}; border-bottom: 1px solid ${LINE}; border-radius: 0 0 16px 16px; padding: 20px 36px 28px;">
            <div style="border-top: 1px solid #eceef5; padding-top: 16px;">
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: ${INK_MUTED};">
                You're receiving this because you have an account on
                <a href="${SITE_URL}" style="color: ${INK_MUTED}; text-decoration: underline; text-decoration-color: ${LINE};">PanelMeet</a>.
              </p>
            </div>
          </td>
        </tr>
      </table>
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
  location?: string | null,
) {
  await sendNotificationEmail({
    to,
    subject: `${participantName} booked a session for "${studyTitle}"`,
    html: wrap(
      `<p><strong>${participantName}</strong> booked a session for <strong>${studyTitle}</strong>.</p><p>Time: ${slotTime}</p>${location ? `<p>Location: ${location}</p>` : ""}`,
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

export async function sendSessionReminderEmail(
  to: string,
  studyTitle: string,
  slotTime: string,
) {
  await sendNotificationEmail({
    to,
    subject: `Reminder: your session for "${studyTitle}" starts soon`,
    html: wrap(
      `<p>Your session for <strong>${studyTitle}</strong> starts soon.</p><p>Time: ${slotTime}</p>`,
      `${SITE_URL}/participant/applications`,
      "View details",
    ),
  });
}

export async function sendWaitlistSpotOpenEmail(to: string, studyTitle: string, studyId: string) {
  await sendNotificationEmail({
    to,
    subject: `A spot opened up for "${studyTitle}"`,
    html: wrap(
      `<p>You were on the waitlist for <strong>${studyTitle}</strong> — a spot just opened up.</p><p>Apply soon, since it's first come, first served.</p>`,
      `${SITE_URL}/participant/studies/${studyId}`,
      "Apply now",
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
