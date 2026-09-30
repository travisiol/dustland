import { SectionHeading } from "@/components/ui/Label";

const entries = [
  {
    q: "Is this a scam?",
    a: "It is a rug pull. It says so in the name, the URL, the page title and this sentence. A scam needs a lie somewhere in it. The lie is the part we removed.",
  },
  {
    q: "What exactly happens at $100K?",
    a: "The rug. The dev pulls it: whatever the dev holds gets sold and the liquidity goes with it. If you are holding at that moment, you are holding the bag. This page has told you so at least six times by now.",
  },
  {
    q: "What happens below $100K?",
    a: "Nothing. That is the whole product. No sells, no LP moves, no announcements, no “big news soon”. The dev does nothing, on a public meter, until the number says otherwise.",
  },
  {
    q: "What if it never reaches $100K?",
    a: "Then nothing ever happens, forever, and you own a token whose only feature never fired. Frame it. It is the safest rug ever pulled, because it wasn't.",
  },
  {
    q: "Can the dev rug early?",
    a: "Technically anyone can do anything on-chain. The dev says no. That is the one thing here you have to trust — and it is the same thing you trust with every other token, except here it is written down, numbered, and signed.",
  },
  {
    q: "Why announce it?",
    a: "Because nobody else does. Every rug ever pulled was “not a rug” until the second it was. This one is a rug from the first second. Try to get rugged by surprise here. You can't.",
  },
  {
    q: "Why Robinhood Chain?",
    a: "It is new, gas is paid in ETH and it is cheap, and until now it did not have a rug with a warning label. Every chain should have one.",
  },
  {
    q: "Where does the market cap number come from?",
    a: "Read live from the deepest pool for the token, refreshed every 30 seconds while the page is open. If the feed is down, the page says so. The rug is at $100K either way — the number is only for watching.",
  },
  {
    q: "Is this financial advice?",
    a: "It is the opposite. This is a page telling you that a specific token will be rugged at a specific number. Anything you do after reading it is on you.",
  },
  {
    q: "What is a rug pull, for the one person who doesn't know?",
    a: "A dev launches a token, lets people buy in, then pulls the liquidity or dumps their bag, and the price goes to zero. Usually without warning. This one is the “usually” taken out.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-14 border-b border-rule px-4 py-16 sm:px-6">
      <SectionHeading kicker="Questions" title="Before you buy" />

      <dl className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.q} className="border-t border-rule pt-4">
            <dt className="type-title text-bone">{entry.q}</dt>
            <dd className="type-body mt-3 max-w-[54ch] text-bone-soft">{entry.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
