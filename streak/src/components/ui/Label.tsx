import { clsx } from "clsx";
import type { ReactNode } from "react";

/** A key on the ledger: mono, tracked out, uppercase. */
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("type-label text-ink-muted", className)}>
      {children}
    </span>
  );
}

/**
 * Marks a figure as pre-launch. Everything beside it is a real zero, not a
 * reading off the chain, and the stamp is what keeps a zero from looking
 * like a failure.
 */
export function PreLaunchStamp({ className }: { className?: string }) {
  return (
    <span className={clsx("stamp type-label inline-block text-ember", className)}>
      Pre-launch
    </span>
  );
}

/** A live dot. Only ever ember, only ever next to a live reading. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx(
        "pulse inline-block h-2 w-2 rounded-full bg-ember",
        className,
      )}
    />
  );
}
