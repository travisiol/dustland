import type { Metadata } from "next";
import { Label } from "@/components/ui/Label";
import { Stamp } from "@/components/ui/Stamp";
import { NeverTable } from "@/components/landing/NeverTable";
import { Faq } from "@/components/landing/Faq";
import { launchRules, protocolToken } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "The rules",
  description: "The full mechanism: what one transaction does, where the fee goes, what the owner can do, and what can never happen.",
};

/*
 * The rules, in full. Written once here and referenced everywhere else,
 * so there is exactly one place the mechanism is described and it cannot
 * drift from itself.
 */
export default function ProtocolPage() {
  const creator = launchRules.creatorFeeShareBps / 100;
  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-[64ch]">
          <Label className="text-seal">The rules</Label>
          <h1 className="type-display mt-3 text-ink">
            Short, because the admin surface is <em className="italic-serif">nearly empty.</em>
          </h1>
          <p className="type-lead mt-6 text-ink-soft">
            Every token on the docket lives the same on-chain life, with no special cases and no
            admin shortcuts. That life has exactly one phase: launched.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block">
            <ul className="sticky top-24 space-y-3 border-l border-rule pl-4">
              {[
                ["#launch", "The launch"],
                ["#locked", "Sealed liquidity"],
                ["#floor", "The price floor"],
                ["#fees", "Fees"],
                ["#owner", "What the owner can do"],
                ["#security", "Security model"],
                ["#never", "What can never happen"],
                ["#faq", "Questions"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="type-label text-ink-muted transition-colors hover:text-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-[72ch] space-y-16">
            <Section id="launch" title="The launch: one transaction, everything">
              <p>
                A creator calls the launchpad with a name, a ticker and a metadata URI, picks a fee
                tier, and confirms. One transaction:
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Deploys the token.</strong> Exactly 1,000,000,000 tokens (18 decimals), minted
                  once. No owner, no mint function, no pause, no blacklist, no transfer fees.
                </li>
                <li>
                  <strong>Opens an ETH/token pool on Uniswap v3</strong> at the fixed opening price every
                  launch shares, on the 0.3% or 1% tier the creator chose.
                </li>
                <li>
                  <strong>Seals the entire supply</strong> as a single liquidity position in an immutable
                  vault. Nobody can ever withdraw it; it earns the pool&apos;s swap fees instead.
                </li>
                <li>
                  <strong>Executes the creator&apos;s optional dev buy</strong> at the public price, before
                  anyone else can trade. Labelled on-chain as the dev buy.
                </li>
              </ol>
              <p>
                Cost: a flat creation fee in ETH plus gas. The creator receives zero free tokens.
                By the time the transaction confirms there is a live pool, sealed liquidity and a
                price. There is no second phase and nothing left to trigger.
              </p>
              <Table
                rows={[
                  ["Total supply", "1,000,000,000, fixed forever"],
                  ["Supply in the sealed position", "100%"],
                  ["ETH the creator must provide as liquidity", "0"],
                  ["Opening price", "Fixed; read live from the contract"],
                  ["Opening FDV", "Identical for every launch"],
                  ["Pool fee tier", "0.3% or 1%, creator's choice, fixed for life"],
                  ["Creation fee", "Flat, in ETH, read live from the contract"],
                  ["Creator allocation", "0 tokens"],
                ]}
              />
            </Section>

            <Section id="locked" title="Sealed liquidity, from block one">
              <p>
                There is no waiting period and no graduation event. The same transaction that creates
                a token mints its entire supply as one liquidity position and sends it into the fee
                locker vault. The vault is immutable, has no upgrade path, and has no function that
                can move a position out, for anyone. Only swap <em>fees</em> can be collected, split
                creator/protocol at the ratio snapshotted into the token at launch.
              </p>
              <p>
                Sealed means sealed: the liquidity is provably unreachable by anyone, forever. Not
                timelocked. Not &ldquo;locked for 90 days&rdquo;, which is a rug with a calendar.
              </p>
              <div className="flex items-center gap-4 border border-rule p-4">
                <Stamp size="sm">Sealed</Stamp>
                <span className="type-small text-ink-muted">
                  The stamp on every case file means exactly this, and only this.
                </span>
              </div>
            </Section>

            <Section id="floor" title="The opening price is a permanent floor">
              <p>
                The sealed position is single-sided: it spans from the opening tick downward in
                tokens, holding 100% tokens and zero ETH at launch. Buyers swap ETH into the range,
                and the ETH they pay becomes the pool&apos;s real reserve.
              </p>
              <p>
                No liquidity was ever minted below the opening tick, so a sell can never push the
                price under the launch price. If everyone who ever bought sold back, the price would
                return exactly to the opening price. The pool always holds exactly the ETH buyers
                put in, and v3 rounding favours the pool. This is the direct-listing equivalent of
                curve solvency, and it is a property of the geometry, not a promise.
              </p>
              <p className="type-small text-ink-muted">
                A floor on the pool is not a floor on your position. A token can trade at the opening
                price forever, which is a total loss for anyone who bought above it.
              </p>
            </Section>

            <Section id="fees" title="Fees">
              <p>
                The fee model fits in three sentences. Launching costs a flat creation fee in ETH.
                The launchpad takes no fee on trades. The only trading cost is the pool&apos;s own swap
                fee, 0.3% or 1% chosen by the creator at launch, which accrues to the sealed position
                and is split between the creator and the protocol.
              </p>
              <Table
                rows={[
                  ["Creation fee", "Flat, in ETH, shown on the launch page"],
                  ["Launchpad fee on trades", "None"],
                  ["Pool swap fee", "0.3% or 1%, fixed for life, on every venue"],
                  [`Creator share of swap fees`, `${creator}%, to the creator or the wallet they route it to`],
                  ["Protocol share of swap fees", `${100 - creator}%, to the treasury`],
                  ["Protocol fee income used for buybacks", `${protocolToken.buybackShareBps / 100}%, of ${protocolToken.symbol}, on the open market`],
                ]}
              />
              <p>
                The split is immutable per token. Whatever terms a token launched with, its pool pays
                out at those terms forever. If tokens don&apos;t trade, nobody earns. That is the whole
                business model.
              </p>
            </Section>

            <Section id="owner" title="What the protocol owner can do">
              <p>The launchpad&apos;s owner has exactly three powers:</p>
              <Table
                rows={[
                  ["Tune the creation fee and default fee split", "Future launches only, within a hard cap. Every existing token keeps its snapshot forever."],
                  ["Rotate the claim-authority wallet", "Can only trigger payouts; funds always flow to the recorded recipients."],
                  ["Change the treasury address", "Only affects where the protocol's own share goes."],
                ]}
              />
              <p>
                That is the complete list. There is no function to touch a pool, withdraw a sealed
                position, pause trading, seize tokens or upgrade the contract logic. No proxies
                anywhere: the deployed bytecode is final.
              </p>
            </Section>

            <Section id="security" title="Security model">
              <p>
                The model is built on absence of power: the safest admin function is the one that
                does not exist. Every launched token is a minimal ERC-20 with EIP-2612 permit and the
                entire attack surface removed. The swap router the app uses is stateless, ownerless
                and immutable; it holds nothing between transactions and only swaps against pools
                re-derived from the known factory, so a hostile address cannot be passed off as a
                pool. Your slippage limit is enforced on-chain.
              </p>
              <p>
                Smart contract risk can never be zero, and sealed liquidity does not protect you
                from a token&apos;s price going to zero. A creator can still buy early and sell on
                holders. Those trades are public, so check the creator&apos;s activity before buying.
              </p>
              <p className="type-small text-ink-muted">
                Audit status, deployed addresses and the disclosure contact are published on the
                official channels at deployment and linked from here. Until then, nothing on this
                site is a deployed contract.
              </p>
            </Section>
          </div>
        </div>
      </div>

      <NeverTable compact />
      <Faq compact />
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="type-title text-ink">{title}</h2>
      <div className="type-body mt-5 space-y-5 text-ink-soft [&_strong]:font-medium [&_strong]:text-ink">{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full border-t border-rule-strong">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-rule align-top">
            <th scope="row" className="type-data w-[40%] py-3 pr-4 text-left font-normal text-ink-muted">{k}</th>
            <td className="type-body py-3 text-ink">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
