"use client";

import { useConnection } from "wagmi";
import { Label, LiveTag, PreviewTag } from "@/components/ui/Label";
import { ButtonLink, Button } from "@/components/ui/Button";
import { WalletConnect } from "@/components/WalletConnect";
import { Monogram } from "@/components/ui/Monogram";
import { useDocket } from "@/lib/docketState";
import { docket, eth, shortAddress, usd } from "@/lib/format";
import { isLive, launchRules } from "@/lib/site-config";
import { robinhoodChain } from "@/lib/chain";

/*
 * Chambers. Wallets that filed a token, or that a fee stream was routed
 * to, see every such token here with its claimable and lifetime earnings.
 * Before the contracts exist there is nothing to read, so the page shows
 * the sample docket's creator view instead, labelled.
 */
export function Studio() {
  const { tokens, isPreview } = useDocket();
  const { address, isConnected, chainId } = useConnection();
  const onChain = isConnected && chainId === robinhoodChain.id;
  const money = (v: number) => (isPreview ? usd(v) : eth(v, 4));

  const mine = address
    ? tokens.filter((t) => t.creator.toLowerCase() === address.toLowerCase())
    : [];
  // In preview nobody has filed anything, so show the sample's top earners
  // as an illustration of the view a creator gets.
  const shown = isPreview ? [...tokens].sort((a, b) => b.creatorFeesUsd - a.creatorFeesUsd).slice(0, 4) : mine;
  const lifetime = shown.reduce((s, t) => s + (Number.isFinite(t.creatorFeesUsd) ? t.creatorFeesUsd : 0), 0);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[60ch]">
          <div className="flex items-center gap-3">
            <Label className="text-seal">Studio</Label>
            {isPreview ? <PreviewTag /> : <LiveTag />}
          </div>
          <h1 className="type-display mt-3 text-ink">
            Your filings. <em className="italic-serif">Your stream.</em>
          </h1>
          <p className="type-body mt-5 text-ink-soft">
            {launchRules.creatorFeeShareBps / 100}% of every swap fee on a token you filed, or one routed to you, accrues to the sealed position. Claim it here in one signature, whenever you like. The platform also batch-claims periodically, so fees may simply arrive.
          </p>
        </div>
        {!isConnected && <WalletConnect />}
      </div>

      {isPreview && (
        <p className="type-small mt-6 max-w-[70ch] text-ink-muted">
          Sample view. The contracts are not deployed, so this shows what the studio looks like for a creator with a few filings, not anything of yours.
        </p>
      )}

      <dl className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-3">
        <Stat k="Filings" v={shown.length.toLocaleString("en-US")} />
        <Stat k="Claimable now" v={isPreview ? money(lifetime * 0.18) : "—"} accent />
        <Stat k="Lifetime earned" v={Number.isFinite(lifetime) ? money(lifetime) : "—"} />
      </dl>

      {!isPreview && !onChain ? (
        <div className="card mt-8 p-10 text-center">
          <div className="font-serif text-[28px] text-ink">Connect to see your filings.</div>
          <p className="type-body mx-auto mt-3 max-w-[48ch] text-ink-soft">
            The studio reads the registry for tokens your wallet created or is paid for. Nothing is stored anywhere else.
          </p>
          <div className="mt-6 flex justify-center">
            <WalletConnect />
          </div>
        </div>
      ) : shown.length === 0 ? (
        <div className="card mt-8 p-10 text-center">
          <div className="font-serif text-[28px] text-ink">No filings for {address ? shortAddress(address) : "this wallet"}.</div>
          <p className="type-body mx-auto mt-3 max-w-[48ch] text-ink-soft">
            Tokens you launch, or whose fee stream is routed to you, appear here with their earnings.
          </p>
          <div className="mt-6">
            <ButtonLink href="/launch">File a token</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="card mt-8 divide-y divide-rule">
          {shown.map((t) => (
            <div key={t.address} className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:p-6">
              <div className="flex items-center gap-3">
                <Monogram letters={t.monogram} hue={t.hue} size={40} />
                <div className="min-w-0">
                  <div className="truncate font-serif text-[22px] leading-tight text-ink">{t.name}</div>
                  <div className="type-data text-ink-muted">${t.symbol} · {docket(t.number)} · {t.feeTierBps / 100}% pool</div>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="type-label text-ink-muted">Claimable</div>
                <div className="type-figure mt-1.5 text-brass">{isPreview ? money(t.creatorFeesUsd * 0.18) : "—"}</div>
              </div>
              <div className="sm:text-right">
                <div className="type-label text-ink-muted">Lifetime</div>
                <div className="type-figure mt-1.5 text-ink">{Number.isFinite(t.creatorFeesUsd) ? money(t.creatorFeesUsd) : "—"}</div>
              </div>
              <Button variant="outline" disabled={!isLive} title={isLive ? undefined : "Claiming opens at deployment"}>
                Claim
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="border-t border-rule pt-5">
          <div className="type-title text-ink">Route the stream elsewhere</div>
          <p className="type-body mt-2 text-ink-soft">
            The current recipient can redirect a token&apos;s whole creator share to any wallet. It is irreversible unless the new recipient redirects it back, so double-check the address.
          </p>
        </div>
        <div className="border-t border-rule pt-5">
          <div className="type-title text-ink">What creators cannot do</div>
          <p className="type-body mt-2 text-ink-soft">
            No free supply, no minting, no pausing, no fee changes, no liquidity withdrawal. Your only privileges are the fee stream and the optional dev buy at the public price.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="bg-paper p-5">
      <dt className="type-label text-ink-muted">{k}</dt>
      <dd className={`type-figure-lg mt-2 ${accent ? "text-brass" : "text-ink"}`}>{v}</dd>
    </div>
  );
}
