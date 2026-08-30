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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#29527C",
            fontWeight: 600,
          }}
        >
          Business Analyst · Kathmandu, Nepal
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 68,
            lineHeight: 1.15,
            color: "#12161D",
            fontWeight: 600,
            maxWidth: 950,
          }}
        >
          Prabin Bhatta
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
          Turning ambiguous requirements into software people actually ship.
        </div>
      </div>
    ),
    { ...size },
  );
}
