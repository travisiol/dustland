"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { parseEther, parseUnits } from "viem";
import { useConnection, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/Button";
import { WalletConnect } from "@/components/WalletConnect";
import { routerAbi } from "@/lib/launchpadAbi";
import type { DocketToken } from "@/lib/docket";
import { PREVIEW_ETH_USD } from "@/lib/preview";
import { compact, eth, usd } from "@/lib/format";
import { contracts, isLive } from "@/lib/site-config";
import { robinhoodChain } from "@/lib/chain";

/*
 * Buy and sell against the pool. The quote is an estimate off the current
 * pool price with a linear impact term; the chain's exact fill is what the
 * slippage floor protects, and it is enforced on-chain, not here.
 *
 * In preview there is no pool to hit, so the button says so instead of
 * looking live and doing nothing.
 */
export function TradeWidget({ token, isPreview }: { token: DocketToken; isPreview: boolean }) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState(1);
  const { isConnected, chainId } = useConnection();
  const { writeContract, isPending, error, data: txHash } = useWriteContract();

  const feeRate = token.feeTierBps / 10_000;
  // Price of one token in ETH. Preview prices are USD; live prices are ETH.
  const priceEth = isPreview ? token.priceUsd / PREVIEW_ETH_USD : token.priceUsd;
  const poolDepthEth = isPreview ? token.marketCapUsd / PREVIEW_ETH_USD : token.marketCapUsd;

  const parsed = Number.parseFloat(amount);
  const valid = Number.isFinite(parsed) && parsed > 0;

  const quote = useMemo(() => {
    if (!valid || priceEth <= 0) return null;
    if (side === "buy") {
      const ethIn = parsed;
      const impact = poolDepthEth > 0 ? Math.min(0.9, ethIn / (poolDepthEth * 2)) : 0;
      const tokensOut = (ethIn * (1 - feeRate)) / priceEth / (1 + impact);
      return { out: tokensOut, impact, fee: ethIn * feeRate };
    }
    const tokensIn = parsed;
    const ethGross = tokensIn * priceEth;
    const impact = poolDepthEth > 0 ? Math.min(0.9, ethGross / (poolDepthEth * 2)) : 0;
    const ethOut = (ethGross * (1 - feeRate)) / (1 + impact);
    return { out: ethOut, impact, fee: ethGross * feeRate };
  }, [valid, parsed, side, priceEth, poolDepthEth, feeRate]);

  const onChain = isConnected && chainId === robinhoodChain.id;
  const canTrade = isLive && contracts.router !== null && onChain && quote !== null && !isPending;

  function submit() {
    if (!quote || !contracts.router) return;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10);
    const min = quote.out * (1 - slippage / 100);
    if (side === "buy") {
      writeContract({
        address: contracts.router,
        abi: routerAbi,
        functionName: "buy",
        args: [token.pool, parseUnits(min.toFixed(18), 18), deadline],
        value: parseEther(amount),
      });
    } else {
      writeContract({
        address: contracts.router,
        abi: routerAbi,
        functionName: "sell",
        args: [token.pool, parseUnits(parsed.toFixed(18), 18), parseEther(min.toFixed(18)), deadline],
      });
    }
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="grid grid-cols-2 border border-rule-strong p-0.5">
        {(["buy", "sell"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSide(s)}
            className={clsx(
              "type-label py-2.5 transition-colors",
              side === s ? (s === "buy" ? "bg-up text-paper" : "bg-down text-paper") : "text-ink-muted hover:text-ink",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <label className="mt-5 block">
        <span className="type-label text-ink-muted">{side === "buy" ? "You pay" : "You sell"}</span>
        <div className="mt-2 flex items-baseline gap-3 border-b border-rule-strong pb-2">
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            className="type-figure-lg w-full bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <span className="type-label shrink-0 text-ink-muted">{side === "buy" ? "ETH" : `$${token.symbol}`}</span>
        </div>
      </label>

      {side === "buy" && (
        <div className="mt-3 flex gap-2">
          {["0.01", "0.05", "0.1", "0.5"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className="type-label flex-1 border border-rule py-1.5 text-ink-muted transition-colors hover:border-ink hover:text-ink"
            >
              {v}
            </button>
          ))}
        </div>
      )}

      <dl className="mt-5 space-y-2.5">
        <Row k={side === "buy" ? "You receive" : "You receive"} v={quote ? (side === "buy" ? `${compact(quote.out)} $${token.symbol}` : eth(quote.out, 5)) : "—"} strong />
        <Row k={`Pool fee (${token.feeTierBps / 100}%)`} v={quote ? eth(quote.fee, 5) : "—"} />
        <Row k="Est. price impact" v={quote ? `${(quote.impact * 100).toFixed(2)}%` : "—"} warn={!!quote && quote.impact > 0.05} />
        <Row
          k="Slippage tolerance"
          v={
            <span className="flex gap-1">
              {[0.5, 1, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlippage(s)}
                  className={clsx("type-data px-1.5", slippage === s ? "bg-ink text-paper" : "text-ink-muted hover:text-ink")}
                >
                  {s}%
                </button>
              ))}
            </span>
          }
        />
        {isPreview && <Row k="Reference" v={`1 ETH = ${usd(PREVIEW_ETH_USD)} (sample)`} />}
      </dl>

      <div className="mt-6">
        {!isLive ? (
          <>
            <Button disabled className="w-full">
              Trading opens at launch
            </Button>
            <p className="type-small mt-3 text-ink-muted">
              The pool contracts are not deployed yet. This widget is wired and turns on by itself when they are.
            </p>
          </>
        ) : !isConnected || !onChain ? (
          <WalletConnect wrapperClassName="w-full" className="w-full" />
        ) : (
          <Button
            variant={side === "buy" ? "ink" : "outline"}
            disabled={!canTrade}
            onClick={submit}
            className="w-full"
          >
            {isPending ? "Confirm in wallet…" : side === "buy" ? `Buy $${token.symbol}` : `Sell $${token.symbol}`}
          </Button>
        )}
        {error && <p className="type-small mt-3 text-down">{error.message.split("\n")[0]}</p>}
        {txHash && (
          <p className="type-small mt-3 text-up">
            Submitted.{" "}
            <a className="link" href={`${robinhoodChain.blockExplorers.default.url}/tx/${txHash}`} target="_blank" rel="noreferrer">
              View on explorer
            </a>
          </p>
        )}
      </div>

      <p className="type-small mt-5 border-t border-rule pt-4 text-ink-muted">
        Your minimum-receive amount is enforced on-chain. If the pool moves past your tolerance before the transaction lands, it reverts and your funds stay in your wallet, minus gas.
      </p>
    </div>
  );
}

function Row({ k, v, strong, warn }: { k: string; v: React.ReactNode; strong?: boolean; warn?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="type-data text-ink-muted">{k}</dt>
      <dd className={clsx("type-data text-right", strong ? "text-ink font-medium" : warn ? "text-down" : "text-ink-soft")}>{v}</dd>
    </div>
  );
}
