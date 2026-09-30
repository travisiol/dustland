"use client";

import { clsx } from "clsx";
import { Label, LiveDot, PreLaunchStamp } from "@/components/ui/Label";
import { useGame } from "@/lib/gameState";
import { count, eth } from "@/lib/format";
import { nextPayoutStart, pad, splitCountdown, useNow } from "@/lib/day";

/*
 * Four readings off the chain. All zero before launch, and shown as zero:
 * an empty board is a stronger opening than an invented one, and it means
 * no holder can be misled by a figure that was never real.
 */
function PayoutClock() {
  const now = useNow();
  if (now === null) return <span className="type-figure text-ink">--</span>;
  const { days, hours, minutes } = splitCountdown(nextPayoutStart(now) - now);
  return (
    <span className="type-figure text-ink" suppressHydrationWarning>
      {days}d {pad(hours)}h {pad(minutes)}m
    </span>
  );
}

export function Stats() {
  const { stats, live } = useGame();

  const items = [
    { key: "Streaks alive", value: count(stats.alive), note: "wallets that checked in yesterday or today" },
    { key: "Longest alive", value: `${count(stats.longest)}d`, note: "the streak to beat" },
    { key: "In the pot", value: `${eth(stats.potWei, 3)} ETH`, note: "paid out at the next reset" },
    { key: "Died today", value: count(stats.brokenToday), note: "streaks that missed the day", tone: "loss" as const },
  ];

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 py-5">
          {live ? <LiveDot /> : <PreLaunchStamp />}
          <Label>{live ? "Live from the chain" : "Every figure is a real zero"}</Label>
        </div>
        <dl className="grid grid-cols-2 gap-px border-t border-line lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.key} className="border-b border-r border-line py-6 pr-4 last:border-r-0 lg:border-b-0">
              <dt>
                <Label>{item.key}</Label>
              </dt>
              <dd
                className={clsx(
                  "type-figure mt-3",
                  item.tone === "loss" && stats.brokenToday > 0 ? "text-loss" : "text-ink",
                )}
              >
                {item.value}
              </dd>
              <dd className="type-data mt-2 text-ink-muted">{item.note}</dd>
            </div>
          ))}
          <div className="col-span-2 border-line py-6 lg:col-span-1">
            <dt>
              <Label>Next payout</Label>
            </dt>
            <dd className="mt-3">
              <PayoutClock />
            </dd>
            <dd className="type-data mt-2 text-ink-muted">Sunday 00:00 UTC, every week</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
