import Link from "next/link";
import { Label } from "@/components/ui/Label";
import { Stamp } from "@/components/ui/Stamp";
import { launchRules } from "@/lib/site-config";

/*
 * The three exhibits. None of them is a policy: each is a property of the
 * contracts, which is why each one carries the seal — it cannot be changed
 * by anyone, us included.
 */
const exhibits = [
  {
    letter: "A",
    title: "Every launch opens equal",
    body: "Same opening price for every token. Creators buy at it like everyone else, inside the same transaction, visibly. There is no function for presales or team allocations, so there are none.",
    seal: "No presale",
    href: "/protocol#launch",
  },
  {
    letter: "B",
    title: "Liquidity sealed forever",
    body: `The entire ${launchRules.totalSupply / 1_000_000_000}B supply is minted straight into a vault with no withdrawal function, in the launch transaction itself. Not timelocked. Gone, permanently, for everyone including us.`,
    seal: "No rug",
    href: "/protocol#locked",
  },
  {
    letter: "C",
    title: "Creators keep earning",
    body: `${launchRules.creatorFeeShareBps / 100}% of the pool's swap fees, paid from the first trade, for as long as the coin trades, on any venue. Claim any time. Route it to any wallet.`,
    seal: "Forever",
    href: "/protocol#fees",
  },
] as const;

export function Guarantees() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label className="text-seal">The promise</Label>
            <h2 className="type-display mt-3 max-w-[18ch] text-ink">
              Fairness as a <em className="italic-serif">property</em>, not a policy.
            </h2>
          </div>
          <p className="type-body max-w-[46ch] text-ink-soft">
            Every launchpad says it is fair. Here it is not a promise anyone has to keep. The
            admin functions that would let us break it do not exist.
          </p>
        </div>

        <ol className="mt-14 grid gap-px bg-rule md:grid-cols-3">
          {exhibits.map((ex) => (
            <li key={ex.letter} className="relative bg-paper p-7 pt-8 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="font-serif text-[64px] leading-none text-ink-faint">{ex.letter}</span>
                <Stamp size="sm">{ex.seal}</Stamp>
              </div>
              <Label className="mt-6 block">Exhibit {ex.letter}</Label>
              <h3 className="type-title mt-2 text-ink">{ex.title}</h3>
              <p className="type-body mt-4 text-ink-soft">{ex.body}</p>
              <Link href={ex.href} className="link type-label mt-6 inline-block text-ink-muted hover:text-ink">
                How it is enforced
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
