/*
 * VERDICT — the fair-launch launchpad on Robinhood Chain.
 *
 * One string renames the site everywhere: metadata, nav, OG image, footer.
 * Everything that could be a lie before launch (addresses, prices, social
 * links) is env-driven, so nothing placeholder can ship hardcoded.
 */

function envOrNull(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export const siteConfig = {
  name: "VERDICT",
  domain: "verdict.fun",
  tagline: "The market is the jury.",
  description:
    "Launch a token in one transaction, straight into a live Uniswap pool with its liquidity sealed forever. Same opening price for everyone, including us. Creators earn half of every trade.",
  seoDescription:
    "The fair-launch launchpad on Robinhood Chain. One transaction, liquidity sealed forever, the same opening price for everyone, creators paid on every trade.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://verdict.fun",
  x: envOrNull(process.env.NEXT_PUBLIC_VERDICT_X),
  telegram: envOrNull(process.env.NEXT_PUBLIC_VERDICT_TELEGRAM),
  discord: envOrNull(process.env.NEXT_PUBLIC_VERDICT_DISCORD),
  github: envOrNull(process.env.NEXT_PUBLIC_VERDICT_GITHUB),
} as const;

/** The protocol token. Supply is a property of the contract, not a promise. */
export const protocolToken = {
  symbol: "$VERDICT",
  supply: 1_000_000_000,
  /** Share of the protocol's fee income used to buy back the token. */
  buybackShareBps: 5000,
} as const;

/**
 * Launch geometry every token shares. The numbers that are structural
 * (supply, split, tiers) live here; the ones the contract decides (opening
 * FDV, creation fee) are read live once it exists and shown as unset until
 * then. Inventing them here is the one thing a holder could be hurt by.
 */
export const launchRules = {
  totalSupply: 1_000_000_000,
  creatorFeeShareBps: 5000,
  feeTiers: [
    { bps: 30, label: "0.3%", note: "Cheaper to trade" },
    { bps: 100, label: "1%", note: "More revenue per trade" },
  ],
  quoteSymbol: "ETH",
} as const;

/**
 * Contract surface. With any address unset the app is in PREVIEW: the
 * docket shows a labelled sample, the launch button is disabled and says
 * so, and nothing on the site asserts activity that has not happened.
 */
export const contracts = {
  launchpad: envOrNull(process.env.NEXT_PUBLIC_VERDICT_LAUNCHPAD_ADDRESS) as
    | `0x${string}`
    | null,
  router: envOrNull(process.env.NEXT_PUBLIC_VERDICT_ROUTER_ADDRESS) as
    | `0x${string}`
    | null,
  isLive: process.env.NEXT_PUBLIC_VERDICT_LIVE === "true",
} as const;

export const isLive =
  contracts.isLive && contracts.launchpad !== null && contracts.router !== null;
