import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WEEKS = 16;
const STREAK = 31;

/** Paper, a wall with a 31-day streak burning across it, and the line. */
export default async function Image() {
  const cells = Array.from({ length: 7 * WEEKS }, (_, i) => {
    const ago = 7 * WEEKS - 1 - i;
    const lit = ago < STREAK;
    const t = 1 - ago / STREAK;
    const color = !lit
      ? "#262119"
      : t > 0.9
        ? "#fff3da"
        : t > 0.7
          ? "#ffb340"
          : t > 0.35
            ? "#ff4b1f"
            : "#b7280a";
    return { color, key: i };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#f4efe6",
          padding: 56,
          gap: 48,
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path
                d="M16 2c1 6-6 8-6 15a6 6 0 0 0 12 0c0-3-2-5-3-6 0 3-2 4-2 4s-1-2 1-5c2.5-3.5 0-8-2-8Z"
                fill="#ff4b1f"
              />
              <path d="M8 29h16" stroke="#15120e" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#15120e", letterSpacing: -1 }}>
              {siteConfig.name}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#15120e", letterSpacing: -4, lineHeight: 0.95 }}>
              Show up.
            </div>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 400, fontStyle: "italic", color: "#ff4b1f", letterSpacing: -3, lineHeight: 0.95, fontFamily: "Georgia, serif" }}>
              Every single day.
            </div>
            <div style={{ display: "flex", marginTop: 28, fontSize: 24, color: "#524a3f" }}>
              Miss one, lose it all. The pot pays whoever is still standing.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 460,
            backgroundColor: "#15120e",
            borderRadius: 24,
            padding: 28,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", width: 404, gap: 4 }}>
            {cells.map((cell) => (
              <div
                key={cell.key}
                style={{ display: "flex", width: 21.5, height: 21.5, borderRadius: 3, backgroundColor: cell.color }}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 14, color: "rgba(244,239,230,0.5)", letterSpacing: 3 }}>DAY</div>
              <div style={{ display: "flex", fontSize: 120, fontWeight: 800, color: "#f4efe6", letterSpacing: -6, lineHeight: 0.9 }}>
                {STREAK}
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#ffb340", fontFamily: "monospace" }}>07:12:44</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
