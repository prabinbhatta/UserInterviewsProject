import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#EEF1F4",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(41,82,124,0.18), transparent 55%), radial-gradient(circle at 10% 85%, rgba(27,47,69,0.14), transparent 50%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="34" height="34" viewBox="0 0 96 96" fill="none">
            <circle cx="76" cy="39" r="8" fill="#1B2F45" opacity="0.85" />
            <circle cx="66" cy="72" r="8" fill="#1B2F45" opacity="0.85" />
            <circle cx="30" cy="72" r="8" fill="#1B2F45" opacity="0.85" />
            <circle cx="20" cy="39" r="8" fill="#1B2F45" opacity="0.85" />
            <circle cx="48" cy="18" r="8" fill="#29527C" />
            <circle cx="48" cy="18" r="13" stroke="#29527C" strokeWidth="2" fill="none" />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#29527C",
              fontWeight: 600,
            }}
          >
            PanelMeet
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 72,
            lineHeight: 1.15,
            color: "#12161D",
            fontWeight: 600,
            maxWidth: 900,
          }}
        >
          Real research participants, screened and ready to meet.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: "rgba(18,22,29,0.65)",
            maxWidth: 780,
          }}
        >
          Connecting Nepali companies with research participants.
        </div>
      </div>
    ),
    { ...size },
  );
}
