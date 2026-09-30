import { Label } from "@/components/ui/Label";
import { Stamp } from "@/components/ui/Stamp";

/*
 * The ruling. Each row is a thing people have been burned by on other
 * launchpads, and each is dismissed with the same stamp, because the
 * answer is the same in every case: the function does not exist.
 */
export const neverRows = [
  ["Creator or team mints extra supply", "No mint function exists"],
  ["Trading gets paused or a wallet blacklisted", "No pause or blacklist exists"],
  ["Liquidity gets pulled", "Sealed in an ownerless vault with no withdrawal function"],
  ["Sells push the price below the opening price", "No liquidity exists below the opening tick"],
  ["A token's fee terms change after launch", "Snapshotted at creation, immutable"],
  ["The platform touches your funds", "Fully non-custodial, no proxies, no upgrade path"],
] as const;

export function NeverTable({ compact = false }: { compact?: boolean }) {
  return (
    <section id="never" className="scroll-mt-16 border-b border-rule">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6">
        {!compact && (
          <div className="mb-12 max-w-[60ch]">
            <Label className="text-seal">The ruling</Label>
            <h2 className="type-display mt-3 text-ink">
              What can <em className="italic-serif">never</em> happen.
            </h2>
            <p className="type-body mt-5 text-ink-soft">
              Not &ldquo;we won&apos;t&rdquo;. <strong className="font-medium text-ink">&ldquo;We can&apos;t.&rdquo;</strong>{" "}
              The list is short because the admin surface is nearly empty, and that is the point.
            </p>
          </div>
        )}
        <table className="w-full border-t border-rule-strong">
          <tbody>
            {neverRows.map(([action, why], i) => (
              <tr key={action} className="border-b border-rule align-top">
                <td className="type-data w-12 py-5 pr-4 text-ink-faint">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-5 pr-6">
                  <div className="type-title text-ink">{action}</div>
                  <div className="type-body mt-1.5 text-ink-soft">{why}</div>
                </td>
                <td className="py-5 pl-4 text-right">
                  <Stamp size="sm">Impossible</Stamp>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
