import { Label } from "@/components/ui/Label";
import { rules } from "@/lib/site-config";

/*
 * Three beats, numbered like entries in a ledger. The glyphs are drawn
 * rather than illustrated — a tally mark, a struck-out mark, a stack of
 * coins — so they stay in the same line language as the wall.
 */
function TallyGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M10 10v24M17 10v24M24 10v24M31 10v24" />
        <path d="M6 30 38 14" />
      </g>
    </svg>
  );
}

function MissGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M10 10v24M17 10v24M24 10v24" opacity="0.35" />
        <path d="M31 10v24" strokeDasharray="4 4" opacity="0.35" />
        <path d="M8 8l28 28M36 8 8 36" />
      </g>
    </svg>
  );
}

function PayGlyph() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none">
        <ellipse cx="22" cy="12" rx="12" ry="5" />
        <path d="M10 12v8c0 2.8 5.4 5 12 5s12-2.2 12-5v-8" />
        <path d="M10 20v8c0 2.8 5.4 5 12 5s12-2.2 12-5v-8" />
        <path d="M10 28v4c0 2.8 5.4 5 12 5s12-2.2 12-5v-4" />
      </g>
    </svg>
  );
}

const steps = [
  {
    n: "01",
    title: "Check in",
    body: "Once a day, before the clock hits zero at 00:00 UTC. Each check-in costs the entry fee, and every fee goes straight into the pot.",
    Glyph: TallyGlyph,
  },
  {
    n: "02",
    title: "Don't miss",
    body: "Miss a single day and your streak dies. What you put in stays in the pot for everyone still standing. There are no freezes and no repairs.",
    Glyph: MissGlyph,
  },
  {
    n: "03",
    title: "Get paid",
    body: `Every ${rules.payoutEveryDays} days the pot is split between every live streak, weighted by length. Day 100 earns a hundred shares; day 1 earns one.`,
    Glyph: PayGlyph,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Label className="text-ember">How it works</Label>
            <h2 className="type-display mt-4 text-ink">
              The rules fit
              <br />
              on a napkin.
            </h2>
            <p className="type-body mt-6 max-w-[36ch] text-ink-soft">
              There is no strategy, no leverage and nothing to optimise. The
              only edge is turning up.
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            {steps.map(({ n, title, body, Glyph }) => (
              <li key={n} className="flex flex-col gap-8 bg-paper py-8 md:px-8 md:first:pl-0 md:last:pr-0">
                <div className="flex items-start justify-between">
                  <span className="type-display text-ember">{n}</span>
                  <span className="text-ink">
                    <Glyph />
                  </span>
                </div>
                <div>
                  <h3 className="type-title text-ink">{title}</h3>
                  <p className="type-body mt-3 text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
