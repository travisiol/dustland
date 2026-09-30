"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useConnection, useReadContract } from "wagmi";
import { streakAbi } from "@/lib/streakAbi";
import { gameConfig, isLive, rules } from "@/lib/site-config";
import { dayIndex } from "@/lib/day";
import { parseEth } from "@/lib/format";

/*
 * The state of the game, read once and shared.
 *
 * Before the contract exists every number here is a real zero, not a
 * sample. That is deliberate: a board with nobody on it is the strongest
 * thing this page can say right now — day one has not happened, and
 * whoever checks in first is the longest streak in the world — and it means
 * nothing on the page ever has to explain which of its figures are made up.
 *
 * This module is the seam. Once NEXT_PUBLIC_STREAK_CONTRACT_ADDRESS is set
 * the same shape is filled from the chain and every component keeps working
 * unchanged.
 */

export interface Stats {
  alive: number;
  longest: number;
  potWei: bigint;
  brokenToday: number;
}

export interface BoardRow {
  account: `0x${string}`;
  length: number;
}

export interface MyStreak {
  length: number;
  lastDay: number;
  stakedWei: bigint;
}

export type MyStatus =
  /** Wallet not connected. */
  | "disconnected"
  /** Never checked in, or the last streak died. Next check-in is day 1. */
  | "fresh"
  /** Checked in yesterday, not yet today. The streak is alive and waiting. */
  | "due"
  /** Checked in today. Nothing to do until tomorrow. */
  | "done"
  /** Missed a day. The streak is gone; the stake stays in the pot. */
  | "dead";

export interface GameState {
  live: boolean;
  /** Today's UTC day index. */
  today: number;
  stats: Stats;
  board: BoardRow[];
  entryFeeWei: bigint | null;
  me: MyStreak | null;
  myStatus: MyStatus;
  isLoading: boolean;
  refetch: () => void;
}

const ZERO: Stats = { alive: 0, longest: 0, potWei: 0n, brokenToday: 0 };

const GameContext = createContext<GameState | null>(null);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useConnection();
  const contract = gameConfig.contractAddress ?? undefined;
  const enabled = isLive && contract !== undefined;
  const today = dayIndex();

  const statsRead = useReadContract({
    abi: streakAbi,
    address: contract,
    functionName: "stats",
    query: { enabled, refetchInterval: gameConfig.pollMs },
  });

  const boardRead = useReadContract({
    abi: streakAbi,
    address: contract,
    functionName: "leaderboard",
    args: [BigInt(rules.boardSize)],
    query: { enabled, refetchInterval: gameConfig.pollMs },
  });

  const feeRead = useReadContract({
    abi: streakAbi,
    address: contract,
    functionName: "entryFee",
    query: { enabled },
  });

  const meRead = useReadContract({
    abi: streakAbi,
    address: contract,
    functionName: "streakOf",
    args: address ? [address] : undefined,
    query: {
      enabled: enabled && !!address,
      refetchInterval: gameConfig.pollMs,
    },
  });

  const value = useMemo<GameState>(() => {
    const stats: Stats = statsRead.data
      ? {
          alive: Number(statsRead.data[0]),
          longest: Number(statsRead.data[1]),
          potWei: statsRead.data[2],
          brokenToday: Number(statsRead.data[3]),
        }
      : ZERO;

    const board: BoardRow[] = boardRead.data
      ? boardRead.data[0]
          .map((account, index) => ({
            account,
            length: Number(boardRead.data![1][index] ?? 0n),
          }))
          .filter((row) => row.length > 0)
      : [];

    const entryFeeWei =
      feeRead.data ?? (enabled ? null : parseEth(gameConfig.entryEth));

    const me: MyStreak | null = meRead.data
      ? {
          length: Number(meRead.data[0]),
          lastDay: Number(meRead.data[1]),
          stakedWei: meRead.data[2],
        }
      : null;

    let myStatus: MyStatus = "disconnected";
    if (isConnected) {
      if (!me || me.length === 0) myStatus = "fresh";
      else if (me.lastDay === today) myStatus = "done";
      else if (me.lastDay === today - 1) myStatus = "due";
      else myStatus = "dead";
    }

    const refetch = () => {
      void statsRead.refetch();
      void boardRead.refetch();
      void meRead.refetch();
    };

    return {
      live: enabled,
      today,
      stats,
      board,
      entryFeeWei,
      me,
      myStatus,
      isLoading:
        enabled && (statsRead.isLoading || boardRead.isLoading),
      refetch,
    };
  }, [
    statsRead,
    boardRead,
    feeRead.data,
    meRead,
    enabled,
    isConnected,
    today,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameState {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameStateProvider");
  }
  return context;
}
