import type { DocketToken, FeeTierBps, PricePoint, Trade } from "@/lib/docket";
import { launchRules } from "@/lib/site-config";

/*
 * A worked example of a docket a few days old.
 *
 * Nothing here is real. It exists so a visitor can see what a filed token,
 * a chart and a trade tape look like before the contracts are deployed, and
 * it is labelled Preview wherever it is drawn. Scale is kept modest on
 * purpose: a launchpad that is not live yet and shows millions in volume is
 * advertising a lie about its size even with the word "preview" over it.
 *
 * Everything is generated from a fixed seed, so the sample is identical on
 * the server and the client and identical on every visit.
 */

/** Reference ETH price used only to express the sample in dollars. */
export const PREVIEW_ETH_USD = 3200;

/** Opening FDV every sample launch shares, in USD. The contract sets the real one. */
export const PREVIEW_OPENING_FDV_USD = 4000;

export const PREVIEW_OPENING_PRICE_USD =
  PREVIEW_OPENING_FDV_USD / launchRules.totalSupply;

function rng(seed: number): () => number {
  let state = (seed * 2654435761) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexAddress(rand: () => number): `0x${string}` {
  let out = "0x";
  for (let i = 0; i < 40; i += 1) out += Math.floor(rand() * 16).toString(16);
  return out as `0x${string}`;
}

interface Seed {
  name: string;
  symbol: string;
  description: string;
  hue: number;
  feeTierBps: FeeTierBps;
  hoursOld: number;
  /** Multiple of the opening price the token trades at now. */
  mult: number;
  holders: number;
  volume24hUsd: number;
  devBuyEth: number;
  links?: DocketToken["links"];
}

const SEEDS: Seed[] = [
  { name: "Gavel Cat", symbol: "GAVEL", description: "Order in the court. The cat has spoken and the cat is final.", hue: 18, feeTierBps: 100, hoursOld: 62, mult: 9.4, holders: 212, volume24hUsd: 18_400, devBuyEth: 0.15, links: { x: "https://x.com" } },
  { name: "Objection", symbol: "OBJ", description: "Sustained. Every time.", hue: 352, feeTierBps: 100, hoursOld: 41, mult: 4.1, holders: 96, volume24hUsd: 7_900, devBuyEth: 0.05 },
  { name: "Habeas Corgi", symbol: "CORGI", description: "Produce the dog. The dog must be produced.", hue: 34, feeTierBps: 30, hoursOld: 29, mult: 12.8, holders: 301, volume24hUsd: 31_200, devBuyEth: 0.2, links: { x: "https://x.com", telegram: "https://t.me" } },
  { name: "Pro Bono", symbol: "BONO", description: "Free of charge, for the public good, and for the memes.", hue: 205, feeTierBps: 30, hoursOld: 18, mult: 2.3, holders: 58, volume24hUsd: 4_100, devBuyEth: 0 },
  { name: "Mistrial", symbol: "MIST", description: "Something went wrong and we are doing it all again.", hue: 268, feeTierBps: 100, hoursOld: 55, mult: 1.0, holders: 24, volume24hUsd: 640, devBuyEth: 0.02 },
  { name: "Jury Duty", symbol: "DUTY", description: "You have been summoned. Attendance is mandatory.", hue: 150, feeTierBps: 100, hoursOld: 9, mult: 3.6, holders: 71, volume24hUsd: 9_300, devBuyEth: 0.1 },
  { name: "Loophole", symbol: "LOOP", description: "Technically allowed.", hue: 48, feeTierBps: 30, hoursOld: 74, mult: 1.7, holders: 44, volume24hUsd: 1_900, devBuyEth: 0.03 },
  { name: "Bench Press", symbol: "BENCH", description: "The judge lifts. The judge is jacked.", hue: 8, feeTierBps: 100, hoursOld: 5, mult: 6.2, holders: 118, volume24hUsd: 14_700, devBuyEth: 0.12, links: { website: "https://example.com" } },
  { name: "Fine Print", symbol: "FINE", description: "You agreed to this.", hue: 220, feeTierBps: 30, hoursOld: 36, mult: 1.2, holders: 31, volume24hUsd: 1_100, devBuyEth: 0 },
  { name: "Contempt", symbol: "CNTMPT", description: "Held in it. Proudly.", hue: 330, feeTierBps: 100, hoursOld: 2, mult: 2.9, holders: 39, volume24hUsd: 6_200, devBuyEth: 0.08 },
  { name: "Sustained", symbol: "SUST", description: "The chair agrees with you, for once.", hue: 120, feeTierBps: 100, hoursOld: 88, mult: 1.0, holders: 12, volume24hUsd: 210, devBuyEth: 0.01 },
  { name: "Plea Deal", symbol: "PLEA", description: "Take the deal. Everyone takes the deal.", hue: 190, feeTierBps: 30, hoursOld: 13, mult: 1.9, holders: 47, volume24hUsd: 3_300, devBuyEth: 0.04 },
];

function makeSeries(rand: () => number, hoursOld: number, mult: number): PricePoint[] {
  const points = Math.max(24, Math.min(160, Math.round(hoursOld * 2)));
  const open = PREVIEW_OPENING_PRICE_USD;
  const target = open * mult;
  const out: PricePoint[] = [];
  let level = open;
  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    // Drift toward the target with noise that decays as the launch ages,
    // then clamp at the opening price because nothing can trade below it.
    const drift = open + (target - open) * Math.pow(t, 0.8);
    const noise = 1 + (rand() - 0.5) * 0.28 * (1 - t * 0.5);
    level = Math.max(open, drift * noise);
    out.push({ hoursAgo: hoursOld * (1 - t), priceUsd: level });
  }
  out[out.length - 1] = { hoursAgo: 0, priceUsd: target };
  return out;
}

