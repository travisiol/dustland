import { Label } from "@/components/ui/Label";
import { claimConfig, world } from "@/lib/site-config";

/*
 * Written against the one misreading that matters: that buying a plot
 * means buying the whole thing. The first three answers all attack it from
 * different directions, because it is the misunderstanding that would cost
 * somebody money.
 */
const entries = [
  {
    q: "Do I own actual land on the Moon?",
    a: "No, and nobody can. The 1967 Outer Space Treaty bars any nation from claiming the Moon, so there is no sovereign anywhere to issue lunar title and no registry on Earth that recognises one. What you own is a token in this project's grid: a claim on a numbered parcel of this map, and a share of that parcel's market. It is not a deed, and nothing here should be read as one.",
  },
  {
    q: "Am I buying the whole plot?",
    a: "No. Every plot is a token, and you buy however much of that token you want. Hold 10% of a plot's supply and you hold roughly 10% of its economic ownership — hundreds of wallets can hold the same plot at once.",
  },
  {
    q: "So what does ownership actually mean?",
    a: "Your share of a plot is the percentage of its tokens you hold, and that same percentage decides your cut of the fees the plot's trading generates. Buy more of it and both go up; sell some and both go down.",
  },
  {
    q: "Where do the fees come from?",
    a: "From trading on that specific plot. Every buy and sell of a plot's token generates fees, and those fees are distributed across that plot's holders in proportion to what each one holds. A plot nobody trades generates nothing.",
  },
  {
    q: "Are all plots one big market?",
    a: `No — there are ${world.totalParcels} of them and each is independent. Its own token, its own price, its own holders, its own fees. Owning part of one gives you nothing in any of the others.`,
  },
  {
    q: "Why are some plots brighter on the globe?",
    a: "Brightness is activity. An amber hexagon has a market open, and the brighter it burns the more is being traded on it. Right now every plot is an empty outline, because no market has been opened anywhere.",
  },
  {
    q: "Are all plots the same size?",
    a: "Yes — 37,970 km² each. The grid is cut in an equal-area projection, so a parcel in Mare Imbrium covers exactly as much ground as one at the south pole, and each subtends the same angle on the sphere. What differs is what people are willing to pay for it.",
  },
  {
    q: "Why does Oceanus Procellarum have a hundred plots?",
    a: "Because it is that big — the Ocean of Storms is the largest expanse of basalt on the Moon and it takes 103 parcels. Counts follow area and nothing else. South Pole-Aitken, the vast farside basin, holds 120 for the same reason.",
  },
  {
    q: "Is the farside worth less?",
    a: "The grid does not think so. 501 parcels face Earth and 498 never have, which is as even a split as 999 allows, and every one of them is the same size. Whether the side nobody can see from here trades at a discount or a premium is a question for the market, not for the map.",
  },
  {
    q: "What does it cost to buy in?",
    a:
      claimConfig.priceEth !== null
        ? `Whatever the plot's token is trading at, plus gas. There is no fixed entry — you decide how much of a plot to buy.`
        : `There is no fixed entry price. You buy as much or as little of a plot's token as you want, at whatever it is trading at, plus gas.`,
  },
  {
    q: "When does trading open?",
    a: "A few minutes after launch. Everything on this page is already wired to the contracts and turns on by itself — connect your wallet now and you are ready.",
  },
  {
    q: "Which chain is this on?",
    a: "Robinhood Chain. Connect any injected wallet and the site will prompt you to switch if you are somewhere else. Gas is paid in ETH.",
  },
  {
    q: "Where does the globe come from?",
    a: "A script in this repo, run once and committed. It lays 999 equal-area hexagons over the whole sphere, then converts each back to real selenographic coordinates so they sit at their true positions. Region names come from the IAU/USGS Gazetteer of Planetary Nomenclature, and the landing sites are catalogued coordinates. Nothing is fetched at runtime.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-14 border-b border-rule px-4 py-16 sm:px-6">
      <Label className="mb-3 block text-signal">Questions</Label>
      <h2 className="type-display mb-12 text-chalk">Before you buy</h2>

      <dl className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.q} className="border-t border-rule pt-4">
            <dt className="type-title text-chalk">{entry.q}</dt>
            <dd className="type-body mt-3 max-w-[54ch] text-chalk-soft">
              {entry.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
