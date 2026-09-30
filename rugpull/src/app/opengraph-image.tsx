import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const stripes =
  "repeating-linear-gradient(-45deg, #ffd60a 0 18px, #0b0b0c 18px 36px)";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0b0b0c",
        }}
      >
        <div style={{ display: "flex", height: 24, backgroundImage: stripes }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: 64,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#7d786f", letterSpacing: 6 }}>
            PUBLIC SERVICE ANNOUNCEMENT · ROBINHOOD CHAIN
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 88, color: "#f4f0e8", fontWeight: 900, lineHeight: 1 }}>
              THIS TOKEN WILL BE
            </div>
            <div style={{ display: "flex", fontSize: 88, color: "#ffd60a", fontWeight: 900, lineHeight: 1 }}>
              RUGGED AT $100K.
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#b3ada3" }}>
              Below that, nothing happens. You have been told.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 36, height: 36, background: "#ffd60a" }} />
            <div style={{ display: "flex", fontSize: 26, color: "#b3ada3", letterSpacing: 4 }}>
              {siteConfig.name}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", height: 24, backgroundImage: stripes }} />
      </div>
    ),
    { ...size },
  );
}
