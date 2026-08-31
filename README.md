# DUSTLAND

The Moon's surface cut into 999 equal parcels. Claim one on the map.

Forked from PLOTLAND, which does the same thing to Earth. The pipeline is the
same — equal-area hexagons generated offline, one canvas globe, one packed
bitmap read from the chain — but the body, the data and the art direction are
not.

`DUSTLAND` is one string in `src/lib/site-config.ts` plus the
`NEXT_PUBLIC_DUSTLAND_*` env prefix, so renaming is a two-line change.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · wagmi v3 + viem ·
TypeScript. Injected wallets only, Robinhood Chain, no backend.

## The map is the product

`src/components/Globe.tsx` draws the body and all 999 hex parcels on a canvas,
and colours only the ground that has a market. It is the artwork, the proof of
scarcity and the claim counter at once, which is why it is the only place on
the page allowed to use colour.

Geometry is generated once and committed — nothing is fetched at build or run
time:

```bash
python scripts/build-parcels.py
```

That writes `src/data/parcels.json` and `src/data/maria.json`. It needs no
input files: the surface is masked by the projection's own boundary, and the
named regions come from a catalogue transcribed into the script.

**Why an equal-area projection.** Parcels have to be genuinely equal or "one
parcel" means nothing. The grid is laid in Equal Earth, which is equal-area, so
every hexagon covers the same 37,970 km² of ground. On a lat/lon grid a parcel
at Peary would quietly be worth a fraction of one at Tranquillitatis. The
projection is named for the wrong world; the maths only cares that the body is
a sphere.

**How it lands on exactly 999.** A binary search on the hex radius finds the
smallest lattice with at least 999 on-map cells, then the overshoot is dropped
lowest-coverage first — which shaves slivers at the ±180° limb rather than
punching holes in the middle. Parcels are numbered north to south.

The counts that fall out of this are facts about area, not editorial choices:

| | |
| --- | --- |
| Oceanus Procellarum | 103 parcels |
| South Pole-Aitken Basin | 120 parcels |
| Mare Imbrium | 25 parcels |
| Nearside / farside | 501 / 498 |
| Basalt / highland | 236 / 763 |
| Named regions | 47 |

**Landing sites.** Eighteen parcels contain a place something has actually
landed or impacted, from Luna 2 in 1959 to Chang'e 6 in 2024, and each one
falls in a different parcel. Apollo 11 is parcel 522, in Mare Tranquillitatis.
This is the one thing a lunar grid has that a terrestrial one does not, and it
is a matter of record rather than an invention.

**What the geometry approximates.** Region extents are the catalogued
diameters, modelled as circles except where `MINOR_AXIS_KM` gives a second
axis. That puts 236 parcels on basalt, about 23% of the surface, where the
published figure for the maria is nearer 16% — the overshoot is the circles,
which circumscribe irregular plains rather than matching them. Every named
region is in the right place and at roughly the right size; the basalt edges
are generous by a parcel or two. Fixing it properly means the USGS Unified
Geologic Map of the Moon, which is a download and a shapefile dependency this
build does not have.

## The contract this page expects

The ABI in `src/lib/dustlandAbi.ts` is specced around the map rather than the
other way round:

| Function | Why |
| --- | --- |
| `claim(uint256 parcelId) payable` | Claiming is by id, so you take the ground you picked rather than whatever the next mint hands you. |
| `claimedBitmap() view returns (uint256[4])` | The map needs all 999 states every time it draws. 999 bits pack into four words, so that is one view call instead of 999 `ownerOf` lookups or an indexer. Bit *n* of word *n >> 8* is parcel *n + 1*. |
| `totalSupply() view returns (uint256)` | Claim count. |

If the deployed contract names these differently, that one file is the only
thing to change.

## What is actually being sold

Nobody can own lunar land. The 1967 Outer Space Treaty bars any nation from
claiming the Moon, so there is no sovereign to issue title and no registry on
Earth that recognises one. What a buyer gets is a token in this grid: a claim
on a numbered parcel of this map, and a share of that parcel's market. It is
not a deed. The FAQ says so in the first answer, before anything else on the
page, and that ordering is deliberate.

## Pre-launch state

The site ships before the contract does, so it runs entirely on env vars:

- Every figure on the page is a real zero. No market has been opened, so the
  map is an empty outline and says so.
- Wallets connect. There is no contract to call yet, so the claim button stays
  disabled and says so rather than looking live and doing nothing.
- Everything flips automatically once `NEXT_PUBLIC_DUSTLAND_CONTRACT_ADDRESS`,
  `NEXT_PUBLIC_DUSTLAND_PRICE_ETH` and `NEXT_PUBLIC_DUSTLAND_LIVE=true` exist.
  No code change.
- No yield rate, holder count, floor, valuation or launch date appears
  anywhere. None of it is decided, and inventing a figure here is the one thing
  on this page a holder could actually be hurt by.

## Setup

```bash
npm install
cp .env.example .env.local   # optional — it runs with no env at all
npm run dev
```

## Going live

1. Deploy a contract exposing the three functions above.
2. Set `NEXT_PUBLIC_DUSTLAND_CONTRACT_ADDRESS`,
   `NEXT_PUBLIC_DUSTLAND_PRICE_ETH` and `NEXT_PUBLIC_DUSTLAND_LIVE=true`.
3. Set `NEXT_PUBLIC_MAINNET_RPC_URL` to a private endpoint — the public RPC
   will rate-limit under real traffic, and the map polls the bitmap every 20
   seconds.
4. Set `NEXT_PUBLIC_SITE_URL` so metadata, `sitemap.xml` and `robots.txt` point
   at the real domain.
5. Re-verify the region catalogue in `scripts/build-parcels.py` against the
   official IAU gazetteer before any of these names settle on-chain.

Social links stay hidden until their env vars are set, so no dead link ships.

Robinhood Chain network details in `src/lib/chain.ts` (chain id, RPC, explorer)
are unverified third-party research and must be re-confirmed against
`docs.robinhood.com/chain` before mainnet use.

## Art direction

A surface readout. Vacuum black and warm regolith grey — the Moon is not blue
and nothing here is — with one amber signal reserved for value. Amber appears
only where a market exists; on a field of 999 identical hexagons, colour has to
mean activity or it means nothing.

There is no display face. Everything loud is set in mono, tracked out and
stencilled the way a designation is painted on a hull; everything quiet is IBM
Plex. A heavy poster font would be a brand for a world with no weather, no
colour and no air.

The globe has no atmospheric halo, because the body has no atmosphere — an
airless disc has a hard edge against the sky, and the glow that sells a planet
is exactly what would make this one wrong. The Moon's face is not a texture: it
is drawn by the parcels themselves, each depth band laid down twice, once for
basalt and once for highland, so the nearside becomes recognisable out of the
grid that is being sold.

## Attribution

Region and landing-site coordinates from the
[IAU/USGS Gazetteer of Planetary Nomenclature](https://planetarynames.wr.usgs.gov/),
public domain, transcribed rather than fetched. Projection: Equal Earth
(Šavrič, Patterson & Jenny, 2018). Lunar radius 1737.4 km (IAU).

## Verification

`npx tsc --noEmit`, `npx eslint` and `npx next build` all pass clean.
