import { clsx } from "clsx";
import type { ReactNode } from "react";

/** A key on the form: mono, tracked out, uppercase. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={clsx("type-label text-ink-muted", className)}>{children}</span>;
}

/**
 * Marks figures as sample. Rendered wherever preview data is drawn, so the
 * site never asserts activity that has not happened.
 */
export function PreviewTag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "type-label inline-flex items-center gap-1.5 border border-brass/50 bg-brass-wash px-2 py-1 text-brass",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
      Preview
    </span>
  );
}

/** Live indicator, only shown when the figures beside it are read from the chain. */
export function LiveTag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "type-label inline-flex items-center gap-1.5 border border-up/50 bg-up-wash px-2 py-1 text-up",
        className,
      )}
    >
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-up" />
      Live
    </span>
  );
}
