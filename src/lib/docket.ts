/*
 * The docket: every token this launchpad has filed.
 *
 * Types are shared between the two sources the app can read from — the
 * chain once the contracts exist, and a labelled sample before they do.
 * Nothing in the UI knows which one it is looking at except the Preview
 * tag, which is rendered wherever sample figures appear.
 */

export type FeeTierBps = 30 | 100;

export interface Trade {
  id: string;
  side: "buy" | "sell";
  /** Quote-asset amount (ETH) that changed hands. */
  quoteAmount: number;
  tokenAmount: number;
  priceUsd: number;
  trader: `0x${string}`;
  /** Milliseconds before "now". Relative, so a sample never goes stale. */
  agoMs: number;
  isDevBuy?: boolean;
}

export interface PricePoint {
  /** Hours before now, descending toward zero. */
  hoursAgo: number;
  priceUsd: number;
}

export interface DocketToken {
  address: `0x${string}`;
  pool: `0x${string}`;
  creator: `0x${string}`;
  /** Position on the docket, 1-based, in launch order. */
  number: number;
  name: string;
  symbol: string;
  description: string;
  /** A two-letter monogram drawn as the token's mark until IPFS media exists. */
  monogram: string;
  /** Hue for the monogram plate, 0–360. Only decorative. */
  hue: number;
  feeTierBps: FeeTierBps;
  launchedAgoMs: number;
  devBuyEth: number;
  priceUsd: number;
  openingPriceUsd: number;
  change24h: number;
  marketCapUsd: number;
  volume24hUsd: number;
  holders: number;
  /** Lifetime fees the creator side has earned, in USD. */
  creatorFeesUsd: number;
  series: PricePoint[];
  trades: Trade[];
  links: { x?: string; telegram?: string; website?: string };
}

export interface DocketTotals {
  tokens: number;
  volume24hUsd: number;
  creatorFeesUsd: number;
  holders: number;
}

export function totalsOf(tokens: DocketToken[]): DocketTotals {
  return tokens.reduce<DocketTotals>(
    (acc, t) => ({
      tokens: acc.tokens + 1,
      volume24hUsd: acc.volume24hUsd + t.volume24hUsd,
      creatorFeesUsd: acc.creatorFeesUsd + t.creatorFeesUsd,
      holders: acc.holders + t.holders,
    }),
    { tokens: 0, volume24hUsd: 0, creatorFeesUsd: 0, holders: 0 },
  );
}

export type SortKey = "newest" | "volume" | "marketCap" | "change";

export function sortTokens(tokens: DocketToken[], key: SortKey): DocketToken[] {
  const copy = [...tokens];
  switch (key) {
    case "newest":
      return copy.sort((a, b) => a.launchedAgoMs - b.launchedAgoMs);
    case "volume":
      return copy.sort((a, b) => b.volume24hUsd - a.volume24hUsd);
    case "marketCap":
      return copy.sort((a, b) => b.marketCapUsd - a.marketCapUsd);
    case "change":
      return copy.sort((a, b) => b.change24h - a.change24h);
  }
}
