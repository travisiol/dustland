"use client";

import { clsx } from "clsx";
import { Label, LiveDot, PreLaunchStamp } from "@/components/ui/Label";
import { explorerUrl } from "@/lib/chain";
import { useGame } from "@/lib/gameState";
import { formatDate } from "@/lib/day";
import { count, shortAddress } from "@/lib/format";
import { gameConfig, rules } from "@/lib/site-config";

/*
 * The board. Ten rows, longest first, each streak drawn as a bar of ember
 * against the longest so the gap between first and tenth is visible before
 * a number is read. Empty before launch, and shown empty: the first wallet
 * to check in is, for one day, the longest streak in the world.
 */
export function Leaderboard() {
  const { board, live, today, stats } = useGame();
  const longest = Math.max(1, stats.longest, ...board.map((row) => row.length));
  const rows = Array.from({ length: rules.boardSize }, (_, i) => board[i] ?? null);

  return (
    <section id="board" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              {live ? <LiveDot /> : <PreLaunchStamp />}
              <Label className="text-ember">The board</Label>
            </div>
            <h2 className="type-display mt-4 text-ink">Still standing.</h2>
          </div>
          <p className="type-body max-w-[40ch] text-ink-soft">
            {board.length > 0
              ? `The ${count(board.length)} longest live streaks, read from the chain every ${gameConfig.pollMs / 1000} seconds.`
              : "Nobody has checked in yet. The first wallet to do it will be the longest streak in the world for a whole day."}
          </p>
        </div>

        <ol className="mt-12 border-t border-line-strong">
          {rows.map((row, index) => (
            <li
              key={row ? row.account : index}
              className={clsx(
                "grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-4 sm:grid-cols-[3rem_10rem_1fr_7rem_5rem] sm:gap-6",
                !row && "text-ink-muted",
              )}
            >
              <span className="type-data">{String(index + 1).padStart(2, "0")}</span>

              <span className="type-data truncate">
                {row ? (
                  explorerUrl ? (
                    <a
                      href={`${explorerUrl}/address/${row.account}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink transition-colors hover:text-ember"
                    >
                      {shortAddress(row.account)}
                    </a>
                  ) : (
                    <span className="text-ink">{shortAddress(row.account)}</span>
                  )
                ) : (
                  "—"
                )}
              </span>

              <span className="hidden h-2 overflow-hidden rounded-full bg-paper-deep sm:block">
                {row && (
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-ember-deep via-ember to-ember-hot"
                    style={{ width: `${Math.max(2, (row.length / longest) * 100)}%` }}
                  />
                )}
              </span>

              <span className="type-data hidden text-ink-muted sm:block">
                {row ? `since ${formatDate(today - row.length + 1)}` : ""}
              </span>

              <span className="type-figure text-right text-ink">
                {row ? (
                  <>
                    {count(row.length)}
                    <span className="type-label ml-1 text-ink-muted">d</span>
                  </>
                ) : (
                  <span className="text-ink-muted">—</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
