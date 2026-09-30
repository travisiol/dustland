/*
 * The rules, one sentence each, scrolling past. Every line is true today,
 * which is why none of them carries a number that is not a rule.
 */
const lines = [
  "One check-in a day, before 00:00 UTC",
  "Miss a day and the streak dies",
  "What you put in stays in the pot",
  "The pot pays every week to whoever is still alive",
  "Day 100 earns a hundred shares, day 1 earns one",
  "No streak freezes, no repairs, no second chances",
  "Every wallet is its own streak",
];

export function Ticker() {
  return (
    <div className="flex items-stretch border-y border-line bg-ink text-paper">
      <span className="type-label flex shrink-0 items-center gap-2 border-r border-slab-line px-4 py-3 text-ember-hot">
        The rules
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-ticker">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {lines.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-5 whitespace-nowrap px-6 py-3"
                >
                  <span className="type-data text-paper/80">{line}</span>
                  <span aria-hidden className="text-ember">
                    ●
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
