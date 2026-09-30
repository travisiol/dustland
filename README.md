# STREAK

Show up every day. One on-chain check-in a day keeps your streak alive; miss
one and it dies, and everything you put in stays in the pot. Every week the
pot pays whoever is still standing, weighted by how long they have lasted.

This is a ground-up rebuild of the idea behind streak.fun with its own art
direction, copy and mechanics. The original site could not be reached from
the environment this was built in, so the rules below are this project's
own, chosen to be the simplest honest version of "a daily streak with money
on it". Every number in them lives in `src/lib/site-config.ts`; change it
there and the copy follows.

The previous project in this repository, DUSTLAND, is kept untouched in
`legacy/` and excluded from the build.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · wagmi v3 + viem
· TypeScript. Injected wallets only, Base by default, no backend.

## The game

1. **One check-in per UTC day.** The day rolls over at 00:00 UTC everywhere.
2. **Every check-in costs the entry fee**, fixed by the contract, all of it
   into the pot.
3. **Miss a day and the streak dies.** A streak is alive if its last
   check-in was today or yesterday. A dead streak's stake stays in the pot.
4. **The pot pays every 7 days**, Sunday 00:00 UTC, split across every live
   streak in proportion to its length. Day 100 earns a hundred shares; day 1
   earns one. Payouts are claimable on-chain.
5. **Streaks keep going after a payout.**
6. **No freezes, no repairs, no refunds.**

## The contract this page expects

`src/lib/streakAbi.ts` is specced from the page rather than the other way
round: every read is one call the UI makes.

| Function | Why |
| --- | --- |
| `checkIn() payable` | The one write. `msg.value` must equal `entryFee()`. |
| `entryFee() view returns (uint256)` | Shown on the button before you sign. |
| `currentDay() view returns (uint256)` | `block.timestamp / 86400`. The page computes the same number locally. |
| `streakOf(address) view returns (uint256 length, uint256 lastDay, uint256 staked)` | Your wall, your status, your stake at risk. |
| `stats() view returns (uint256 alive, uint256 longest, uint256 pot, uint256 brokenToday)` | The four readings in the stats strip, one call. |
| `leaderboard(uint256 n) view returns (address[], uint256[])` | The board, longest first. |

If the deployed contract names these differently, that one file is the only
thing to change.

## Pre-launch state

The site ships before the contract does, so it runs entirely on env vars:

- Every figure on the page is a real zero and is stamped **Pre-launch**.
- The wall in the hero plays a labelled illustration of a streak climbing to
  31 and dying. Once live and connected it draws your own.
- Wallets connect. The check-in button is disabled and says why.
- Everything flips automatically once `NEXT_PUBLIC_STREAK_CONTRACT_ADDRESS`,
  `NEXT_PUBLIC_STREAK_ENTRY_ETH` and `NEXT_PUBLIC_STREAK_LIVE=true` exist.
- No holder count, APY, valuation or launch date is invented anywhere.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — it runs with no env at all
npm run dev
```

## Going live

1. Deploy a contract exposing the functions above.
2. Set `NEXT_PUBLIC_STREAK_CONTRACT_ADDRESS`, `NEXT_PUBLIC_STREAK_ENTRY_ETH`
   and `NEXT_PUBLIC_STREAK_LIVE=true`.
3. Pick the chain with `NEXT_PUBLIC_STREAK_CHAIN_ID` (8453 Base, 84532 Base
   Sepolia, 1 mainnet) and set `NEXT_PUBLIC_STREAK_RPC_URL` to a private
   endpoint: the page polls every 20 seconds.
4. Set `NEXT_PUBLIC_SITE_URL` so metadata, `sitemap.xml` and `robots.txt`
   point at the real domain.

Social links stay hidden until their env vars are set, so no dead link ships.

## Art direction

A ledger, not a dashboard. The page is warm paper, the kind you keep a tally
on, set in Bricolage Grotesque with an Instrument Serif italic reserved for
the one line the product is about. Colour is a single hot ember and it only
appears where a streak is alive: on the wall, on the check-in button, on a
live number. Everything that is not alive is ink.

The one dark object on the page is **the wall**: a charcoal slab where the
days are laid out seven rows deep, one column per week, today bottom-right.
A streak is the run of lit cells ending at today, and heat runs along it,
cooled red at the start and near-white at the end, so the length of a streak
reads as a temperature before it reads as a number. Paper around it, fire
inside it: that contrast is the whole identity.

Fonts load from a runtime `<link>` rather than `next/font`, so the build
needs no outbound network.

## Verification

`npx tsc --noEmit`, `npx eslint` and `npx next build` all pass clean.
