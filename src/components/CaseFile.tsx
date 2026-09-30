"use client";

import Link from "next/link";
import { Label, LiveTag, PreviewTag } from "@/components/ui/Label";
import { Stamp } from "@/components/ui/Stamp";
import { Monogram } from "@/components/ui/Monogram";
import { PriceChart } from "@/components/PriceChart";
import { TradeWidget } from "@/components/TradeWidget";
import { ButtonLink } from "@/components/ui/Button";
import { useDocket } from "@/lib/docketState";
import { docket, eth, price, shortAddress, signedPercent, timeAgo, usd } from "@/lib/format";
import { launchRules } from "@/lib/site-config";
import { robinhoodChain } from "@/lib/chain";

/*
 * A token's page, laid out as its case file: header, the chart as the
 * exhibit, the tape as the record, and the sealed terms in the margin.
 */
export function CaseFile({ address }: { address: string }) {
  const { tokenByAddress, isPreview, isLoading } = useDocket();
  const token = tokenByAddress(address);

  if (!token) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-24 text-center sm:px-6">
        <Label className="text-seal">Case file</Label>
        <h1 className="type-display mt-3 text-ink">
          {isLoading ? "Reading the registry…" : "Not on the docket."}
        </h1>
        {!isLoading && (
          <p className="type-body mx-auto mt-4 max-w-[52ch] text-ink-soft">
            No filed token has the address <span className="type-data">{shortAddress(address)}</span>. Only tokens launched through this contract appear here; anything else claiming to be one is not.
          </p>
        )}
        <div className="mt-8">
          <ButtonLink href="/tokens" variant="outline">
            Back to the docket
          </ButtonLink>
        </div>
      </div>
    );
  }

  const up = !Number.isFinite(token.change24h) || token.change24h >= 0;
  const money = (v: number) => (isPreview ? usd(v) : eth(v, 3));
  const quote = (v: number) => (isPreview ? price(v) : eth(v, 10));
  const explorer = robinhoodChain.blockExplorers.default.url;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-14">
      <nav className="type-label flex items-center gap-2 text-ink-muted">
        <Link href="/tokens" className="link hover:text-ink">Docket</Link>
        <span aria-hidden>/</span>
        <span>{docket(token.number)}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Monogram letters={token.monogram} hue={token.hue} size={72} />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-[40px] leading-none text-ink sm:text-[52px]">{token.name}</h1>
              {isPreview ? <PreviewTag /> : <LiveTag />}
            </div>
            <div className="type-data mt-2.5 text-ink-muted">
              ${token.symbol} · {token.launchedAgoMs > 0 ? `filed ${timeAgo(token.launchedAgoMs)}` : "filed"} · {token.feeTierBps / 100}% pool ·{" "}
              <a className="link" href={`${explorer}/address/${token.address}`} target="_blank" rel="noreferrer">
                {shortAddress(token.address)}
              </a>
            </div>
            {token.description && <p className="type-body mt-3 max-w-[60ch] text-ink-soft">{token.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {token.links.x && <ExtLink href={token.links.x}>X</ExtLink>}
          {token.links.telegram && <ExtLink href={token.links.telegram}>Telegram</ExtLink>}
          {token.links.website && <ExtLink href={token.links.website}>Website</ExtLink>}
          <ExtLink href={`${explorer}/address/${token.pool}`}>Pool</ExtLink>
        </div>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-5">
        <Stat k="Price" v={quote(token.priceUsd)} />
        <Stat k="24h" v={Number.isFinite(token.change24h) ? signedPercent(token.change24h) : "—"} tone={Number.isFinite(token.change24h) ? (up ? "up" : "down") : undefined} />
        <Stat k="Market cap" v={money(token.marketCapUsd)} />
        <Stat k="Volume 24h" v={Number.isFinite(token.volume24hUsd) ? money(token.volume24hUsd) : "—"} />
        <Stat k="Holders" v={Number.isFinite(token.holders) ? token.holders.toLocaleString("en-US") : "—"} />
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <Label>Exhibit · price</Label>
              <span className="type-data text-ink-muted">
                Opened at <span className="text-seal">{quote(token.openingPriceUsd)}</span>
              </span>
            </div>
            <PriceChart series={token.series} openingPrice={token.openingPriceUsd} quote={quote} />
          </section>

          <section className="card">
            <div className="flex items-center justify-between border-b border-rule px-5 py-4 sm:px-6">
              <Label>The record · trades</Label>
              <span className="type-data text-ink-muted">Most recent first</span>
            </div>
            {token.trades.length === 0 ? (
              <p className="type-data px-5 py-8 text-ink-muted sm:px-6">
                {isPreview ? "No trades on record." : "Trades are read from the pool's Swap events by an indexer this build does not include. The pool link above shows them on the explorer."}
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="type-label text-ink-muted">
                    <th className="px-5 py-3 text-left font-medium sm:px-6">Side</th>
                    <th className="px-3 py-3 text-right font-medium">ETH</th>
                    <th className="hidden px-3 py-3 text-right font-medium sm:table-cell">${token.symbol}</th>
                    <th className="hidden px-3 py-3 text-right font-medium md:table-cell">Price</th>
                    <th className="px-3 py-3 text-right font-medium">Trader</th>
                    <th className="px-5 py-3 text-right font-medium sm:px-6">When</th>
                  </tr>
                </thead>
                <tbody>
                  {[...token.trades]
                    .sort((a, b) => a.agoMs - b.agoMs)
                    .map((tr) => (
                      <tr key={tr.id} className="type-data border-t border-rule">
                        <td className="px-5 py-3 sm:px-6">
                          <span className={tr.side === "buy" ? "text-up" : "text-down"}>{tr.side === "buy" ? "Buy" : "Sell"}</span>
                          {tr.isDevBuy && <span className="ml-2 border border-brass/50 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-brass">Dev buy</span>}
                        </td>
                        <td className="px-3 py-3 text-right text-ink">{tr.quoteAmount.toFixed(4)}</td>
                        <td className="hidden px-3 py-3 text-right text-ink-soft sm:table-cell">{Math.round(tr.tokenAmount).toLocaleString("en-US")}</td>
                        <td className="hidden px-3 py-3 text-right text-ink-soft md:table-cell">{quote(tr.priceUsd)}</td>
                        <td className="px-3 py-3 text-right text-ink-soft">
                          {tr.trader.toLowerCase() === token.creator.toLowerCase() ? (
                            <span className="text-brass">creator</span>
                          ) : (
                            shortAddress(tr.trader)
                          )}
                        </td>
                        <td className="px-5 py-3 text-right text-ink-muted sm:px-6">{timeAgo(tr.agoMs)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <TradeWidget token={token} isPreview={isPreview} />

          <section className="card relative p-5 sm:p-6">
            <div className="absolute -top-3 right-5">
              <Stamp size="sm">Sealed</Stamp>
            </div>
            <Label>Terms of this filing</Label>
            <dl className="mt-4 space-y-3">
              <Term k="Supply" v={`${(launchRules.totalSupply / 1e9).toFixed(0)}B, fixed`} />
              <Term k="Liquidity" v="100%, sealed forever" />
              <Term k="Pool fee" v={`${token.feeTierBps / 100}%, fixed for life`} />
              <Term k="Creator share" v={`${launchRules.creatorFeeShareBps / 100}% of fees`} />
              <Term k="Creator allocation" v="0 tokens" />
              <Term k="Dev buy" v={token.devBuyEth > 0 ? eth(token.devBuyEth, 3) : "None"} tone={token.devBuyEth > 0 ? "brass" : undefined} />
              <Term k="Creator" v={shortAddress(token.creator)} href={`${explorer}/address/${token.creator}`} />
              <Term k="Fees earned by creator" v={Number.isFinite(token.creatorFeesUsd) ? money(token.creatorFeesUsd) : "—"} tone="brass" />
            </dl>
            <p className="type-small mt-5 border-t border-rule pt-4 text-ink-muted">
              None of these terms can change. The creator can still buy and sell like anyone; every trade is on the record above.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "up" | "down" }) {
  return (
    <div className="bg-paper p-4 sm:p-5">
      <dt className="type-label text-ink-muted">{k}</dt>
      <dd className={`type-figure mt-2 ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-ink"}`}>{v}</dd>
    </div>
  );
}

function Term({ k, v, tone, href }: { k: string; v: string; tone?: "brass"; href?: string }) {
  const cls = `type-data ${tone === "brass" ? "text-brass" : "text-ink"}`;
  return (
    <div className="leader">
      <dt className="type-data text-ink-muted">{k}</dt>
      <dd className={cls}>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="link">
            {v}
          </a>
        ) : (
          v
        )}
      </dd>
    </div>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="type-label border border-rule px-3 py-2 text-ink-muted transition-colors hover:border-ink hover:text-ink"
    >
      {children}
    </a>
  );
}
