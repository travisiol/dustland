"use client";

import Link from "next/link";
import { Mark } from "@/components/Mark";
import { StatusPill } from "@/components/StatusPill";
import { WalletConnect } from "@/components/WalletConnect";
import { Label } from "@/components/ui/Label";
import { usd } from "@/lib/rug";
import { siteConfig } from "@/lib/site-config";
import { useRug } from "@/lib/useRug";

/*
 * The state of the rug, carried in the header. Two numbers and a status:
 * where it is, where it ends, and whether anything is happening.
 */
export function Navbar() {
  const { marketCapUsd, threshold } = useRug();

  const chips = [
    { key: "MCap", value: marketCapUsd === null ? "—" : usd(marketCapUsd) },
    { key: "Rug at", value: usd(threshold) },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink/92 backdrop-blur-sm">
      <nav className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Mark />
          <span className="hidden sm:block">
            <span className="type-title block leading-none text-bone">
              {siteConfig.name}
            </span>
            <span className="type-label mt-1 block text-tape">
              Announced. Scheduled. Honest.
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-5 lg:flex">
          {chips.map((chip) => (
            <li key={chip.key} className="flex items-baseline gap-2">
              <Label>{chip.key}</Label>
              <span className="type-data text-bone">{chip.value}</span>
            </li>
          ))}
          <li className="flex items-baseline gap-2">
            <Label>Token</Label>
            <span className="type-data text-tape">{siteConfig.ticker}</span>
          </li>
          <li>
            <StatusPill />
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="#terms"
            className="type-label hidden text-bone-soft transition-colors duration-150 hover:text-tape md:inline"
          >
            The terms
          </a>
          <a
            href="#faq"
            className="type-label hidden text-bone-soft transition-colors duration-150 hover:text-tape md:inline"
          >
            FAQ
          </a>
          <WalletConnect showHint={false} />
        </div>
      </nav>
    </header>
  );
}
