"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { Monogram } from "@/components/ui/Monogram";
import { Sparkline } from "@/components/Sparkline";
import { LiveTag, PreviewTag } from "@/components/ui/Label";
import { useDocket } from "@/lib/docketState";
import { docket, eth, signedPercent, timeAgo, usd } from "@/lib/format";
import { launchRules } from "@/lib/site-config";

/*
 * The opening statement. A ruling-sized serif line, three promises under
 * it, and beside it one filed token drawn as a case file with the seal on
 * it — the whole product in a single glance.
 */
export function Hero() {
  const { tokens, isPreview } = useDocket();
  const featured = [...tokens].sort((a, b) => b.volume24hUsd - a.volume24hUsd)[0];

  return (
    <section className="laid border-b border-rule">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-24 lg:pb-28">
        <div>
          <div className="rise flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="type-label text-ink-muted">Robinhood Chain · Uniswap v3</span>
            <span className="hidden h-px w-10 bg-rule-strong sm:block" />
            <span className="type-label text-seal">Fair by construction</span>
          </div>

          <h1 className="type-hero rise rise-2 mt-6 text-ink">
            The market <br className="hidden sm:block" />
            is the <em className="italic-serif text-seal">jury.</em>
          </h1>

          <p className="type-lead rise rise-3 mt-7 max-w-[54ch] text-ink-soft">
            Launch a token in one transaction, straight into a live Uniswap pool with its
            liquidity sealed forever. Same opening price for everyone, including us.
            Creators earn half of every trade, from the first swap, for as long as it trades.
          </p>

          <div className="rise rise-4 mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/launch">Launch a token</ButtonLink>
            <ButtonLink href="/tokens" variant="outline">
              Browse the docket
            </ButtonLink>
            <Link href="/protocol" className="link type-label ml-1 text-ink-muted hover:text-ink">
              Read the rules
            </Link>
          </div>

          <dl className="rise rise-4 mt-12 grid max-w-[640px] grid-cols-3 gap-6 border-t border-rule pt-6">
            <Fact k="Creator allocation" v="0" note="Buys at the public price" />
            <Fact k="Liquidity locked" v="100%" note="From block one, forever" />
            <Fact k="Creator fee share" v={`${launchRules.creatorFeeShareBps / 100}%`} note="Of every swap fee" />
          </dl>
        </div>

        {featured ? <CaseFile token={featured} isPreview={isPreview} /> : <EmptyFile />}
      </div>
    </section>
  );
}

function Fact({ k, v, note }: { k: string; v: string; note: string }) {
  return (
    <div>
      <dt className="type-label text-ink-muted">{k}</dt>
      <dd className="type-figure-lg mt-2 text-ink">{v}</dd>
      <dd className="type-small mt-1.5 text-ink-muted">{note}</dd>
    </div>
  );
}

function CaseFile({
  token,
  isPreview,
}: {
  token: ReturnType<typeof useDocket>["tokens"][number];
  isPreview: boolean;
}) {
  const up = !Number.isFinite(token.change24h) || token.change24h >= 0;
  const money = (v: number) => (isPreview ? usd(v) : eth(v, 3));
  return (
    <Link
      href={`/t/${token.address}`}
      className="card rise rise-3 relative block p-6 transition-colors hover:border-ink sm:p-8"
      style={{ transform: "rotate(-0.6deg)" }}
    >
      <div className="absolute -top-3 right-6 sm:-top-4 sm:right-8">
        <Stamp size="lg" animate>
          Sealed
        </Stamp>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="type-label text-ink-muted">{docket(token.number)} · Case file</span>
        {isPreview ? <PreviewTag /> : <LiveTag />}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <Monogram letters={token.monogram} hue={token.hue} size={64} />
        <div className="min-w-0">
          <div className="truncate font-serif text-[34px] leading-none text-ink">{token.name}</div>
          <div className="type-data mt-2 text-ink-muted">
            ${token.symbol} · filed {timeAgo(token.launchedAgoMs)} · {token.feeTierBps / 100}% pool
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-6">
        <div>
          <div className="type-label text-ink-muted">Market cap</div>
          <div className="type-figure mt-2 text-ink">{money(token.marketCapUsd)}</div>
        </div>
        <div>
          <div className="type-label text-ink-muted">24h</div>
          <div className={`type-figure mt-2 ${up ? "text-up" : "text-down"}`}>
            {Number.isFinite(token.change24h) ? signedPercent(token.change24h) : "—"}
          </div>
        </div>
        <div>
          <div className="type-label text-ink-muted">Volume 24h</div>
          <div className="type-figure mt-2 text-ink">{money(token.volume24hUsd)}</div>
        </div>
        <div>
          <div className="type-label text-ink-muted">Holders</div>
          <div className="type-figure mt-2 text-ink">
            {Number.isFinite(token.holders) ? token.holders.toLocaleString("en-US") : "—"}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-rule pt-5">
        <div className="type-small text-ink-muted">
          Creator earned <span className="text-brass">{money(token.creatorFeesUsd)}</span> in fees
        </div>
        <Sparkline series={token.series} up={up} width={150} height={44} />
      </div>
    </Link>
  );
}

function EmptyFile() {
  return (
    <div className="card rise rise-3 relative p-8" style={{ transform: "rotate(-0.6deg)" }}>
      <div className="type-label text-ink-muted">No. 0001 · Case file</div>
      <div className="mt-6 font-serif text-[34px] leading-none text-ink">Nothing filed yet.</div>
      <p className="type-body mt-4 text-ink-soft">
        The docket is empty. The first launch appears here the moment it confirms, and it opens at the same price as every launch after it.
      </p>
      <div className="mt-6">
        <ButtonLink href="/launch">Be the first</ButtonLink>
      </div>
    </div>
  );
}
