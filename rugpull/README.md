# RUGPULL

The first rug pull with a warning label. A memecoin site for Robinhood Chain
whose entire product is one sentence: **this token gets rugged the moment
market cap hits $100,000, and below that, nothing happens.**

Most devs rug in silence. This one announces it, puts the number on a meter,
and does nothing in public until the number is reached.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · wagmi v3 + viem ·
TanStack Query · TypeScript. Injected wallets only, Robinhood Chain, no backend.

## The meter is the product

`src/components/RugMeter.tsx` draws one bar from $0 to $100,000 and puts the
live market cap on it. Every other component on the page derives from the same
reading through `useRug()` in `src/lib/useRug.ts`:

| Phase | When | What the page says |
| --- | --- | --- |
| `unlaunched` | no token address set | Nothing is happening. There is no token, so there is nothing to rug. |
| `nothing` | market cap below 90% of the threshold | Nothing is happening. $X still to go. |
| `close` | within 10% of the threshold | Nothing is happening. Yet. |
| `due` | market cap ≥ $100,000 | The rug is due. Everything turns red. |
| `rugged` | `NEXT_PUBLIC_RUG_RUGGED=true` | It happened. You were told. |

The threshold is one constant, `RUG_THRESHOLD_USD` in `src/lib/rug.ts`. The
promise and the page can never disagree because there is only one number.

Red appears nowhere on the site until the threshold is crossed. Below it, the
only colour is caution-tape yellow.

## Where the number comes from

Market cap is read client-side from DexScreener's token endpoint for
`NEXT_PUBLIC_RUG_TOKEN_ADDRESS`, taking the deepest pool, polled every 30
seconds while the tab is open. If the feed is down or the chain is not indexed
yet, the page says so rather than showing a stale or invented figure.

`NEXT_PUBLIC_RUG_MARKETCAP_USD` overrides the feed with a hand-set value. Use
it for demos, for a chain the feed does not cover, or for the day the feed is
down and you still want the real number on the page.

## What is honest about the page

- With no env set, every figure is a real unknown: no market cap, no launch
  date, no address, disabled buy button. Nothing is happening, as promised.
- No supply, price, holder count or launch date is ever invented. Each appears
  only when its env var is set.
- The rugged state is an explicit flag, because market cap collapses the
  moment the rug happens and the page would otherwise report that nothing is
  happening again. Something did.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — it runs with no env at all
npm run dev
```

## Going live

1. Deploy the token and open a pool on Robinhood Chain.
2. Set `NEXT_PUBLIC_RUG_TOKEN_ADDRESS`, `NEXT_PUBLIC_RUG_BUY_URL` and
   `NEXT_PUBLIC_RUG_LAUNCHED_AT`. The meter, the buy panel and the "time during
   which nothing happened" clock all switch on by themselves.
3. If DexScreener does not index the chain yet, set
   `NEXT_PUBLIC_RUG_MARKETCAP_USD` by hand until it does.
4. Set `NEXT_PUBLIC_SITE_URL` so metadata, `sitemap.xml` and `robots.txt` point
   at the real domain.
5. After the rug, set `NEXT_PUBLIC_RUG_RUGGED=true` and redeploy.

Social links stay hidden until their env vars are set, so no dead link ships.

Robinhood Chain network details in `src/lib/chain.ts` (chain id, RPC, explorer)
are unverified third-party research and must be re-confirmed against
`docs.robinhood.com/chain` before mainnet use.

## Art direction

A hazard notice, not a pitch deck. Asphalt black, bone white, and caution-tape
yellow for every place the page is telling you something you will wish you had
read. Red is reserved for the rug itself. Archivo Black for the wordmark
because this is a poster and the poster says one number; JetBrains Mono for
every figure; Space Grotesk for the prose.

## Verification

`npx tsc --noEmit`, `npx eslint` and `npx next build` all pass clean.
