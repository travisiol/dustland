import { Label } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";

/*
 * One transaction, four things. Drawn as a single filing stamped at the
 * end, because that is the shape of the mechanism: there is no phase two.
 */
const steps = [
  {
    n: "01",
    title: "Deploy the token",
    body: "Exactly 1,000,000,000 tokens, minted once. No owner, no mint, no pause, no blacklist, no transfer tax. Nothing to administer after this line.",
  },
  {
    n: "02",
    title: "Open the pool",
    body: "A real Uniswap v3 pool, at the fixed opening price every launch shares, on the fee tier you picked (0.3% or 1%). Fixed for life.",
  },
  {
    n: "03",
    title: "Seal the liquidity",
    body: "The whole supply goes in as one position and straight into a vault with no way out. Only the swap fees it earns can ever be collected.",
  },
  {
    n: "04",
    title: "Your first buy, if you want one",
    body: "Attach ETH and the launch executes your buy at the public price before anyone else can reach the pool. Labelled on-chain as the dev buy, forever.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-rule bg-paper-deep">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Label className="text-seal">How it works</Label>
          <h2 className="type-display mt-3 text-ink">
            One transaction. <br />
            <em className="italic-serif">Nothing</em> left to trigger.
          </h2>
          <p className="type-body mt-6 max-w-[44ch] text-ink-soft">
            No bonding curve to fill, no graduation to wait for, no migration that can fail. A
            launch <em>is</em> a listing. By the time the transaction confirms, the token has a
            live pool, sealed liquidity and a price, and every wallet, aggregator and chart on
            the chain can see it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/launch">Launch a token</ButtonLink>
            <ButtonLink href="/protocol" variant="outline">
              The full mechanism
            </ButtonLink>
          </div>
        </div>

        <ol className="card divide-y divide-rule">
          {steps.map((s) => (
            <li key={s.n} className="grid gap-4 p-6 sm:grid-cols-[72px_1fr] sm:p-7">
              <span className="type-figure-lg text-ink-faint">{s.n}</span>
              <div>
                <h3 className="type-title text-ink">{s.title}</h3>
                <p className="type-body mt-2 max-w-[54ch] text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
          <li className="flex flex-wrap items-center justify-between gap-4 bg-paper-deep/60 p-6 sm:p-7">
            <div>
              <div className="type-label text-ink-muted">Cost</div>
              <div className="type-body mt-1 text-ink">
                One flat creation fee in ETH, plus gas. You provide no liquidity: the sealed supply is the liquidity.
              </div>
            </div>
            <span className="stamp stamp-sm">Confirmed</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
