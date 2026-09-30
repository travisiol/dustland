import { Label } from "@/components/ui/Label";
import { launchRules } from "@/lib/site-config";

/*
 * Written against the misreadings that cost people money, in the order
 * they cost the most: sealed liquidity is not a price guarantee, the
 * creator can still sell, and a launchpad fee of zero is not a swap fee of
 * zero.
 */
const entries = [
  {
    q: "Does sealed liquidity mean my money is safe?",
    a: "No. It means nobody can pull the pool, ever. It does not mean the price cannot fall. Most meme coins go to zero, and a token whose liquidity is locked forever can still trade at a fraction of what you paid. Sealed protects you from a rug, not from the market.",
  },
  {
    q: "Can the creator dump on me?",
    a: "The creator gets no free tokens and cannot mint, pause or withdraw anything. They can, like anyone, buy early and sell later. The dev buy is labelled on-chain and shown on the token page, and so is every trade after it. Check the creator's activity before you buy.",
  },
  {
    q: "What does it cost to trade?",
    a: "The launchpad adds nothing. You pay the pool's own swap fee, 0.3% or 1% depending on what the creator chose at launch, plus gas. That fee is what funds creators and the protocol; there is no other revenue.",
  },
  {
    q: "What does it cost to launch?",
    a: "One flat creation fee in ETH, read from the contract and shown on the launch page, plus gas. You provide no liquidity: the sealed supply is the liquidity. A dev buy is optional and is not a fee, it is an ordinary first purchase at the public price.",
  },
  {
    q: "Why is the opening price a floor?",
    a: "The whole supply is placed as a single position from the opening tick downward in tokens. No liquidity exists below the opening price, so a sell can never execute below it. If everyone who ever bought sold back, the price would land exactly on the opening price, never under it.",
  },
  {
    q: "Can I trade somewhere other than here?",
    a: "Yes, from the first block. Every token is an ordinary Uniswap v3 pool on Robinhood Chain, so any wallet, aggregator, bot or chart site that supports Uniswap there can see and trade it. There is no phase where the token only exists on this site.",
  },
  {
    q: "Can a token be edited after launch?",
    a: "No. Name, ticker, supply, metadata, pool, fee tier and the creator's fee share are all immutable once the transaction confirms. Not by the creator, not by us. The only thing a creator can change is which wallet receives their fee stream.",
  },
  {
    q: "Is the platform custodial?",
    a: "No. You trade from your own wallet against on-chain contracts. The contracts have no pause, mint, blacklist, seize, withdraw or upgrade function. The complete list of what the protocol owner can do is on the protocol page, and it is three lines long.",
  },
  {
    q: "How do creators get paid?",
    a: `${launchRules.creatorFeeShareBps / 100}% of the pool's swap fees, from the first trade, claimable at any time from the studio in one signature. The stream can be routed to any wallet. Terms are snapshotted at launch and cannot change.`,
  },
  {
    q: "Which chain, and what do I pay gas in?",
    a: "Robinhood Chain. Gas and every price here are in ETH. Any injected EVM wallet works; the site prompts you to switch networks if you are somewhere else.",
  },
] as const;

export function Faq({ compact = false }: { compact?: boolean }) {
  return (
    <section id="faq" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6">
        {!compact && (
          <>
            <Label className="text-seal">Questions</Label>
            <h2 className="type-display mt-3 mb-12 text-ink">Before you buy</h2>
          </>
        )}
        <dl className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {entries.map((entry) => (
            <div key={entry.q} className="border-t border-rule pt-5">
              <dt className="type-title text-ink">{entry.q}</dt>
              <dd className="type-body mt-3 max-w-[56ch] text-ink-soft">{entry.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
