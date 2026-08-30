import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          padding: 3,
          gap: 3,
        }}
      >
        <div style={{ width: 11, height: 11, borderRadius: 3, background: "#12161D" }} />
        <div style={{ width: 11, height: 11, borderRadius: 3, background: "#E24B3A" }} />
        <div style={{ width: 11, height: 11, borderRadius: 3, background: "#E24B3A" }} />
        <div style={{ width: 11, height: 11, borderRadius: 3, background: "#12161D" }} />
      </div>
    ),
    { ...size },
  );
}
