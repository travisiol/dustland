import { HeroCta } from "@/components/HeroCta";
import { RugMeter } from "@/components/RugMeter";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { siteConfig } from "@/lib/site-config";

/*
 * The notice. A wordmark you can read from across the street, the one
 * sentence that is the whole project, and the meter it is measured on.
 */
export function Hero() {
  return (
    <section className="relative border-b border-rule">
      <div className="hazard h-3 w-full" aria-hidden />

      <div className="px-4 pt-10 pb-6 sm:px-6 sm:pt-14">
        <div className="flex flex-wrap items-center gap-3">
          <Label className="text-tape">Public service announcement</Label>
          <span aria-hidden className="h-px w-8 bg-rule-strong" />
          <Label>Robinhood Chain</Label>
          <span aria-hidden className="h-px w-8 bg-rule-strong" />
          <Label>{siteConfig.ticker}</Label>
        </div>

        <h1 className="type-hero mt-6 text-bone">
          Rug
          <span className="text-tape">pull</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        <div className="flex flex-col justify-end">
          <p className="type-lede max-w-[34ch] text-bone">
            Every rug gets pulled. Ours comes with a warning.
          </p>
          <p className="type-body mt-5 max-w-[52ch] text-bone-soft">
            Most devs rug in silence. This one is telling you up front: the
            moment market cap hits <strong className="text-bone">$100,000</strong>,
            the rug gets pulled. Below that, nothing happens. No dev sells, no
            liquidity moves, no &ldquo;migration&rdquo;. Nothing.
          </p>
          <p className="type-body mt-3 max-w-[52ch] text-bone-soft">
            You are reading the announcement. There will not be another one.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <HeroCta />
            <ButtonLink href="#terms" variant="outline">
              Read the terms
            </ButtonLink>
          </div>
        </div>

        <RugMeter />
      </div>
    </section>
  );
}
