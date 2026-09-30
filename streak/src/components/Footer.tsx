import { Flame } from "@/components/Flame";
import { Label } from "@/components/ui/Label";
import { gameChain } from "@/lib/chain";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const socials = [
    { label: "X", href: siteConfig.x },
    { label: "Discord", href: siteConfig.discord },
    { label: "Telegram", href: siteConfig.telegram },
  ].filter((s): s is { label: string; href: string } => s.href !== null);

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Flame size={36} className="text-ember-hot" />
              <span className="type-display text-paper">{siteConfig.name}</span>
            </div>
            <p className="type-hero-accent mt-6 max-w-[22ch] text-[clamp(28px,4vw,48px)] leading-none text-ember-hot">
              Miss one, lose it all.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
            <div>
              <Label className="text-paper/50">On the page</Label>
              <ul className="mt-3 flex flex-col gap-2">
                {[
                  ["How it works", "#how"],
                  ["The rules", "#rules"],
                  ["The board", "#board"],
                  ["Questions", "#faq"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} className="type-data text-paper/80 transition-colors hover:text-ember-hot">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {socials.length > 0 && (
              <div>
                <Label className="text-paper/50">Elsewhere</Label>
                <ul className="mt-3 flex flex-col gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="type-data text-paper/80 transition-colors hover:text-ember-hot"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <Label className="text-paper/50">Chain</Label>
              <ul className="mt-3 flex flex-col gap-2">
                <li className="type-data text-paper/80">{gameChain.name}</li>
                <li className="type-data text-paper/80">Gas in ETH</li>
                <li className="type-data text-paper/80">Days in UTC</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-slab-line pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="type-data max-w-[70ch] text-paper/50">
            A game with money at stake, not an investment. Every entry fee should
            be treated as spent when you sign. Nothing here is financial advice.
          </p>
          <p className="type-data text-paper/50">© {new Date().getUTCFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
