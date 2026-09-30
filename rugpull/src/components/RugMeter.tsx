"use client";

import { clsx } from "clsx";
import { StatusPill } from "@/components/StatusPill";
import { Label } from "@/components/ui/Label";
import { isHot, marketCapSource, phaseCopy, usd, usdExact } from "@/lib/rug";
import { useRug } from "@/lib/useRug";

/*
 * The meter. One bar, one line at the end of it, and the distance between
 * them. Everything on the page is a footnote to this.
 *
 * The bar is yellow while the number is below the line and red once it is
 * past it. There is no green anywhere, because there is no good outcome to
 * colour — only "not yet".
 */
export function RugMeter({ className }: { className?: string }) {
  const { phase, marketCapUsd, progress, distanceUsd, threshold, reading, isLoading, error } =
    useRug();
  const hot = isHot(phase);
  const pct = Math.round(progress * 1000) / 10;

  return (
    <section
      id="meter"
      className={clsx("panel relative scroll-mt-14 overflow-hidden", className)}
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Label className={hot ? "text-blood" : "text-tape"}>
            {phase === "rugged" ? "The rug" : "Distance to rug"}
          </Label>
          <StatusPill />
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Label className="mb-2 block">Market cap</Label>
            <div className={clsx("type-figure", hot ? "text-blood" : "text-bone")}>
              {marketCapUsd === null ? (isLoading ? "…" : "—") : usdExact(marketCapUsd)}
            </div>
          </div>
          <div className="text-right">
            <Label className="mb-2 block">Rug threshold</Label>
            <div className={clsx("type-figure-sm text-[clamp(20px,2.4vw,32px)]", hot ? "text-blood" : "text-tape")}>
              {usdExact(threshold)}
            </div>
          </div>
        </div>

        {/* The bar. The threshold is the hazard band at the far end. */}
        <div className="mt-8">
          <div
            className="relative h-10 border border-rule-strong bg-ink"
            role="progressbar"
            aria-label="Market cap progress towards the rug threshold"
            aria-valuemin={0}
            aria-valuemax={threshold}
            aria-valuenow={Math.min(marketCapUsd ?? 0, threshold)}
          >
            <div
              className={clsx(
                "absolute inset-y-0 left-0 transition-[width] duration-700 ease-out",
                hot ? "hazard-blood animate-crawl" : "bg-tape",
              )}
              style={{ width: `${Math.max(progress * 100, marketCapUsd ? 0.75 : 0)}%` }}
            />
            {/* Milestones — the same nothing, at intervals. */}
            {[25, 50, 75].map((mark) => (
              <span
                key={mark}
                aria-hidden
                className="absolute inset-y-0 w-px bg-rule-strong"
                style={{ left: `${mark}%` }}
              />
            ))}
            <span
              aria-hidden
              className={clsx(
                "absolute inset-y-0 right-0 w-4 border-l border-ink",
                hot ? "hazard-blood" : "hazard",
              )}
            />
          </div>

          <div className="mt-2 flex justify-between">
            <span className="type-label text-bone-muted">$0 · nothing</span>
            <span className="type-label text-bone-muted">
              {phase === "rugged" ? "pulled" : `${pct}% of the way`}
            </span>
            <span className={clsx("type-label", hot ? "text-blood" : "text-tape")}>
              {usd(threshold)} · the rug
            </span>
          </div>
        </div>

        <p className={clsx("type-lede mt-8 max-w-[40ch]", hot ? "text-blood" : "text-bone")}>
          {phaseCopy[phase].headline}
        </p>
        <p className="type-body mt-2 max-w-[52ch] text-bone-soft">
          {phase === "nothing" || phase === "close"
            ? `${usdExact(distanceUsd)} of market cap still to go before anything happens.`
            : phaseCopy[phase].detail}
        </p>

        <p className="type-data mt-6 text-bone-muted">
          {marketCapSource === "none" && "No token address set. Nothing is being read, because there is nothing to read."}
          {marketCapSource === "override" && "Market cap set by hand. The rug is still at $100,000."}
          {marketCapSource === "dexscreener" &&
            (error
              ? `Feed unavailable: ${error}. The rug is still at $100,000.`
              : reading
                ? `Read from the deepest pool every 30 seconds${reading.pairUrl ? " · " : "."}`
                : "Reading the pool…")}
          {marketCapSource === "dexscreener" && reading?.pairUrl && !error && (
            <a
              href={reading.pairUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-rule-strong underline-offset-4 hover:text-tape"
            >
              see the pair
            </a>
          )}
        </p>
      </div>
    </section>
  );
}
