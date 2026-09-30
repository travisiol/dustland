/* Number formatting for a market surface: always tabular, never ambiguous. */

export function usd(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 10_000) return `$${(value / 1_000).toFixed(1)}K`;
  if (value >= 1_000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value === 0) return "$0";
  return `$${value.toPrecision(3)}`;
}

/** Sub-cent token prices need their zeros or they all read as $0.00. */
export function price(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1) return `$${value.toFixed(3)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  const exp = Math.floor(Math.log10(value));
  const digits = Math.min(12, -exp + 3);
  return `$${value.toFixed(digits)}`;
}

export function eth(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toLocaleString("en-US", { maximumFractionDigits: digits })} ETH`;
}

export function compact(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export function signedPercent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function percent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function timeAgo(msAgo: number): string {
  const s = Math.max(0, Math.floor(msAgo / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Docket numbers are zero-padded so a fresh launch still looks filed. */
export function docket(n: number): string {
  return `No. ${String(n).padStart(4, "0")}`;
}
