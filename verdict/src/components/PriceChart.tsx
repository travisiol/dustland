"use client";

import { useMemo, useState } from "react";
import type { PricePoint } from "@/lib/docket";
import { price } from "@/lib/format";

/*
 * The chart on a token page. One ink line on paper, the opening price
 * drawn as a dotted floor because it is one: no liquidity exists below it,
 * so the line can rest on it but never cross it. Hover reads the exact
 * point; nothing is smoothed.
 */
export function PriceChart({
  series,
  openingPrice,
  quote,
}: {
  series: PricePoint[];
  openingPrice: number;
  quote: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 800;
  const H = 300;
  const PAD = { top: 18, right: 14, bottom: 26, left: 14 };

  const geometry = useMemo(() => {
    if (series.length < 2) return null;
    const prices = series.map((p) => p.priceUsd);
    const min = Math.min(openingPrice, ...prices);
    const max = Math.max(...prices);
    const span = max - min || max || 1;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (i / (series.length - 1)) * innerW;
    const y = (v: number) => PAD.top + innerH - ((v - min) / span) * innerH;
    const pts = series.map((p, i) => [x(i), y(p.priceUsd)] as const);
    const line = pts.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
    const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L${PAD.left} ${(PAD.top + innerH).toFixed(1)} Z`;
    return { pts, line, area, floorY: y(openingPrice), min, max, x, y, innerW, innerH };
  }, [series, openingPrice, PAD.left, PAD.right, PAD.top, PAD.bottom]);

  if (!geometry) {
    return (
      <div className="flex h-[300px] items-center justify-center border border-dashed border-rule-strong">
        <span className="type-data text-ink-muted">No trades on record yet.</span>
      </div>
    );
  }

  const last = series[series.length - 1];
  const up = last.priceUsd >= series[0].priceUsd;
  const colour = up ? "var(--up)" : "var(--down)";
  const active = hover !== null ? series[hover] : last;
  const activePt = hover !== null ? geometry.pts[hover] : geometry.pts[geometry.pts.length - 1];

  return (
    <div className="relative">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="type-figure-lg text-ink">{quote(active.priceUsd)}</div>
        <div className="type-data text-ink-muted">
          {active.hoursAgo < 1 ? "now" : `${Math.round(active.hoursAgo)}h ago`}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Price chart, currently ${price(last.priceUsd)}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * W;
          const i = Math.round(((rel - PAD.left) / geometry.innerW) * (series.length - 1));
          setHover(Math.max(0, Math.min(series.length - 1, i)));
        }}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={colour} stopOpacity="0.18" />
            <stop offset="1" stopColor={colour} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + geometry.innerH * f}
            y2={PAD.top + geometry.innerH * f}
            stroke="var(--rule)"
          />
        ))}
        <path d={geometry.area} fill="url(#chart-fill)" />
        <path d={geometry.line} fill="none" stroke={colour} strokeWidth="2" strokeLinejoin="round" />
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={geometry.floorY}
          y2={geometry.floorY}
          stroke="var(--seal)"
          strokeDasharray="3 5"
          strokeWidth="1.25"
        />
        <text x={W - PAD.right} y={geometry.floorY - 6} textAnchor="end" fontSize="11" fontFamily="var(--font-mono)" fill="var(--seal)" letterSpacing="1.5">
          OPENING PRICE · FLOOR
        </text>
        {hover !== null && (
          <line x1={activePt[0]} x2={activePt[0]} y1={PAD.top} y2={PAD.top + geometry.innerH} stroke="var(--rule-strong)" strokeDasharray="2 3" />
        )}
        <circle cx={activePt[0]} cy={activePt[1]} r="4.5" fill="var(--paper)" stroke={colour} strokeWidth="2" />
      </svg>
    </div>
  );
}
