"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { WalletConnect } from "@/components/WalletConnect";
import { siteConfig } from "@/lib/site-config";

/** The mark: a gavel head, reduced to the block and the strike line. */
export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={className}
    >
      <rect x="4" y="4" width="24" height="24" rx="12" fill="currentColor" />
      <path d="M11 20.5 L21 10.5" stroke="var(--paper)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 12 l6 -3 3 6 -6 3 z" fill="var(--paper)" />
      <path d="M12 23.5 h8" stroke="var(--seal)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

const links = [
  { href: "/tokens", label: "Docket" },
  { href: "/launch", label: "Launch" },
  { href: "/studio", label: "Studio" },
  { href: "/protocol", label: "Protocol" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/92 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-ink" onClick={() => setOpen(false)}>
          <Mark />
          <span className="font-serif text-[22px] leading-none tracking-tight">
            {siteConfig.name.charAt(0)}
            <span className="lowercase">{siteConfig.name.slice(1)}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "type-label px-3 py-2 transition-colors duration-150",
                    active ? "text-ink underline underline-offset-8 decoration-seal decoration-2" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/launch"
            className="type-label hidden bg-ink px-3.5 py-2.5 text-paper transition-colors hover:bg-ink-soft sm:inline-flex"
          >
            Launch a token
          </Link>
          <span className="hidden sm:inline-flex">
            <WalletConnect hint={false} />
          </span>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-ink md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
              {open ? (
                <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.8" />
              ) : (
                <path d="M3 5 H17 M3 10 H17 M3 15 H17" stroke="currentColor" strokeWidth="1.8" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-rule bg-paper px-4 py-3 md:hidden">
          {[...links, { href: "/launch", label: "Launch a token" }].map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="type-label block border-b border-rule py-3.5 text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="py-3.5 sm:hidden">
            <WalletConnect />
          </li>
        </ul>
      )}
    </header>
  );
}