function makeTrades(
  rand: () => number,
  priceUsd: number,
  hoursOld: number,
  devBuyEth: number,
  creator: `0x${string}`,
): Trade[] {
  const count = 14;
  const trades: Trade[] = [];
  let ago = 20_000 + rand() * 240_000;
  for (let i = 0; i < count; i += 1) {
    const side: Trade["side"] = rand() < 0.62 ? "buy" : "sell";
    const quoteAmount = Number((0.004 + rand() * rand() * 0.25).toFixed(4));
    const p = priceUsd * (1 + (rand() - 0.5) * 0.06);
    trades.push({
      id: `t${i}`,
      side,
      quoteAmount,
      tokenAmount: (quoteAmount * PREVIEW_ETH_USD) / p,
      priceUsd: p,
      trader: hexAddress(rand),
      agoMs: ago,
    });
    ago += 30_000 + rand() * 900_000;
  }
  if (devBuyEth > 0) {
    trades.push({
      id: "dev",
      side: "buy",
      quoteAmount: devBuyEth,
      tokenAmount: (devBuyEth * PREVIEW_ETH_USD) / PREVIEW_OPENING_PRICE_USD,
      priceUsd: PREVIEW_OPENING_PRICE_USD,
      trader: creator,
      agoMs: hoursOld * 3_600_000,
      isDevBuy: true,
    });
  }
  return trades;
}

function build(seed: Seed, index: number): DocketToken {
  const rand = rng(index + 11);
  const creator = hexAddress(rand);
  const priceUsd = PREVIEW_OPENING_PRICE_USD * seed.mult;
  const series = makeSeries(rand, seed.hoursOld, seed.mult);
  const dayAgo =
    series.find((p) => p.hoursAgo <= 24) ?? series[0];
  const change24h =
    seed.hoursOld <= 24
      ? (priceUsd / PREVIEW_OPENING_PRICE_USD - 1) * 100
      : (priceUsd / dayAgo.priceUsd - 1) * 100;
  const feeRate = seed.feeTierBps / 10_000;
  // Roughly: lifetime volume ≈ 24h volume scaled by age, creator gets half the fee.
  const lifetimeVolume = seed.volume24hUsd * Math.max(1, seed.hoursOld / 24) * 0.8;
  const creatorFeesUsd = lifetimeVolume * feeRate * 0.5;
  const words = seed.name.split(" ");
  return {
    address: hexAddress(rand),
    pool: hexAddress(rand),
    creator,
    number: index + 1,
    name: seed.name,
    symbol: seed.symbol,
    description: seed.description,
    monogram: (words[0][0] + (words[1]?.[0] ?? words[0][1])).toUpperCase(),
    hue: seed.hue,
    feeTierBps: seed.feeTierBps,
    launchedAgoMs: seed.hoursOld * 3_600_000,
    devBuyEth: seed.devBuyEth,
    priceUsd,
    openingPriceUsd: PREVIEW_OPENING_PRICE_USD,
    change24h,
    marketCapUsd: priceUsd * launchRules.totalSupply,
    volume24hUsd: seed.volume24hUsd,
    holders: seed.holders,
    creatorFeesUsd,
    series,
    trades: makeTrades(rand, priceUsd, seed.hoursOld, seed.devBuyEth, creator),
    links: seed.links ?? {},
  };
}

// Docket numbers follow launch order, oldest first.
const ordered = [...SEEDS].sort((a, b) => b.hoursOld - a.hoursOld);

export const previewTokens: DocketToken[] = ordered.map(build);

export function previewTokenByAddress(address: string): DocketToken | undefined {
  const needle = address.toLowerCase();
  return previewTokens.find((t) => t.address.toLowerCase() === needle);
}
