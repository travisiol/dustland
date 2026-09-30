"use client";

import { clsx } from "clsx";
import { isHot, phaseCopy, usdExact } from "@/lib/rug";
import { useRug } from "@/lib/useRug";

/*
 * Caution tape, in words. Every line is true at the moment it scrolls by.
 */
export function Ticker() {
  const { phase, marketCapUsd, distanceUsd, threshold } = useRug();
  const hot = isHot(phase);

  const lines =
    phase === "rugged"
      ? [
          "The rug was pulled",
          `Threshold was ${usdExact(threshold)}`,
          "You were told",
          "This page said so from day one",
          "Nobody was surprised",
          "Thank you for participating in an honest rug",
        ]
      : [
          phaseCopy[phase].headline,
          `Rug threshold: ${usdExact(threshold)}`,
          marketCapUsd === null
            ? "Market cap: not launched"
            : `Market cap: ${usdExact(marketCapUsd)}`,
          phase === "due"
            ? "Threshold crossed"
            : `${usdExact(distanceUsd)} of nothing left to go`,
          "No roadmap. No utility. One warning.",
          "Below $100K nothing happens",
          "The dev has announced the rug so you don't have to guess",
          "Still nothing",
        ];

  return (
    <div className="flex items-stretch border-b border-rule bg-ink">
      <span
        className={clsx(
          "flex shrink-0 items-center gap-2 border-r border-rule px-4 py-2.5",
          hot ? "text-blood" : "text-tape",
        )}
      >
        <span className={clsx("h-2 w-2", hot ? "bg-blood animate-blink" : "bg-tape")} />
        <span className="type-label">{hot ? "Alert" : "Notice"}</span>
      </span>

      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-ticker">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {lines.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-4 whitespace-nowrap px-6 py-2.5"
                >
                  <span className="type-data text-bone-soft">{line}</span>
                  <span aria-hidden className={hot ? "text-blood/60" : "text-tape/60"}>
                    ▲
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
