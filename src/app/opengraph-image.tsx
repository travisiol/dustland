import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

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
          backgroundColor: "#f5f1e8",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 22, color: "#857d71", letterSpacing: 5 }}>
            ROBINHOOD CHAIN · UNISWAP V3 · NON-CUSTODIAL
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              border: "3px solid #c8102e",
              color: "#c8102e",
              fontSize: 20,
              letterSpacing: 5,
              transform: "rotate(-6deg)",
            }}
          >
            SEALED
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, color: "#16130f", lineHeight: 0.95, letterSpacing: -3 }}>
            The market
          </div>
          <div style={{ display: "flex", fontSize: 128, lineHeight: 0.95, letterSpacing: -3 }}>
            <span style={{ color: "#16130f" }}>is the&nbsp;</span>
            <span style={{ color: "#c8102e", fontStyle: "italic" }}>jury.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#4b453c" }}>
            One transaction. Liquidity sealed forever. Same price for everyone.
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#16130f" }}>{siteConfig.name.charAt(0)}{siteConfig.name.slice(1).toLowerCase()}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
