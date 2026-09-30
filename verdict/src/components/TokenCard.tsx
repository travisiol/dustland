"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Monogram } from "@/components/ui/Monogram";
import { Sparkline } from "@/components/Sparkline";
import type { DocketToken } from "@/lib/docket";
import { docket, eth, signedPercent, timeAgo, usd } from "@/lib/format";

/*
 * One filing. The card reads top to bottom the way a case header does:
 * number and time, the mark and the name, then the figures, then the line.
 */
export function TokenCard({
  token,
  isPreview,
  featured = false,
}: {
  token: DocketToken;
  isPreview: boolean;
  featured?: boolean;
}) {
  const up = !Number.isFinite(token.change24h) || token.change24h >= 0;
  const money = (v: number) => (isPreview ? usd(v) : eth(v, 3));

  return (
    <Link
      href={`/t/${token.address}`}
      className={clsx(
        "card group flex flex-col gap-4 p-5 transition-colors duration-150 hover:border-ink",
        featured && "md:p-6",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="type-label text-ink-muted">{docket(token.number)}</span>
        <span className="type-label text-ink-muted">
          {token.launchedAgoMs > 0 ? timeAgo(token.launchedAgoMs) : "Filed"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Monogram letters={token.monogram} hue={token.hue} size={featured ? 48 : 40} />
        <div className="min-w-0">
          <div className={clsx("truncate font-serif leading-tight text-ink", featured ? "text-[26px]" : "text-[21px]")}>
            {token.name}
          </div>
          <div className="type-data text-ink-muted">
            ${token.symbol} · {token.feeTierBps / 100}% pool
          </div>
        </div>
      </div>

      {token.description && (
        <p className="type-small line-clamp-2 text-ink-soft">{token.description}</p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-rule pt-4">
        <div>
          <div className="type-label text-ink-muted">Market cap</div>
          <div className="type-figure mt-1.5 text-ink">{money(token.marketCapUsd)}</div>
          <div className="type-data mt-1.5 flex items-center gap-2">
            {Number.isFinite(token.change24h) ? (
              <span className={up ? "text-up" : "text-down"}>{signedPercent(token.change24h)}</span>
            ) : (
              <span className="text-ink-muted">—</span>
            )}
            {Number.isFinite(token.volume24hUsd) && (
              <span className="text-ink-muted">{money(token.volume24hUsd)} 24h</span>
            )}
          </div>
        </div>
        <Sparkline series={token.series} up={up} width={featured ? 140 : 110} height={featured ? 44 : 36} />
      </div>
    </Link>
  );
}
