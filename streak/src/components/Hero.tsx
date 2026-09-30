"use client";

import { CheckIn } from "@/components/CheckIn";
import { Wall } from "@/components/Wall";
import { ButtonLink } from "@/components/ui/Button";
import { Label, PreLaunchStamp } from "@/components/ui/Label";
import { useGame } from "@/lib/gameState";
import { rules } from "@/lib/site-config";

/*
 * The pitch on the left, the wall on the right. The headline is the whole
 * product in four words; the wall shows what those words cost.
 */
export function Hero() {
  const game = useGame();
  const showMine = game.live && game.me !== null && game.myStatus !== "disconnected";

  return (
    <section className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.02fr_1fr] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
      <div>
        <div className="flex items-center gap-3">
          <Label className="text-ember">A daily on-chain game</Label>
          {!game.live && <PreLaunchStamp />}
        </div>

        <h1 className="type-hero mt-6 text-ink">
          Show up.
          <br />
          <span className="type-hero-accent">Every single day.</span>
        </h1>

        <p className="type-lead mt-8 max-w-[46ch] text-ink-soft">
          One check-in a day keeps your streak alive. Miss one and it is gone,
          and everything you put in stays in the pot. Every{" "}
          {rules.payoutEveryDays} days the pot pays out to whoever is still
          standing, weighted by how long they have lasted.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <CheckIn />
          <ButtonLink href="#how" className="px-8 py-5">
            How it works
          </ButtonLink>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {[
            "One check-in per UTC day",
            "No freezes, no repairs",
            "Longer streak, bigger cut",
          ].map((line) => (
            <li key={line} className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              <span className="type-data text-ink-soft">{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <Wall
        mode={showMine ? "live" : "illustration"}
        streak={showMine ? (game.me?.length ?? 0) : 0}
      />
    </section>
  );
}
