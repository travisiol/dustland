"use client";

import Link from "next/link";
import { Flame } from "@/components/Flame";
import { WalletConnect } from "@/components/WalletConnect";
import { DayCountdown } from "@/components/ui/Countdown";
import { Label, LiveDot } from "@/components/ui/Label";
import { siteConfig } from "@/lib/site-config";
import { useGame } from "@/lib/gameState";
import { count } from "@/lib/format";

/*
 * The header carries the one number that matters at every moment: how long
 * until the day resets. Everything else on the page is about what you do
 * before that clock hits zero.
 */
export function Navbar() {
  const { stats } = useGame();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-ink">
          <Flame size={26} className="text-ember" />
          <span className="type-title tracking-tight">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <LiveDot />
          <Label>Day resets in</Label>
          <DayCountdown className="text-ink" />
          <Label className="hidden lg:inline">UTC</Label>
        </div>

        <ul className="ml-auto hidden items-center gap-6 lg:flex">
          <li className="flex items-baseline gap-2">
            <Label>Alive</Label>
            <span className="type-data text-ink">{count(stats.alive)}</span>
          </li>
          <li className="flex items-baseline gap-2">
            <Label>Longest</Label>
            <span className="type-data text-ink">{count(stats.longest)}</span>
          </li>
          <li>
            <a
              href="#how"
              className="type-label text-ink-soft transition-colors hover:text-ember"
            >
              How it works
            </a>
          </li>
          <li>
            <a
              href="#board"
              className="type-label text-ink-soft transition-colors hover:text-ember"
            >
              Board
            </a>
          </li>
        </ul>

        <div className="ml-auto lg:ml-0">
          <WalletConnect hint={false} />
        </div>
      </nav>
    </header>
  );
}
