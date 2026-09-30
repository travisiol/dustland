"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { previewTokenByAddress, previewTokens } from "@/lib/preview";
import { totalsOf, type DocketToken, type DocketTotals } from "@/lib/docket";
import { contracts, isLive, launchRules } from "@/lib/site-config";
import { erc20Abi, launchpadAbi, poolAbi } from "@/lib/launchpadAbi";

/*
 * One switch between the docket as a sample and the docket as it is.
 *
 * Before the contracts exist the app reads the labelled preview. The moment
 * the launchpad and router addresses are set, every list and figure comes
 * from the chain instead and nothing above this file changes. Live reads
 * are deliberately narrow: the registry, each token's name, symbol and pool
 * price. Volume, holders and fee income need an indexer and are shown as
 * unset rather than guessed.
 */

interface LaunchTerms {
  /** Flat creation fee in ETH, or null until the contract says. */
  creationFeeEth: number | null;
  /** Opening price in ETH per token, or null until the contract says. */
  openingPriceEth: number | null;
  creatorShareBps: number;
}

interface DocketState {
  isPreview: boolean;
  isLoading: boolean;
  tokens: DocketToken[];
  totals: DocketTotals;
  tokenByAddress: (address: string) => DocketToken | undefined;
  terms: LaunchTerms;
}

const DocketContext = createContext<DocketState | null>(null);

const PAGE = 200n;

function useLiveDocket(): Omit<DocketState, "isPreview" | "tokenByAddress"> {
  const launchpad = contracts.launchpad ?? undefined;

  const count = useReadContract({
    address: launchpad,
    abi: launchpadAbi,
    functionName: "tokenCount",
    query: { enabled: isLive, refetchInterval: 20_000 },
  });

  const list = useReadContract({
    address: launchpad,
    abi: launchpadAbi,
    functionName: "getTokens",
    args: [0n, PAGE],
    query: { enabled: isLive && count.data !== undefined, refetchInterval: 20_000 },
  });

  const fees = useReadContract({
    address: launchpad,
    abi: launchpadAbi,
    functionName: "feeConfig",
    query: { enabled: isLive },
  });

  const geometry = useReadContract({
    address: launchpad,
    abi: launchpadAbi,
    functionName: "startSqrtPriceX96",
    query: { enabled: isLive },
  });

  const addresses = useMemo(() => list.data ?? [], [list.data]);

  const facts = useReadContracts({
    contracts: addresses.flatMap((address) => [
      { address, abi: erc20Abi, functionName: "name" } as const,
      { address, abi: erc20Abi, functionName: "symbol" } as const,
      { address: launchpad, abi: launchpadAbi, functionName: "tokens", args: [address] } as const,
    ]),
    query: { enabled: isLive && addresses.length > 0 },
  });

  const pools = useMemo(() => {
    const out: (`0x${string}` | undefined)[] = [];
    addresses.forEach((_, i) => {
      const record = facts.data?.[i * 3 + 2]?.result as
        | readonly [`0x${string}`, number, number, `0x${string}`, bigint]
        | undefined;
      out.push(record?.[3]);
    });
    return out;
  }, [addresses, facts.data]);

  const prices = useReadContracts({
    contracts: pools.map((pool) => ({ address: pool, abi: poolAbi, functionName: "slot0" }) as const),
    query: {
      enabled: isLive && pools.length > 0 && pools.every(Boolean),
      refetchInterval: 20_000,
    },
  });

  const tokens = useMemo<DocketToken[]>(() => {
    return addresses.map((address, i) => {
      const name = (facts.data?.[i * 3]?.result as string | undefined) ?? "…";
      const symbol = (facts.data?.[i * 3 + 1]?.result as string | undefined) ?? "…";
      const record = facts.data?.[i * 3 + 2]?.result as
        | readonly [`0x${string}`, number, number, `0x${string}`, bigint]
        | undefined;
      const slot0 = prices.data?.[i]?.result as readonly [bigint, ...unknown[]] | undefined;
      const priceEth = slot0 ? priceFromSqrt(slot0[0]) : 0;
      const words = name.split(" ");
      return {
        address,
        pool: record?.[3] ?? ("0x0000000000000000000000000000000000000000" as const),
        creator: record?.[0] ?? ("0x0000000000000000000000000000000000000000" as const),
        number: i + 1,
        name,
        symbol,
        description: "",
        monogram: (words[0]?.[0] ?? "?").toUpperCase() + (words[1]?.[0] ?? words[0]?.[1] ?? "").toUpperCase(),
        hue: hashHue(address),
        feeTierBps: record?.[2] === 3000 ? 30 : 100,
        launchedAgoMs: 0,
        devBuyEth: 0,
        // Live mode is quoted in ETH; the "Usd" fields carry ETH until an
        // ETH/USD reference exists. Labels in the UI follow `isPreview`.
        priceUsd: priceEth,
        openingPriceUsd: geometry.data ? priceFromSqrt(geometry.data) : 0,
        change24h: Number.NaN,
        marketCapUsd: priceEth * launchRules.totalSupply,
        volume24hUsd: Number.NaN,
        holders: Number.NaN,
        creatorFeesUsd: Number.NaN,
        series: [],
        trades: [],
        links: {},
      };
    });
  }, [addresses, facts.data, prices.data, geometry.data]);

  const terms: LaunchTerms = {
    creationFeeEth: fees.data ? Number(formatUnits(fees.data[1], 18)) : null,
    openingPriceEth: geometry.data ? priceFromSqrt(geometry.data) : null,
    creatorShareBps: fees.data ? fees.data[0] : launchRules.creatorFeeShareBps,
  };

  return {
    isLoading: count.isLoading || list.isLoading || facts.isLoading,
    tokens,
    totals: totalsOf(tokens),
    terms,
  };
}

/**
 * Token priced in the quote asset from a v3 sqrtPriceX96. Launch pools put
 * the quote asset at token0, so price(token1 in token0) = 1 / (sqrtP)^2.
 */
function priceFromSqrt(sqrtPriceX96: bigint): number {
  const sqrt = Number(sqrtPriceX96) / 2 ** 96;
  const token1InToken0 = 1 / (sqrt * sqrt);
  return Number.isFinite(token1InToken0) ? token1InToken0 : 0;
}

function hashHue(address: string): number {
  let h = 0;
  for (let i = 2; i < address.length; i += 1) h = (h * 31 + address.charCodeAt(i)) >>> 0;
  return h % 360;
}

function LiveProvider({ children }: { children: ReactNode }) {
  const live = useLiveDocket();
  const value = useMemo<DocketState>(
    () => ({
      ...live,
      isPreview: false,
      tokenByAddress: (address) =>
        live.tokens.find((t) => t.address.toLowerCase() === address.toLowerCase()),
    }),
    [live],
  );
  return <DocketContext.Provider value={value}>{children}</DocketContext.Provider>;
}

const previewState: DocketState = {
  isPreview: true,
  isLoading: false,
  tokens: previewTokens,
  totals: totalsOf(previewTokens),
  tokenByAddress: previewTokenByAddress,
  terms: {
    creationFeeEth: null,
    openingPriceEth: null,
    creatorShareBps: launchRules.creatorFeeShareBps,
  },
};

export function DocketProvider({ children }: { children: ReactNode }) {
  if (isLive) return <LiveProvider>{children}</LiveProvider>;
  return <DocketContext.Provider value={previewState}>{children}</DocketContext.Provider>;
}

export function useDocket(): DocketState {
  const value = useContext(DocketContext);
  if (!value) throw new Error("useDocket must be used inside DocketProvider");
  return value;
}
