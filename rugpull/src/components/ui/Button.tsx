import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
 * One filled button, in caution yellow, because pressing it is the act the
 * whole page is warning you about. Everything else is an outline.
 */
const base =
  "type-label inline-flex items-center justify-center gap-2 px-5 py-3.5 transition-colors duration-150 disabled:cursor-not-allowed";

const solid =
  "bg-tape text-ink hover:bg-tape-bright disabled:bg-transparent disabled:text-bone-muted disabled:ring-1 disabled:ring-rule-strong disabled:ring-inset";
const outline =
  "text-bone ring-1 ring-rule-strong ring-inset hover:bg-bone hover:text-ink disabled:text-bone-muted";

export function Button({
  children,
  variant = "solid",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      className={clsx(base, variant === "solid" ? solid : outline, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "solid",
  external = false,
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: "solid" | "outline";
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={clsx(base, variant === "solid" ? solid : outline, className)}
    >
      {children}
    </a>
  );
}
