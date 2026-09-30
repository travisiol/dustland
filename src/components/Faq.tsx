import { Label } from "@/components/ui/Label";
import { gameChain } from "@/lib/chain";
import { rules } from "@/lib/site-config";

/*
 * Answers ordered by how much they could cost somebody. The first one is
 * "can I lose money", because that is the one a newcomer needs before any
 * of the others.
 */
const entries = [
  {
    q: "Can I lose money?",
    a: "Yes. Every check-in puts the entry fee into the pot, and the only way it comes back is being alive at a payout with a long enough streak. Miss a day and everything you have put in stays in the pot for the others. Treat every fee as spent the moment you sign.",
  },
  {
    q: "What does a check-in cost?",
    a: "A fixed entry fee set by the contract, shown on the button before you sign, plus gas. It is the same for day 1 and day 400. There are no tiers and no way to pay more for more shares.",
  },
  {
    q: "When does the day reset?",
    a: "00:00 UTC, everywhere, every day. The clock in the header counts down to it. If you are in a timezone where that is 4 p.m., check in at lunch. The contract does not know or care where you live.",
  },
  {
    q: "What happens if I miss a day?",
    a: "Your streak dies. Your next check-in starts a new streak at day 1, and nothing from the old one carries over: not the length, not the stake. There are no streak freezes, no repairs and no grace period.",
  },
  {
    q: "How is the pot split?",
    a: `Every ${rules.payoutEveryDays} days, at 00:00 UTC on Sunday, the pot is divided across every live streak in proportion to its length. If the live streaks add up to 1,000 days and yours is 50, you get 5% of the pot. The remaining pot starts again from the next day's fees.`,
  },
  {
    q: "Do I have to claim my payout?",
    a: "Yes. Payouts are credited to your wallet on-chain and claimable at any time; nothing is pushed to you and there is no deadline to claim. Claiming does not affect your streak.",
  },
  {
    q: "Can I run more than one wallet?",
    a: "Nothing stops you. Each wallet is its own streak with its own fees at stake, so two wallets cost twice as much and die independently. It is not a strategy; it is just paying twice.",
  },
  {
    q: "Which chain is this on?",
    a: `${gameChain.name}. Connect any injected wallet and the site prompts you to switch if you are somewhere else. Gas is paid in ETH.`,
  },
  {
    q: "Is this gambling?",
    a: "It is a game where money goes in and might not come out, and you should treat it as one. Nothing here is investment advice, nothing is guaranteed and the fee you put in today is not yours any more. Only play with what you are fine losing at midnight.",
  },
  {
    q: "When does it start?",
    a: "When the contract is deployed. Everything on this page is already wired to it and turns on by itself; until then every figure is a real zero and the check-in button says so. Connect now and you are ready for day one.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <Label className="text-ember">Questions</Label>
        <h2 className="type-display mt-4 text-ink">Before you check in.</h2>

        <dl className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
          {entries.map((entry) => (
            <div key={entry.q} className="border-t border-line-strong pt-5">
              <dt className="type-title text-ink">{entry.q}</dt>
              <dd className="type-body mt-3 max-w-[56ch] text-ink-soft">{entry.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
