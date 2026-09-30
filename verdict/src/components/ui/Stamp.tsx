import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * The seal. Applied to anything that is closed for good: a locked pool, an
 * immutable term, a launch that cannot be edited. It is the only place the
 * red is allowed, which is what lets it carry meaning.
 */
export function Stamp({
  children,
  size = "md",
  animate = false,
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "stamp",
        size === "sm" && "stamp-sm",
        size === "lg" && "stamp-lg",
        animate && "stamp-in",
        className,
      )}
      aria-label={typeof children === "string" ? children : undefined}
    >
      {children}
    </span>
  );
}
