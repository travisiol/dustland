# VERDICT

The fair-launch launchpad on Robinhood Chain. One transaction files a token
straight into a live Uniswap v3 pool with its entire supply sealed as
liquidity forever, at the same opening price as every launch before it.
Creators earn half of every swap fee, from the first trade, for as long as
the coin trades.

**The market is the jury.**

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · wagmi v3 +
viem · TypeScript. Injected wallets only, Robinhood Chain, no backend.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The opening statement: hero, the three exhibits, how one transaction works, the latest filings, the ruling on what can never happen, creators, the protocol token, FAQ. |
| `/tokens` | The docket. Every filed token in launch order, with search and sort. |
| `/t/[address]` | A case file: chart with the opening price drawn as the floor, the trade record, buy/sell widget, and the sealed terms. |
| `/launch` | The filing form. Name, ticker, metadata, fee tier, optional dev buy, fee recipient; a live preview of the case file beside it. |
| `/studio` | Chambers. A creator's filings and fee stream, claimable in one signature. |
| `/protocol` | The rules in full: launch geometry, sealed liquidity, the price floor, fees, the owner's three powers, security model. |

## Art direction

A court record, not a trading terminal. Warm paper, ink, and one red
reserved for the seal: the stamp that marks something closed for good — a
sealed pool, an immutable term, a launch that cannot be edited. Red never
decorates. Brass is the second reserved colour and means money: fees,
rewards, the protocol token. Green and rust belong to the market and only
appear on price movement and trades.

Type: Instrument Serif for anything that reads like a ruling, Inter for
anything that reads like a form, JetBrains Mono for every number.

Motifs: docket numbers, exhibits A/B/C, dotted leaders, the rubber stamp
with its double rule and six-degree tilt, case files set a fraction off
square as if laid on a desk. The chart is one ink line with the opening
price drawn as a dotted red floor, because it is one.

## Preview vs live

The site ships before the contracts do, and it never pretends otherwise:

- With `NEXT_PUBLIC_VERDICT_LAUNCHPAD_ADDRESS` or
  `NEXT_PUBLIC_VERDICT_ROUTER_ADDRESS` unset, the app is in **preview**. The
  docket shows a seeded sample of twelve filings (`src/lib/preview.ts`),
  labelled *Preview* wherever it is drawn, at a deliberately modest scale.
  The launch form and trade widget are disabled and say why.
- No opening FDV, creation fee, launch date, audit status or token price is
  invented anywhere. Those are read from the contract once it exists and
  shown as unset until then.
- Set both addresses and `NEXT_PUBLIC_VERDICT_LIVE=true` and everything
  flips: the registry, token names, pool prices, the launch form and the
  swap widget read and write the chain. No code change.

Live reads are deliberately narrow — registry, ERC-20 name and symbol, the
pool's `slot0` price, `feeConfig` and `startSqrtPriceX96`. Volume, holders,
the trade tape and creator earnings need an indexer this build does not
include and are shown as unset rather than guessed. In live mode all
figures are in ETH.

## The contracts this app expects

`src/lib/launchpadAbi.ts` is specced around the pages:

| Contract | Function | Why |
| --- | --- | --- |
| Launchpad | `createToken(name, symbol, metadataURI, minTokensOut, poolFee, feeRecipient) payable` | The filing. `msg.value` covers the creation fee; the remainder is the dev buy. |
| Launchpad | `tokenCount()`, `getTokens(offset, limit)`, `tokens(address)` | The docket. |
| Launchpad | `feeConfig()`, `startSqrtPriceX96()` | Creation fee and opening price on the launch page. |
| Router | `buy(pool, minTokensOut, deadline) payable`, `sell(pool, tokenAmount, minEthOut, deadline)` | The trade widget. Slippage enforced on-chain. |
| Locker | `collectFees(token)` | The studio's claim. |
| Pool | `slot0()` | Price. Launch pools put the quote asset at token0. |

If the deployed contracts name these differently, that one file is the
only thing to change.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — it runs with no env at all
npm run dev
```

## Going live

1. Deploy the launchpad, router and locker.
2. Set `NEXT_PUBLIC_VERDICT_LAUNCHPAD_ADDRESS`,
   `NEXT_PUBLIC_VERDICT_ROUTER_ADDRESS` and `NEXT_PUBLIC_VERDICT_LIVE=true`.
3. Set `NEXT_PUBLIC_ROBINHOOD_RPC_URL` to a private endpoint; the docket
   polls every 20 seconds.
4. Set `NEXT_PUBLIC_SITE_URL` so metadata, `sitemap.xml` and `robots.txt`
   point at the real domain.
5. Set the social env vars. Links stay hidden until they exist, so no dead
   link ships.
6. Re-verify the Robinhood Chain values in `src/lib/chain.ts` against
   `docs.robinhood.com/chain`.

## Verification

`npx tsc --noEmit`, `npx eslint` and `npx next build` pass clean.
