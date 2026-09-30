"use client";

import Link from "next/link";
import { useDocket } from "@/lib/docketState";
import { LiveTag, PreviewTag } from "@/components/ui/Label";
import { Monogram } from "@/components/ui/Monogram";
import { signedPercent, usd, eth } from "@/lib/format";

/*
 * The tape. Every filed token, most recent first, on a loop. Before the
 * contracts exist it carries the labelled sample; after, the chain.
 */
export function Ticker() {
  const { tokens, isPreview } = useDocket();
  const items = [...tokens].sort((a, b) => a.launchedAgoMs - b.launchedAgoMs);

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-4 border-y border-rule bg-paper-deep px-4 py-2.5">
        <LiveTag />
        <span className="type-data text-ink-muted">No token has been filed yet. The docket is empty and the first launch will appear here.</span>
      </div>
    );
  }

  return (
    <div className="flex items-stretch border-y border-rule bg-paper-deep">
      <span className="flex shrink-0 items-center border-r border-rule px-4">
        {isPreview ? <PreviewTag /> : <LiveTag />}
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-ticker">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {items.map((t) => (
                <li key={t.address} className="flex items-center whitespace-nowrap border-r border-rule">
                  <Link
                    href={`/t/${t.address}`}
                    tabIndex={copy === 1 ? -1 : 0}
                    className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-paper-raised"
                  >
                    <Monogram letters={t.monogram} hue={t.hue} size={20} />
                    <span className="type-data text-ink">${t.symbol}</span>
                    <span className="type-data text-ink-muted">
                      {isPreview ? usd(t.marketCapUsd) : eth(t.marketCapUsd, 2)}
                    </span>
                    {Number.isFinite(t.change24h) && (
                      <span className={`type-data ${t.change24h >= 0 ? "text-up" : "text-down"}`}>
                        {signedPercent(t.change24h)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
