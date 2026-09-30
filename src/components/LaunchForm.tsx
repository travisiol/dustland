"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { isAddress, parseEther } from "viem";
import { useConnection, useWriteContract } from "wagmi";
import { Label, LiveTag, PreviewTag } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Stamp } from "@/components/ui/Stamp";
import { Monogram } from "@/components/ui/Monogram";
import { WalletConnect } from "@/components/WalletConnect";
import { useDocket } from "@/lib/docketState";
import { launchpadAbi } from "@/lib/launchpadAbi";
import { contracts, isLive, launchRules } from "@/lib/site-config";
import { robinhoodChain } from "@/lib/chain";
import { eth } from "@/lib/format";

/*
 * The filing form. Everything on the left is immutable the moment the
 * transaction confirms, and the preview on the right is drawn from the
 * same state so what you see is what gets sealed.
 *
 * Metadata (image, description, links) is meant to be pinned to IPFS and
 * passed as a URI. This build has no pinning service, so the URI field is
 * exposed directly: paste an ipfs:// or https:// pointer, or leave it
 * empty.
 */
export function LaunchForm() {
  const { terms, isPreview } = useDocket();
  const { address, isConnected, chainId } = useConnection();
  const { writeContract, isPending, error, data: txHash } = useWriteContract();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [feeTier, setFeeTier] = useState<30 | 100>(100);
  const [devBuy, setDevBuy] = useState("");
  const [recipient, setRecipient] = useState("");
  const [routeElsewhere, setRouteElsewhere] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const cleanSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  const devBuyNum = Number.parseFloat(devBuy);
  const devBuyValid = devBuy === "" || (Number.isFinite(devBuyNum) && devBuyNum >= 0);
  const recipientValid = !routeElsewhere || isAddress(recipient);

  const problems: string[] = [];
  if (name.trim().length < 2) problems.push("A name of at least two characters.");
  if (cleanSymbol.length < 2) problems.push("A ticker of two to eight letters or digits.");
  if (!devBuyValid) problems.push("A dev buy that is a number, or empty.");
  if (!recipientValid) problems.push("A valid address for the fee recipient.");
  if (!understood) problems.push("Confirmation that the terms are immutable.");

  const onChain = isConnected && chainId === robinhoodChain.id;
  const creationFee = terms.creationFeeEth;
  const totalEth = (creationFee ?? 0) + (devBuyValid && devBuy !== "" ? devBuyNum : 0);
  const openingPrice = terms.openingPriceEth;
  const devBuyTokens =
    openingPrice && devBuyValid && devBuy !== "" ? devBuyNum / openingPrice : null;

  const canSubmit = isLive && contracts.launchpad !== null && onChain && problems.length === 0 && creationFee !== null && !isPending;

  function submit() {
    if (!contracts.launchpad || creationFee === null) return;
    writeContract({
      address: contracts.launchpad,
      abi: launchpadAbi,
      functionName: "createToken",
      args: [
        name.trim(),
        cleanSymbol,
        metadataURI.trim(),
        0n,
        feeTier === 30 ? 3000 : 10000,
        routeElsewhere && isAddress(recipient) ? recipient : "0x0000000000000000000000000000000000000000",
      ],
      value: parseEther(totalEth.toFixed(18)),
    });
  }

  const words = name.trim().split(/\s+/);
  const monogram = ((words[0]?.[0] ?? "?") + (words[1]?.[0] ?? words[0]?.[1] ?? "")).toUpperCase();
  const hue = useMemo(() => {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return h % 360;
  }, [name]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-[60ch]">
        <div className="flex items-center gap-3">
          <Label className="text-seal">File a token</Label>
          {isPreview ? <PreviewTag /> : <LiveTag />}
        </div>
        <h1 className="type-display mt-3 text-ink">
          One transaction. <em className="italic-serif">Sealed on confirmation.</em>
        </h1>
        <p className="type-body mt-5 text-ink-soft">
          Fill in the filing, confirm once. Your token deploys, its pool opens at the fixed opening
          price, the entire supply is sealed as liquidity, and it is live and tradable everywhere at
          once. Nothing below can be edited afterwards, by you or by us.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
        <form
          className="space-y-9"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Fieldset n="01" title="The token">
            <Field label="Name" hint="Immutable">
              <input value={name} onChange={(e) => setName(e.target.value.slice(0, 40))} placeholder="Gavel Cat" className={inputCls} maxLength={40} />
            </Field>
            <Field label="Ticker" hint="2–8 characters, immutable">
              <div className="flex items-baseline gap-1 border-b border-rule-strong">
                <span className="type-figure text-ink-muted">$</span>
                <input value={cleanSymbol} onChange={(e) => setSymbol(e.target.value)} placeholder="GAVEL" className={clsx(inputCls, "border-b-0")} maxLength={8} />
              </div>
            </Field>
            <Field label="Description" hint="Shown on the case file">
              <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 240))} rows={3} placeholder="Order in the court." className={clsx(inputCls, "resize-none")} />
            </Field>
            <Field label="Metadata URI" hint="ipfs:// or https://, optional">
              <input value={metadataURI} onChange={(e) => setMetadataURI(e.target.value)} placeholder="ipfs://…" className={inputCls} />
            </Field>
          </Fieldset>

          <Fieldset n="02" title="The pool">
            <div className="grid gap-3 sm:grid-cols-2">
              {launchRules.feeTiers.map((tier) => (
                <button
                  key={tier.bps}
                  type="button"
                  onClick={() => setFeeTier(tier.bps)}
                  className={clsx(
                    "flex items-center justify-between border p-4 text-left transition-colors",
                    feeTier === tier.bps ? "border-ink bg-paper-raised" : "border-rule hover:border-ink-muted",
                  )}
                >
                  <span>
                    <span className="type-figure block text-ink">{tier.label}</span>
                    <span className="type-small mt-1 block text-ink-muted">{tier.note}</span>
                  </span>
                  <span className={clsx("h-4 w-4 rounded-full border", feeTier === tier.bps ? "border-ink bg-ink" : "border-rule-strong")} />
                </button>
              ))}
            </div>
            <p className="type-small text-ink-muted">
              The swap fee every trade pays, on every venue, for the life of the token. Half of it is yours.
            </p>
          </Fieldset>

          <Fieldset n="03" title="Your first buy" optional>
            <Field label="Dev buy" hint="ETH, optional">
              <div className="flex items-baseline gap-2 border-b border-rule-strong">
                <input inputMode="decimal" value={devBuy} onChange={(e) => setDevBuy(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" className={clsx(inputCls, "border-b-0")} />
                <span className="type-label text-ink-muted">ETH</span>
              </div>
            </Field>
            <p className="type-small text-ink-muted">
              Executes at the public opening price, inside the launch transaction, before anyone else can reach the pool. You receive no free or discounted tokens, and the buy is labelled on-chain as yours forever.
              {devBuyTokens !== null && (
                <> At the current opening price that is about <span className="text-ink">{Math.round(devBuyTokens).toLocaleString("en-US")}</span> tokens.</>
              )}
            </p>
          </Fieldset>

          <Fieldset n="04" title="Who gets paid">
            <div className="flex gap-3">
              {[
                { on: false, label: "Me", note: address ? address : "The connected wallet" },
                { on: true, label: "Another wallet", note: "A multisig, a friend, a treasury" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setRouteElsewhere(opt.on)}
                  className={clsx(
                    "flex-1 border p-4 text-left transition-colors",
                    routeElsewhere === opt.on ? "border-ink bg-paper-raised" : "border-rule hover:border-ink-muted",
                  )}
                >
                  <span className="type-title block text-ink">{opt.label}</span>
                  <span className="type-data mt-1 block truncate text-ink-muted">{opt.note}</span>
                </button>
              ))}
            </div>
            {routeElsewhere && (
              <Field label="Fee recipient" hint="Can be redirected later by the current recipient only">
                <input value={recipient} onChange={(e) => setRecipient(e.target.value.trim())} placeholder="0x…" className={clsx(inputCls, "type-data")} />
              </Field>
            )}
          </Fieldset>

          <div className="border-t border-rule-strong pt-6">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--seal)]" />
              <span className="type-body text-ink-soft">
                I understand that the name, ticker, supply, metadata, pool and fee terms are immutable once the transaction confirms, and that the creator receives zero free tokens.
              </span>
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!isLive ? (
                <Button disabled>Launching opens at deployment</Button>
              ) : !onChain ? (
                <WalletConnect />
              ) : (
                <Button type="submit" disabled={!canSubmit}>
                  {isPending ? "Confirm in wallet…" : `File $${cleanSymbol || "TOKEN"} · ${creationFee !== null ? eth(totalEth, 4) : "…"}`}
                </Button>
              )}
              {problems.length > 0 && isLive && onChain && (
                <span className="type-small text-ink-muted">Still needed: {problems[0]}</span>
              )}
            </div>
            {!isLive && (
              <p className="type-small mt-3 max-w-[60ch] text-ink-muted">
                The launchpad contract is not deployed yet. This form is wired to it and enables itself the moment it exists; nothing here is a sample of a launch that happened.
              </p>
            )}
            {error && <p className="type-small mt-3 text-down">{error.message.split("\n")[0]}</p>}
            {txHash && (
              <p className="type-small mt-3 text-up">
                Filed.{" "}
                <a className="link" href={`${robinhoodChain.blockExplorers.default.url}/tx/${txHash}`} target="_blank" rel="noreferrer">
                  View on explorer
                </a>
              </p>
            )}
          </div>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="card relative p-6" style={{ transform: "rotate(0.5deg)" }}>
            <div className="absolute -top-3 right-5">
              <Stamp size="sm">{understood ? "Ready to seal" : "Draft"}</Stamp>
            </div>
            <Label>Preview · case file</Label>
            <div className="mt-5 flex items-center gap-4">
              <Monogram letters={name ? monogram : "?"} hue={name ? hue : 30} size={56} />
              <div className="min-w-0">
                <div className="truncate font-serif text-[28px] leading-none text-ink">{name.trim() || "Untitled"}</div>
                <div className="type-data mt-2 text-ink-muted">${cleanSymbol || "TOKEN"} · {feeTier / 100}% pool</div>
              </div>
            </div>
            <p className="type-small mt-4 min-h-[2.5em] text-ink-soft">{description || "No description yet."}</p>
          </div>

          <dl className="card divide-y divide-rule">
            <Line k="Total supply" v="1,000,000,000" />
            <Line k="Sealed as liquidity" v="100%" />
            <Line k="Opening price" v={openingPrice !== null ? eth(openingPrice, 10) : "Set by the contract"} muted={openingPrice === null} />
            <Line k="Creation fee" v={creationFee !== null ? eth(creationFee, 4) : "Read at deployment"} muted={creationFee === null} />
            <Line k="Dev buy" v={devBuyValid && devBuy !== "" && devBuyNum > 0 ? eth(devBuyNum, 4) : "None"} />
            <Line k="You pay" v={creationFee !== null ? eth(totalEth, 4) : "—"} strong />
            <Line k="Your fee share" v={`${terms.creatorShareBps / 100}% of every swap`} accent />
            <Line k="Your token allocation" v="0" />
          </dl>

          <p className="type-small text-ink-muted">
            Gas is paid in ETH on Robinhood Chain. The creation fee and opening price are read live from the contract; this page never invents them.
          </p>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "type-body w-full border-b border-rule-strong bg-transparent py-2 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none";

function Fieldset({ n, title, optional, children }: { n: string; title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t border-rule pt-6 sm:grid-cols-[120px_1fr]">
      <legend className="sr-only">{title}</legend>
      <div>
        <span className="type-figure-lg block text-ink-faint">{n}</span>
        <span className="type-title mt-2 block text-ink">{title}</span>
        {optional && <span className="type-label mt-1 block text-ink-muted">Optional</span>}
      </div>
      <div className="space-y-5">{children}</div>
    </fieldset>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="type-label text-ink-muted">{label}</span>
        {hint && <span className="type-small text-ink-faint">{hint}</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Line({ k, v, strong, muted, accent }: { k: string; v: string; strong?: boolean; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3.5">
      <dt className="type-data text-ink-muted">{k}</dt>
      <dd className={clsx("type-data text-right", strong ? "text-ink font-medium" : accent ? "text-brass" : muted ? "text-ink-muted italic" : "text-ink")}>{v}</dd>
    </div>
  );
}
