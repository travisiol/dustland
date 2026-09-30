import { Label } from "@/components/ui/Label";
import { Stamp } from "@/components/ui/Stamp";
import { protocolToken } from "@/lib/site-config";

/*
 * The protocol token, described only by what the contract makes true.
 * No price, no chart, no launch date: none of it exists yet, and a figure
 * here is the one thing on this page a holder could be hurt by.
 */
export function ProtocolToken() {
  return (
    <section className="border-b border-rule">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <Label className="text-seal">The protocol token</Label>
          <h2 className="type-display mt-3 text-ink">
            {protocolToken.symbol} wins <br />
            <em className="italic-serif">when the platform does.</em>
          </h2>
          <p className="type-body mt-6 max-w-[50ch] text-ink-soft">
            Half of everything the protocol earns — from every launch, every trade on every filed
            token — is used to buy {protocolToken.symbol} back on the open market. It launches the
            way every token here launches: directly on Uniswap, at the public opening price, with
            no presale, no private round and no team bag. Every buy and sell, including any of
            ours, is visible on-chain from the first block.
          </p>
        </div>

        <dl className="card divide-y divide-rule">
          {[
            ["Total supply", `${(protocolToken.supply / 1_000_000_000).toFixed(0)},000,000,000`, "Fixed. No mint function."],
            ["Presale · private round", "None", "The contract has no way to do one."],
            ["Buybacks", `${protocolToken.buybackShareBps / 100}% of protocol fees`, "Bought on the open market, on-chain."],
            ["Transfer tax · pause · blacklist", "None", "A standard ERC-20 with the attack surface removed."],
            ["Launch", "Announced on official channels only", "No date is set. Anyone giving you one is not us."],
          ].map(([k, v, note]) => (
            <div key={k} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:p-6">
              <div>
                <dt className="type-label text-ink-muted">{k}</dt>
                <dd className="type-small mt-1 text-ink-muted">{note}</dd>
              </div>
              <dd className="type-figure text-ink sm:text-right">{v}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between p-5 sm:p-6">
            <span className="type-small text-ink-muted">Same rules as every launch on the docket.</span>
            <Stamp size="sm">No exceptions</Stamp>
          </div>
        </dl>
      </div>
    </section>
  );
}
