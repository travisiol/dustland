/*
 * One string renames the product everywhere: metadata, nav, wall, OG image,
 * footer. The env prefix stays NEXT_PUBLIC_STREAK_* regardless.
 */
export const siteConfig = {
  name: "STREAK",
  tagline: "Show up every day.",
  description:
    "One on-chain check-in a day keeps your streak alive. Miss one and it dies, and everything you put in stays in the pot. Every week the pot pays whoever is still standing.",
  seoDescription:
    "A daily on-chain streak game. Check in once a day. Miss one, lose it all. The pot pays whoever is still standing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://streak.example",
  x: envOrNull(process.env.NEXT_PUBLIC_STREAK_X),
  discord: envOrNull(process.env.NEXT_PUBLIC_STREAK_DISCORD),
  telegram: envOrNull(process.env.NEXT_PUBLIC_STREAK_TELEGRAM),
} as const;

function envOrNull(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value.trim() : null;
}

/**
 * The rules, as constants, so the copy and the contract can never disagree
 * about them. Change a number here and every sentence that quotes it
 * follows.
 */
export const rules = {
  /** Days between payouts. The pot is split every N days at 00:00 UTC. */
  payoutEveryDays: 7,
  /** Weekday of the payout, 0 = Sunday, in UTC. */
  payoutWeekday: 0,
  /** Rows shown on the board. */
  boardSize: 10,
  /** Days across the wall. 7 rows × this many columns. */
  wallWeeks: 16,
} as const;

/**
 * Contract surface. Address and entry are env-driven so no placeholder
 * address or invented price can ship hardcoded. With the address unset the
 * whole game sits in pre-launch: every figure is a real zero and the
 * check-in button is disabled and says why.
 */
export const gameConfig = {
  contractAddress: envOrNull(
    process.env.NEXT_PUBLIC_STREAK_CONTRACT_ADDRESS,
  ) as `0x${string}` | null,
  /** Entry per check-in in ETH as a decimal string, e.g. "0.001". */
  entryEth: envOrNull(process.env.NEXT_PUBLIC_STREAK_ENTRY_ETH),
  isLive: process.env.NEXT_PUBLIC_STREAK_LIVE === "true",
  /** How often the page re-reads the chain, in ms. */
  pollMs: 20_000,
} as const;

export const isLive =
  gameConfig.isLive &&
  gameConfig.contractAddress !== null &&
  gameConfig.entryEth !== null;
