"use client";

import { clsx } from "clsx";
import { Label, SectionHeading } from "@/components/ui/Label";
import { isHot, rugConfig, usdExact } from "@/lib/rug";
import { useNow, useRug } from "@/lib/useRug";

const DAY_MS = 86_400_000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** d / h / m / s since launch, or dashes before the clock has started. */
function elapsed(from: Date | null, now: number | null) {
  if (!from || now === null) return null;
  const total = Math.max(0, Math.floor((now - from.getTime()) / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/*
 * The record. A log of every day since launch, each entry reporting that
 * nothing happened, and a clock counting the seconds during which nothing
 * has happened. On most projects the timeline is where the promises go.
 * On this one it is where they are kept.
 */
export function Record() {
  const { phase, marketCapUsd } = useRug();
  const now = useNow();
  const hot = isHot(phase);
  const since = elapsed(rugConfig.launchedAt, now);

  const launched = rugConfig.launchedAt;
  const daysSince =
    launched && now !== null
      ? Math.max(0, Math.floor((now - launched.getTime()) / DAY_MS))
      : null;

  // Most recent first, capped so a long quiet stretch stays readable.
  const visible = 6;
  const days =
    daysSince === null
      ? []
      : Array.from({ length: Math.min(daysSince + 1, visible) }, (_, i) => daysSince - i);
  const hidden = daysSince === null ? 0 : Math.max(0, daysSince + 1 - visible);

  return (
    <section id="record" className="scroll-mt-14 border-b border-rule px-4 py-16 sm:px-6">
      <SectionHeading kicker="The record" title="Everything that has happened so far" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="panel p-6">
          <Label className={hot ? "text-blood" : "text-tape"}>
            {phase === "rugged"
              ? "Time during which nothing happened"
              : "Time during which nothing has happened"}
          </Label>
          <div
            className={clsx(
              "mt-4 grid grid-cols-4 gap-2",
              hot ? "text-blood" : "text-bone",
            )}
            aria-live="off"
          >
            {(
              [
                ["d", since?.days],
                ["h", since?.hours],
                ["m", since?.minutes],
                ["s", since?.seconds],
              ] as const
            ).map(([unit, value]) => (
              <div key={unit} className="border border-rule bg-ink p-3 text-center">
                <div className="type-figure-sm text-[clamp(20px,3vw,32px)]">
                  {value === undefined ? "--" : pad(value)}
                </div>
                <div className="type-label mt-2 text-bone-muted">{unit}</div>
              </div>
            ))}
          </div>
          <p className="type-data mt-4 text-bone-muted">
            {launched
              ? `Counting since ${launched.toISOString().slice(0, 10)}.`
              : "The clock starts at launch. There is no launch yet, so it has not started. Nothing has happened for exactly as long as you would expect."}
          </p>
        </div>

        <ol className="divide-y divide-rule border-y border-rule">
          {phase === "rugged" && (
            <li className="flex items-baseline gap-4 py-4">
              <span className="type-label w-20 shrink-0 text-blood">Day {daysSince ?? "?"}</span>
              <span className="type-body text-blood">
                The rug was pulled at {usdExact(100_000)}. As announced.
              </span>
            </li>
          )}
          {days.map((day, i) => (
            <li key={day} className="flex items-baseline gap-4 py-4">
              <span className="type-label w-20 shrink-0 text-bone-muted">Day {day}</span>
              <span className="type-body text-bone-soft">
                {i === 0 && phase !== "rugged"
                  ? marketCapUsd === null
                    ? "Nothing has happened so far."
                    : `Nothing has happened so far. Market cap ${usdExact(marketCapUsd)}. Rug: not yet.`
                  : "Nothing happened."}
              </span>
            </li>
          ))}
          {hidden > 0 && (
            <li className="flex items-baseline gap-4 py-4">
              <span className="type-label w-20 shrink-0 text-bone-muted">…</span>
              <span className="type-data text-bone-muted">
                and {hidden} more {hidden === 1 ? "day" : "days"} on which nothing happened.
              </span>
            </li>
          )}
          {daysSince === null && (
            <li className="flex items-baseline gap-4 py-4">
              <span className="type-label w-20 shrink-0 text-bone-muted">Day 0</span>
              <span className="type-body text-bone-soft">
                Not launched. Nothing happened. Off to a strong start.
              </span>
            </li>
          )}
        </ol>
      </div>
    </section>
  );
}
