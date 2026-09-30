import { Label } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { launchRules } from "@/lib/site-config";

/*
 * The creator's side. The fee split drawn as a bar, because "half" is the
 * whole business model and a bar says it faster than a paragraph.
 */
export function Creators() {
  const creator = launchRules.creatorFeeShareBps / 100;
  return (
    <section className="border-b border-rule bg-ink text-paper">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Label className="text-brass-bright">For creators</Label>
          <h2 className="type-display mt-3">
            Not an airdrop. <br />
            <em className="italic-serif">A revenue stream.</em>
          </h2>
          <p className="type-body mt-6 max-w-[50ch] text-paper/70">
            You receive zero free tokens. What you get instead is better: {creator}% of your pool&apos;s swap
            fees, on every trade, on any venue, for as long as the coin trades. It starts with the
            first swap, it never expires, and you can claim it whenever you like or route it to any
            wallet — a multisig, a friend, a community treasury.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Claim in one signature from the studio, any time",
              "Fee terms are snapshotted at launch and can never be changed, by you or by us",
              "Redirect the whole stream to another wallet; the recipient claims without you",
              "Choose 0.3% (cheaper to trade) or 1% (more per trade) at launch",
            ].map((line) => (
              <li key={line} className="type-body flex gap-3 text-paper/80">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-bright" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/launch" className="bg-paper text-ink hover:bg-paper-deep">
              Launch a token
            </ButtonLink>
            <ButtonLink href="/studio" variant="outline" className="text-paper ring-paper/40 hover:bg-paper hover:text-ink">
              Open the studio
            </ButtonLink>
          </div>
        </div>

        <div className="border border-paper/15 p-7 sm:p-9">
          <div className="type-label text-paper/60">Every swap pays the pool fee</div>
          <div className="mt-6 flex h-14 w-full overflow-hidden">
            <div className="flex items-center justify-center bg-brass-bright text-ink" style={{ width: `${creator}%` }}>
              <span className="type-label">Creator {creator}%</span>
            </div>
            <div className="flex flex-1 items-center justify-center bg-paper/15 text-paper">
              <span className="type-label">Protocol {100 - creator}%</span>
            </div>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <dt className="type-label text-paper/60">Launchpad fee on trades</dt>
              <dd className="type-figure-lg mt-2 text-paper">None</dd>
            </div>
            <div>
              <dt className="type-label text-paper/60">Pool fee, your choice</dt>
              <dd className="type-figure-lg mt-2 text-paper">0.3% / 1%</dd>
            </div>
            <div>
              <dt className="type-label text-paper/60">Free tokens to creator</dt>
              <dd className="type-figure-lg mt-2 text-paper">0</dd>
            </div>
            <div>
              <dt className="type-label text-paper/60">Stream expires</dt>
              <dd className="type-figure-lg mt-2 text-paper">Never</dd>
            </div>
          </dl>
          <p className="type-small mt-8 text-paper/50">
            Fees accrue to the sealed liquidity position and are split at each harvest. If a token does not trade, nobody earns — us included. That is the whole business model.
          </p>
        </div>
      </div>
    </section>
  );
}
