import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 96 96" fill="none">
        <circle cx="76" cy="39" r="8" fill="#1B2F45" opacity="0.85" />
        <circle cx="66" cy="72" r="8" fill="#1B2F45" opacity="0.85" />
        <circle cx="30" cy="72" r="8" fill="#1B2F45" opacity="0.85" />
        <circle cx="20" cy="39" r="8" fill="#1B2F45" opacity="0.85" />
        <circle cx="48" cy="18" r="8" fill="#29527C" />
        <circle cx="48" cy="18" r="13" stroke="#29527C" strokeWidth="2" fill="none" />
      </svg>
    ),
    { ...size },
  );
}
