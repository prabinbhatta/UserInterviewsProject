import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 96 96" fill="none">
        <rect x="8" y="19" width="53" height="42" rx="13" fill="#1B2F45" />
        <path d="M19 61 L19 75 L32 61 Z" fill="#1B2F45" />
        <rect x="35" y="35" width="53" height="42" rx="13" fill="#29527C" stroke="#EEF1F4" strokeWidth="3" />
        <path d="M77 77 L77 91 L64 77 Z" fill="#29527C" />
      </svg>
    ),
    { ...size },
  );
}
