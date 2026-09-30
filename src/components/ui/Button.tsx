import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
 * Three weights. Ink is the act the page exists for (launch, buy), the
 * outline is everything beside it, and seal is reserved for a step that
 * cannot be undone — it is the only red button in the app.
 */
const base =
  "type-label inline-flex items-center justify-center gap-2 px-5 py-3.5 transition-colors duration-150 disabled:cursor-not-allowed select-none";

const variants = {
  ink: "bg-ink text-paper hover:bg-ink-soft disabled:bg-transparent disabled:text-ink-muted disabled:ring-1 disabled:ring-rule-strong disabled:ring-inset",
  outline:
    "text-ink ring-1 ring-rule-strong ring-inset hover:bg-ink hover:text-paper disabled:text-ink-muted disabled:hover:bg-transparent",
  seal: "bg-seal text-paper hover:bg-seal-deep disabled:bg-transparent disabled:text-ink-muted disabled:ring-1 disabled:ring-rule-strong disabled:ring-inset",
  ghost: "text-ink-soft hover:text-ink hover:bg-paper-deep",
} as const;

export type ButtonVariant = keyof typeof variants;

export function Button({
  children,
  variant = "ink",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button type="button" className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "ink",
  className,
  external,
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
}) {
  const cls = clsx(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
