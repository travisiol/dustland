import { Label } from "@/components/ui/Label";
import { rules } from "@/lib/site-config";

/*
 * The full rule set, written against the one misreading that matters:
 * that a streak is a habit tracker. It is not. Money goes in on every
 * check-in and comes out only if you are still alive at the reset.
 */
const entries = [
  {
    title: "One check-in per UTC day.",
    body: "The day rolls over at 00:00 UTC everywhere. Two check-ins in the same day do not count twice, and there is no window of grace after midnight.",
  },
  {
    title: "Every check-in costs the entry fee.",
    body: "The fee is fixed by the contract and shown on the button before you sign. All of it goes into the pot. Nothing is taken by anyone before the payout.",
  },
  {
    title: "Miss a day and the streak dies.",
    body: "A streak is alive if its last check-in was today or yesterday. Anything older is dead, and the wallet's stake stays in the pot for everyone still standing.",
  },
  {
    title: `The pot pays every ${rules.payoutEveryDays} days.`,
    body: "At the reset the pot is split across every live streak in proportion to its length. Your share is your streak length divided by the sum of all live streaks. Payouts are claimable on-chain; nothing is pushed to you.",
  },
  {
    title: "Streaks keep going after a payout.",
    body: "Being paid does not reset anything. A streak that has lasted a year still earns 365 shares every week, which is the whole point of not missing.",
  },
  {
    title: "No freezes. No repairs. No refunds.",
    body: "Dead is dead. You start again at day one, and nothing you put in before comes back to you. If that is a problem, this is not for you.",
  },
] as const;

export function Rules() {
  return (
    <section id="rules" className="scroll-mt-16 border-b border-line bg-paper-deep">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Label className="text-ember">The rules</Label>
            <h2 className="type-display mt-4 text-ink">
              Six lines.
              <br />
              Read all six.
            </h2>
            <p className="type-body mt-6 max-w-[34ch] text-ink-soft">
              This is a game with money at stake. You can lose everything you
              put in by sleeping through one midnight.
            </p>
          </div>

          <ol className="divide-y divide-line-strong border-y border-line-strong">
            {entries.map((entry, index) => (
              <li key={entry.title} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[5rem_1fr]">
                <span className="type-display text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="type-title text-ink">{entry.title}</h3>
                  <p className="type-body mt-3 max-w-[58ch] text-ink-soft">{entry.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
