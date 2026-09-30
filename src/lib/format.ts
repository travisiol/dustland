import { formatEther, parseEther } from "viem";

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** ETH from wei, trimmed: 0.001 not 0.001000000000000000. */
export function eth(wei: bigint, maxDecimals = 4): string {
  const raw = formatEther(wei);
  const [whole, frac = ""] = raw.split(".");
  const trimmed = frac.slice(0, maxDecimals).replace(/0+$/, "");
  return trimmed.length > 0 ? `${whole}.${trimmed}` : whole;
}

export function parseEth(value: string | null): bigint | null {
  if (value === null) return null;
  try {
    return parseEther(value);
  } catch {
    return null;
  }
}

export function count(n: number | bigint): string {
  return Number(n).toLocaleString("en-US");
}

/** "day" or "days". */
export function days(n: number): string {
  return n === 1 ? "1 day" : `${count(n)} days`;
}
