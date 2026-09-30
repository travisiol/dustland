"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Label, LiveTag, PreviewTag } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { TokenCard } from "@/components/TokenCard";
import { useDocket } from "@/lib/docketState";
import { sortTokens, type SortKey } from "@/lib/docket";
import { compact, eth, usd } from "@/lib/format";

const sorts: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "volume", label: "Volume" },
  { key: "marketCap", label: "Market cap" },
  { key: "change", label: "Movers" },
];

export function Docket() {
  const { tokens, totals, isPreview, isLoading } = useDocket();
  const [sort, setSort] = useState<SortKey>("newest");
  const [query, setQuery] = useState("");
  const money = (v: number) => (isPreview ? usd(v) : eth(v, 2));

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? tokens.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.symbol.toLowerCase().includes(q) ||
            t.address.toLowerCase() === q,
        )
      : tokens;
    return sortTokens(filtered, sort);
  }, [tokens, query, sort]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Label className="text-seal">The docket</Label>
            {isPreview ? <PreviewTag /> : <LiveTag />}
          </div>
          <h1 className="type-display mt-3 text-ink">Every filing, in order.</h1>
        </div>
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          <Stat k="Tokens" v={totals.tokens.toLocaleString("en-US")} />
          <Stat k="Volume 24h" v={Number.isFinite(totals.volume24hUsd) ? money(totals.volume24hUsd) : "—"} />
          <Stat k="Paid to creators" v={Number.isFinite(totals.creatorFeesUsd) ? money(totals.creatorFeesUsd) : "—"} accent />
          <Stat k="Holders" v={Number.isFinite(totals.holders) ? compact(totals.holders) : "—"} />
        </dl>
      </div>

      {isPreview && (
        <p className="type-small mt-6 max-w-[70ch] text-ink-muted">
          Sample docket. The contracts are not deployed; these filings exist to show the product and assert nothing about real activity.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-rule py-3">
        <label className="flex flex-1 items-center gap-3 sm:max-w-[360px]">
          <span className="type-label text-ink-muted">Search</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, ticker or address"
            className="type-body w-full bg-transparent py-1.5 text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </label>
        <div className="ml-auto flex items-center gap-1">
          <span className="type-label mr-2 text-ink-muted">Sort</span>
          {sorts.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={clsx(
                "type-label px-3 py-2 transition-colors",
                sort === s.key ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="type-data mt-10 text-ink-muted">Reading the registry…</p>
      ) : shown.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <div className="font-serif text-[28px] text-ink">
            {query ? "Nothing on the docket matches." : "The docket is empty."}
          </div>
          <p className="type-body mx-auto mt-3 max-w-[48ch] text-ink-soft">
            {query
              ? "Try the ticker, or paste the token address."
              : "No token has been filed yet. The first one opens at the same price as every one after it."}
          </p>
          {!query && (
            <div className="mt-6">
              <ButtonLink href="/launch">File the first</ButtonLink>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((t) => (
            <TokenCard key={t.address} token={t} isPreview={isPreview} />
          ))}
        </div>
      )}
    </div>
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
