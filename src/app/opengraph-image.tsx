import { ImageResponse } from "next/og";
import { siteConfig, world } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
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
          justifyContent: "space-between",
          backgroundColor: "#07080a",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 22, color: "#7e7a73", letterSpacing: 6 }}>
          {world.totalParcels} EQUAL PARCELS · ROBINHOOD CHAIN
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, color: "#efebe4", letterSpacing: 2 }}>
            TAKE YOUR GROUND
          </div>
          <div style={{ display: "flex", marginTop: 28, alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", width: 40, height: 40, background: "#ff9e2c" }} />
            <div style={{ display: "flex", fontSize: 26, color: "#ada79e" }}>
              {siteConfig.name}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
