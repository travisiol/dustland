import { SectionHeading } from "@/components/ui/Label";
import { siteConfig } from "@/lib/site-config";

/*
 * The terms of the rug. Five clauses, numbered like a contract, because
 * that is what a dev promise usually pretends not to be.
 */
const clauses = [
  {
    title: "The rug happens at $100,000.",
    body: "Market cap, not a dollar before. Not at $99,999. When the number reads one hundred thousand, the dev pulls it. That is the entire product.",
  },
  {
    title: "Below $100,000, nothing happens.",
    body: "No dev sells. No liquidity moves. No tax changes, no “v2”, no “migration”, no surprise. The token just sits there, being a token, doing nothing. Exactly as advertised.",
  },
  {
    title: "There is no roadmap.",
    body: "This page is the roadmap. Phase one: launch. Phase two: nothing. Phase three: the rug. There is no phase four.",
  },
  {
    title: "There is no utility.",
    body: "No staking, no partnerships, no AI, no game. One feature, and it fires once. The feature is the warning you are reading.",
  },
  {
    title: "If it never gets there, it never happens.",
    body: "A rug at $100K on a token that never reaches $100K is a token that never gets rugged. That is not a loophole. That is arithmetic.",
  },
] as const;

export function Terms() {
  return (
    <section id="terms" className="scroll-mt-14 border-b border-rule px-4 py-16 sm:px-6">
      <SectionHeading kicker="The terms" title="Terms of the rug" />

      <ol className="grid grid-cols-1 gap-px bg-rule md:grid-cols-2 lg:grid-cols-3">
        {clauses.map((clause, index) => (
          <li key={clause.title} className="bg-ink p-6">
            <span className="type-figure-sm block text-tape">
              §{String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="type-title mt-4 text-bone">{clause.title}</h3>
            <p className="type-body mt-3 max-w-[44ch] text-bone-soft">{clause.body}</p>
          </li>
        ))}
        <li className="flex flex-col justify-end bg-ink p-6">
          <div className="hazard mb-5 h-2 w-full" aria-hidden />
          <p className="type-label text-bone-muted">Signed</p>
          <p className="type-title mt-2 text-bone">The dev</p>
          <p className="type-data mt-3 max-w-[40ch] text-bone-soft">
            Everything above is the one thing on this page you have to trust.
            It is the same thing you trust with every other token. The
            difference is that here it is written down, and here it says
            {" "}{siteConfig.name}.
          </p>
        </li>
      </ol>
    </section>
  );
}
