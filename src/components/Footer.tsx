import Link from "next/link";
import { Mark } from "@/components/Navbar";
import { siteConfig } from "@/lib/site-config";

/*
 * Social links stay hidden until their env vars are set, so no dead link
 * ships. The disclaimer is the one thing on the page that is always shown.
 */
export function Footer() {
  const socials = [
    { label: "X", href: siteConfig.x },
    { label: "Telegram", href: siteConfig.telegram },
    { label: "Discord", href: siteConfig.discord },
    { label: "GitHub", href: siteConfig.github },
  ].filter((s): s is { label: string; href: string } => s.href !== null);

  return (
    <footer className="border-t border-rule-strong">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 text-ink">
            <Mark />
            <span className="font-serif text-[22px] leading-none tracking-tight">
              V<span className="lowercase">erdict</span>
            </span>
          </div>
          <p className="type-body mt-4 max-w-[38ch] text-ink-soft">
            The fair-launch launchpad on Robinhood Chain. One transaction. Liquidity sealed forever. The market is the jury.
          </p>
          <p className="type-small mt-6 max-w-[52ch] text-ink-muted">
            Meme coins are extremely volatile and most go to zero. Locked liquidity does not protect you from a token&apos;s price falling. A creator can still buy early and sell on holders; every one of those trades is public. Never trade more than you can afford to lose. Nothing here is financial advice.
          </p>
        </div>

        <FooterColumn
          title="App"
          items={[
            { label: "The docket", href: "/tokens" },
            { label: "Launch a token", href: "/launch" },
            { label: "Creator studio", href: "/studio" },
          ]}
        />
        <FooterColumn
          title="Protocol"
          items={[
            { label: "How it works", href: "/protocol" },
            { label: "Fees", href: "/protocol#fees" },
            { label: "What can never happen", href: "/protocol#never" },
            { label: "Security model", href: "/protocol#security" },
          ]}
        />
        <div>
          <span className="type-label block text-ink-muted">Official channels</span>
          {socials.length === 0 ? (
            <p className="type-small mt-4 text-ink-muted">
              Channels are announced here, and only here, at launch. Anyone claiming to be us before then is not.
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link type-body text-ink-soft hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="type-small mt-6 text-ink-muted">
            The team never DMs first and never asks for a seed phrase.
          </p>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <span className="type-label text-ink-muted">Robinhood Chain · Uniswap v3 · Non-custodial</span>
          <span className="type-label text-ink-muted">{siteConfig.domain}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <span className="type-label block text-ink-muted">{title}</span>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="link type-body text-ink-soft hover:text-ink">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
