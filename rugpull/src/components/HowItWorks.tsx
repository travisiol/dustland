import { SectionHeading } from "@/components/ui/Label";

/*
 * Three beats. Nothing to illustrate — the middle one is the whole joke
 * and drawing it would ruin it.
 */
const steps = [
  {
    n: "01",
    title: "You read this page.",
    body: "It says the token gets rugged at $100K market cap. You have now been told. Whatever you do next, you were told.",
  },
  {
    n: "02",
    title: "Nothing happens.",
    body: "For as long as the number is below $100,000. Days, weeks, forever. The dev does nothing, on purpose, in public, on a meter.",
  },
  {
    n: "03",
    title: "$100K. The rug.",
    body: "The line gets crossed, the rug gets pulled, and for once in the history of this industry nobody gets to say they didn't see it coming.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-14 border-b border-rule px-4 py-16 sm:px-6">
      <SectionHeading kicker="How it works" title="Three steps. One of them is nothing." />

      <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n} className="border-t-2 border-tape pt-5">
            <span className="type-figure-sm text-tape">{step.n}</span>
            <h3 className="type-title mt-3 text-bone">{step.title}</h3>
            <p className="type-body mt-3 max-w-[40ch] text-bone-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
