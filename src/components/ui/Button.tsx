import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
 * One filled button, in ember, because pressing it is the act the whole
 * page exists for. Everything else is an outline in ink.
 */
const base =
  "type-label inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-4 transition-[background-color,color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed";

const variants = {
  ember:
    "bg-ember text-ember-white hover:bg-ember-deep disabled:bg-transparent disabled:text-ink-muted disabled:ring-1 disabled:ring-line-strong disabled:ring-inset",
  ink: "bg-ink text-paper hover:bg-ink-soft disabled:bg-transparent disabled:text-ink-muted disabled:ring-1 disabled:ring-line-strong disabled:ring-inset",
  outline:
    "text-ink ring-1 ring-line-strong ring-inset hover:bg-ink hover:text-paper disabled:text-ink-muted",
  /** For use on the slab. */
  ghost:
    "text-paper ring-1 ring-slab-line ring-inset hover:bg-paper hover:text-ink disabled:text-ink-muted",
} as const;

export function Button({
  children,
  variant = "ember",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <button
      type="button"
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "outline",
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <a href={href} className={clsx(base, variants[variant], className)}>
      {children}
    </a>
  );
}
