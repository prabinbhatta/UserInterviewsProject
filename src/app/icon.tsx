import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="6" cy="16" r="3.4" fill="#12161D" opacity="0.3" />
        <circle cx="16" cy="16" r="7.5" fill="#29527C" />
        <circle cx="16" cy="16" r="10.5" stroke="#29527C" strokeWidth="1.6" fill="none" />
        <circle cx="26" cy="16" r="3.4" fill="#12161D" opacity="0.3" />
      </svg>
    ),
    { ...size },
  );
}
