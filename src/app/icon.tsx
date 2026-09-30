import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The mark: an ink disc with the seal's strike line. */
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
          background: "#f5f1e8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 24,
            background: "#16130f",
            paddingBottom: 9,
          }}
        >
          <div style={{ display: "flex", width: 18, height: 5, background: "#c8102e", borderRadius: 3 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
