import type { PricePoint } from "@/lib/docket";

/**
 * A price line small enough to sit in a card. Drawn in ink; the fill takes
 * the market's own colour for the direction, so a glance tells you which
 * way the launch has gone without a number.
 */
export function Sparkline({
  series,
  width = 120,
  height = 36,
  up,
}: {
  series: PricePoint[];
  width?: number;
  height?: number;
  up: boolean;
}) {
  if (series.length < 2) {
    return (
      <svg width={width} height={height} aria-hidden>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="var(--rule-strong)" strokeDasharray="2 3" />
      </svg>
    );
  }
  const min = Math.min(...series.map((p) => p.priceUsd));
  const max = Math.max(...series.map((p) => p.priceUsd));
  const span = max - min || 1;
  const pts = series.map((p, i) => {
    const x = (i / (series.length - 1)) * width;
    const y = height - 2 - ((p.priceUsd - min) / span) * (height - 4);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const colour = up ? "var(--up)" : "var(--down)";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={area} fill={colour} opacity="0.12" />
      <path d={line} fill="none" stroke={colour} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
