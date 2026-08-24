const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) return null;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

// Uses the Google Meet API (not the Calendar API) specifically so the
// space can be created with accessType "OPEN" — anyone with the link
// joins directly, no waiting for the host to admit them. The Calendar
// API's auto-generated conference data doesn't expose that setting at
// all; it always defaults to knock-to-join for a personal Google account.
//
// Best-effort — a failed Meet link generation should never block adding
// a slot; the researcher can always paste one in manually instead.
export async function createGoogleMeetLink(): Promise<string | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const res = await fetch("https://meet.googleapis.com/v2/spaces", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config: { accessType: "OPEN", entryPointAccess: "ALL" },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { meetingUri?: string };
    return data.meetingUri ?? null;
  } catch {
    return null;
  }
}
