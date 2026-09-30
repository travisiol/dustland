import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Caution tape on black. */
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
          background: "#0b0b0c",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 44,
            height: 20,
            backgroundImage:
              "repeating-linear-gradient(-45deg, #ffd60a 0 6px, #0b0b0c 6px 12px)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
