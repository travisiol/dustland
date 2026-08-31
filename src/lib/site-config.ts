export const siteConfig = {
  // Placeholder name — not final. Swapping this one string renames the site
  // everywhere: metadata, nav, OG image, footer.
  name: "DUSTLAND",
  tagline: "The Moon, in 999 parcels.",
  description:
    "Buy shares of lunar ground. The surface is cut into 999 equal parcels, and every parcel has its own token, its own market and its own economy.",
  seoDescription:
    "One body, 999 equal parcels. Every parcel of the Moon has its own token and its own holders.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dustland.example",
  x: process.env.NEXT_PUBLIC_DUSTLAND_X ?? null,
  discord: process.env.NEXT_PUBLIC_DUSTLAND_DISCORD ?? null,
} as const;

function envOrNull(value: string | undefined): string | null {
  return value && value.trim().length > 0 ? value : null;
}

function envInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export const world = {
  totalParcels: 999,
  /**
   * Claims shown before a contract exists. Ignored the moment
   * NEXT_PUBLIC_DUSTLAND_CONTRACT_ADDRESS is set — from then on the map is
   * drawn from the chain's own claim bitmap.
   */
  placeholderClaims: envInt(process.env.NEXT_PUBLIC_DUSTLAND_PLACEHOLDER_CLAIMS, 3),
  maxPerWallet: envInt(process.env.NEXT_PUBLIC_DUSTLAND_MAX_PER_WALLET, 5),
} as const;

/**
 * Claim surface. The address and price are env-driven so no placeholder
 * address or invented price can ship hardcoded; with the address unset the
 * whole claim UI sits in PREVIEW and the button is disabled.
 */
export const claimConfig = {
  contractAddress: envOrNull(
    process.env.NEXT_PUBLIC_DUSTLAND_CONTRACT_ADDRESS,
  ) as `0x${string}` | null,
  /** Price per parcel in ETH as a decimal string, e.g. "0.04". */
  priceEth: envOrNull(process.env.NEXT_PUBLIC_DUSTLAND_PRICE_ETH),
  isLive: process.env.NEXT_PUBLIC_DUSTLAND_LIVE === "true",
} as const;

export const canClaim =
  claimConfig.isLive &&
  claimConfig.contractAddress !== null &&
  claimConfig.priceEth !== null;
