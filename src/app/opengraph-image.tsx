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
            <rect x="8" y="19" width="53" height="42" rx="13" fill="#1B2F45" />
            <path d="M19 61 L19 75 L32 61 Z" fill="#1B2F45" />
            <rect x="35" y="35" width="53" height="42" rx="13" fill="#29527C" stroke="#EEF1F4" strokeWidth="3" />
            <path d="M77 77 L77 91 L64 77 Z" fill="#29527C" />
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
          Every great insight starts as someone&apos;s voice.
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
