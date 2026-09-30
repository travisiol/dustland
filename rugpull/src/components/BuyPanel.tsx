"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Label, SectionHeading } from "@/components/ui/Label";
import { robinhoodChain } from "@/lib/chain";
import { rugConfig, shortAddress, tokenPrice, usdExact } from "@/lib/rug";
import { siteConfig } from "@/lib/site-config";
import { useRug } from "@/lib/useRug";

/*
 * The place where you do the thing the page told you not to be surprised
 * by. Every field is real or says it is not set; nothing here is a
 * placeholder pretending to be a contract.
 */
export function BuyPanel() {
  const { phase, reading, marketCapUsd, threshold } = useRug();
  const [copied, setCopied] = useState(false);
  const address = rugConfig.tokenAddress;

  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard refused; the address is on screen anyway.
    }
  };

  const rows = [
    { key: "Token", value: siteConfig.ticker },
    { key: "Chain", value: robinhoodChain.name },
    { key: "Rug at", value: usdExact(threshold) },
    { key: "Market cap", value: marketCapUsd === null ? "Not launched" : usdExact(marketCapUsd) },
    { key: "Price", value: tokenPrice(reading?.priceUsd ?? null) },
    ...(rugConfig.totalSupply ? [{ key: "Supply", value: rugConfig.totalSupply }] : []),
  ];

  return (
    <section id="buy" className="scroll-mt-14 border-b border-rule px-4 py-16 sm:px-6">
      <SectionHeading kicker="Participate" title="Buy the rug" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="panel p-6">
          <Label className="mb-3 block">Contract</Label>
          {address ? (
            <div className="flex flex-wrap items-center gap-3">
              <code className="type-data break-all text-bone">{address}</code>
              <Button variant="outline" onClick={copy} className="px-3 py-2">
                {copied ? "Copied" : "Copy"}
              </Button>
              <a
                href={`${robinhoodChain.blockExplorers.default.url}/token/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label text-bone-soft underline decoration-rule-strong underline-offset-4 hover:text-tape"
              >
                {shortAddress(address)} on explorer
              </a>
            </div>
          ) : (
            <p className="type-body text-bone-soft">
              Not deployed. There is no address, so there is nothing to buy,
              so nothing is happening. Consistent.
            </p>
          )}

          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {rows.map((row) => (
              <div key={row.key} className="flex items-baseline justify-between py-3">
                <dt className="type-label text-bone-muted">{row.key}</dt>
                <dd className="type-data text-bone">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            {phase === "rugged" ? (
              <Button disabled className="w-full">
                Rugged. You were told.
              </Button>
            ) : rugConfig.buyUrl ? (
              <ButtonLink href={rugConfig.buyUrl} external className="w-full">
                Buy {siteConfig.ticker} — you have been told
              </ButtonLink>
            ) : (
              <Button disabled className="w-full">
                Not launched. Nothing is happening.
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6">
          <div>
            <h3 className="type-title text-bone">Before you press it</h3>
            <ul className="mt-4 space-y-3">
              {[
                "This token will be rugged at $100,000 market cap.",
                "You are reading that sentence before buying, which is more than any other rug has offered you.",
                "If you are holding when the line is crossed, you are holding the bag. That is what a rug is.",
                "Nothing on this page is financial advice. It is the opposite: a financial warning, with a number on it.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-tape" />
                  <span className="type-body text-bone-soft">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hazard h-3 w-full" aria-hidden />
        </div>
      </div>
    </section>
  );
}
