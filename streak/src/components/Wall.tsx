"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { DayCountdown } from "@/components/ui/Countdown";
import { Label } from "@/components/ui/Label";
import { rules } from "@/lib/site-config";
import { useReducedMotion } from "@/lib/day";
import { days } from "@/lib/format";

/*
 * The wall.
 *
 * Seven rows of days, one column per week, the way a tally is kept on a
 * cell wall: today is the bottom-right cell and time runs back to the
 * top-left. A streak is the run of lit cells ending at today. Heat runs
 * along it — the oldest days have cooled to a deep red and the newest burn
 * almost white — so the length of a streak reads as a temperature before it
 * reads as a number.
 *
 * Nothing on it is a figure. Before launch it plays an illustration of a
 * streak growing and then dying, labelled as such; once live and connected
 * it draws your own.
 */

const ROWS = 7;
const CELLS = ROWS * rules.wallWeeks;
/** The streak the illustration climbs to before it dies. */
const EXAMPLE_STREAK = 31;

/** Heat ramp, oldest to newest. */
const STOPS: [number, number, number][] = [
  [0x8a, 0x1e, 0x08], // cooled
  [0xb7, 0x28, 0x0a], // ember-deep
  [0xff, 0x4b, 0x1f], // ember
  [0xff, 0xb3, 0x40], // ember-hot
  [0xff, 0xf3, 0xda], // ember-white
];

function heat(t: number): string {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (STOPS.length - 1);
  const index = Math.min(STOPS.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const [r1, g1, b1] = STOPS[index];
  const [r2, g2, b2] = STOPS[index + 1];
  const r = Math.round(r1 + (r2 - r1) * local);
  const g = Math.round(g1 + (g2 - g1) * local);
  const b = Math.round(b1 + (b2 - b1) * local);
  return `rgb(${r} ${g} ${b})`;
}

type Phase = "grow" | "hold" | "break" | "empty";

/**
 * The illustration: a streak climbing day by day to a respectable number,
 * then missing one and losing all of it. The loop is the pitch.
 */
function useIllustration(enabled: boolean, target: number) {
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("grow");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let current = 0;
    let alive = true;

    const schedule = (fn: () => void, ms: number) => {
      timer.current = window.setTimeout(() => {
        if (alive) fn();
      }, ms);
    };

    const grow = () => {
      current += 1;
      setLength(current);
      setPhase("grow");
      if (current < target) {
        // Ease in: the first days come quickly, the last ones drag.
        schedule(grow, 90 + (current / target) * 160);
      } else {
        setPhase("hold");
        schedule(brk, 2200);
      }
    };
    const brk = () => {
      setPhase("break");
      schedule(empty, 900);
    };
    const empty = () => {
      current = 0;
      setLength(0);
      setPhase("empty");
      schedule(grow, 1100);
    };

    schedule(grow, 600);
    return () => {
      alive = false;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [enabled, target]);

  return { length, phase };
}

export function Wall({
  streak,
  mode,
  className,
}: {
  /** Live streak length. Ignored in illustration mode. */
  streak: number;
  mode: "illustration" | "live";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const animate = mode === "illustration" && !reduced;

  const illustration = useIllustration(animate, EXAMPLE_STREAK);
  // Reduced motion gets the finished picture instead of the loop.
  const length =
    mode === "illustration"
      ? animate
        ? illustration.length
        : EXAMPLE_STREAK
      : streak;
  const phase: Phase = animate ? illustration.phase : "hold";
  const broken = phase === "break";

  const cells = Array.from({ length: CELLS }, (_, i) => {
    const ago = CELLS - 1 - i; // days before today
    const lit = ago < Math.min(length, CELLS);
    const t = length > 1 ? 1 - ago / Math.min(length, CELLS) : 1;
    return { ago, lit, t };
  });

  return (
    <div className={clsx("slab rounded-2xl p-5 text-paper sm:p-7", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-ember-hot" />
          <Label className="text-paper/60">The wall</Label>
        </div>
        <Label className="text-paper/40">
          {mode === "illustration" ? "Illustration" : "Your streak"}
        </Label>
      </div>

      <div
        className="mt-6 grid gap-[5px] sm:gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${rules.wallWeeks}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
        aria-hidden
      >
        {cells.map(({ ago, lit, t }) => {
          const today = ago === 0;
          const newest = lit && ago === 0;
          const style = lit
            ? broken
              ? { background: "#3a2a24", boxShadow: "none" }
              : {
                  background: heat(t),
                  boxShadow: newest
                    ? "0 0 18px rgba(255, 179, 64, 0.55)"
                    : t > 0.75
                      ? `0 0 8px rgba(255, 75, 31, ${0.25 * t})`
                      : "none",
                  transform: newest ? "scale(1.12)" : undefined,
                }
            : undefined;
          return (
            <div
              key={ago}
              className={clsx("cell", today && !lit && "cell-today")}
              style={style}
            />
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-slab-line pt-6">
        <div>
          <Label className={clsx(broken ? "text-loss" : "text-paper/50")}>
            {broken ? "Missed a day" : phase === "empty" ? "Back to" : "Day"}
          </Label>
          <div
            className={clsx(
              "type-day mt-2 transition-colors duration-300",
              broken ? "text-paper/25 line-through decoration-loss decoration-4" : "text-paper",
            )}
            suppressHydrationWarning
          >
            {broken ? length : phase === "empty" ? 0 : length}
          </div>
        </div>
        <div className="text-right">
          <Label className="text-paper/50">Day resets in</Label>
          <div className="mt-2">
            <DayCountdown className="text-ember-hot" />
            <span className="type-label ml-2 text-paper/40">UTC</span>
          </div>
          <p className="type-data mt-3 max-w-[26ch] text-paper/50">
            {mode === "illustration"
              ? broken
                ? "One missed day. The whole run is gone, and the stake stays in the pot."
                : phase === "empty"
                  ? "Start again at day one. No freezes, no repairs."
                  : `${days(length)} in a row, one check-in each.`
              : streak > 0
                ? `${days(streak)} in a row. Check in before the clock hits zero.`
                : "No streak yet. Day one is one check-in away."}
          </p>
        </div>
      </div>
    </div>
  );
}
