"use client";

import { useSyncExternalStore } from "react";
import { rules } from "@/lib/site-config";

export const DAY_MS = 86_400_000;

/** UTC day index for a timestamp: the same number the contract uses. */
export function dayIndex(ms: number = Date.now()): number {
  return Math.floor(ms / DAY_MS);
}

/** Start of the next UTC day, in ms. */
export function nextDayStart(ms: number = Date.now()): number {
  return (dayIndex(ms) + 1) * DAY_MS;
}

/** Next payout: the coming payout weekday at 00:00 UTC. */
export function nextPayoutStart(ms: number = Date.now()): number {
  const today = dayIndex(ms);
  // Day 0 (1970-01-01) was a Thursday, so weekday = (day + 4) mod 7.
  const weekday = (today + 4) % 7;
  let ahead = (rules.payoutWeekday - weekday + 7) % 7;
  if (ahead === 0) ahead = 7;
  return (today + ahead) * DAY_MS;
}

export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function splitCountdown(remainingMs: number) {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds, total };
}

/**
 * A once-a-second clock, as an external store: one shared interval, and a
 * null server snapshot so the server render and the first client render
 * agree before the real time arrives.
 */
const listeners = new Set<() => void>();
let snapshot = 0;
let timer: number | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === null) {
    snapshot = Date.now();
    timer = window.setInterval(() => {
      snapshot = Date.now();
      listeners.forEach((fn) => fn());
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

export function useNow(): number | null {
  const now = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => 0,
  );
  return now === 0 ? null : now;
}

/** Whether the viewer asked for reduced motion. False on the server. */
const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribeReduced(listener: () => void) {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

export function formatDate(day: number): string {
  return new Date(day * DAY_MS).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
