import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The flame on paper. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4efe6",
          borderRadius: 14,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 32 32">
          <path
            d="M16 2c1 6-6 8-6 15a6 6 0 0 0 12 0c0-3-2-5-3-6 0 3-2 4-2 4s-1-2 1-5c2.5-3.5 0-8-2-8Z"
            fill="#ff4b1f"
          />
          <path d="M8 29h16" stroke="#15120e" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
