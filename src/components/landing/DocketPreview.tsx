"use client";

import { Label, LiveTag, PreviewTag } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { TokenCard } from "@/components/TokenCard";
import { useDocket } from "@/lib/docketState";
import { sortTokens } from "@/lib/docket";
import { compact, eth, usd } from "@/lib/format";

export function DocketPreview() {
  const { tokens, totals, isPreview } = useDocket();
  const latest = sortTokens(tokens, "newest").slice(0, 6);
  const money = (v: number) => (isPreview ? usd(v) : eth(v, 2));

  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Label className="text-seal">The docket</Label>
              {isPreview ? <PreviewTag /> : <LiveTag />}
            </div>
            <h2 className="type-display mt-3 text-ink">Latest filings</h2>
          </div>
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            <Stat k="Tokens filed" v={totals.tokens.toLocaleString("en-US")} />
            <Stat k="Volume 24h" v={Number.isFinite(totals.volume24hUsd) ? money(totals.volume24hUsd) : "—"} />
            <Stat k="Paid to creators" v={Number.isFinite(totals.creatorFeesUsd) ? money(totals.creatorFeesUsd) : "—"} accent />
            <Stat k="Holders" v={Number.isFinite(totals.holders) ? compact(totals.holders) : "—"} />
          </dl>
        </div>

        {isPreview && (
          <p className="type-small mt-6 max-w-[70ch] text-ink-muted">
            The contracts are not deployed yet. Everything below is a worked example of what a
            docket a few days old looks like, so you can see the product before the first real
            filing. No figure here is a claim about anything that has happened.
          </p>
        )}

        {latest.length === 0 ? (
          <div className="card mt-10 p-10 text-center">
            <div className="font-serif text-[28px] text-ink">The docket is empty.</div>
            <p className="type-body mx-auto mt-3 max-w-[48ch] text-ink-soft">
              No token has been filed yet. The first one opens at the same price as every one after it.
            </p>
            <div className="mt-6">
              <ButtonLink href="/launch">File the first</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((t) => (
              <TokenCard key={t.address} token={t} isPreview={isPreview} />
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <ButtonLink href="/tokens" variant="outline">
            See the whole docket
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div>
      <dt className="type-label text-ink-muted">{k}</dt>
      <dd className={`type-figure mt-2 ${accent ? "text-brass" : "text-ink"}`}>{v}</dd>
    </div>
  );
}
