"use client";

import { clsx } from "clsx";
import { nextDayStart, pad, splitCountdown, useNow } from "@/lib/day";

/**
 * Time left in the UTC day. Renders dashes until the client clock exists so
 * the server and first client render never disagree.
 */
export function DayCountdown({ className }: { className?: string }) {
  const now = useNow();
  if (now === null) {
    return <span className={clsx("type-clock", className)}>--:--:--</span>;
  }
  const { hours, minutes, seconds } = splitCountdown(nextDayStart(now) - now);
  return (
    <span className={clsx("type-clock", className)} suppressHydrationWarning>
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </span>
  );
}
