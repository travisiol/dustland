import { clsx } from "clsx";
import type { ReactNode } from "react";

/** A key on the notice: mono, tracked out, uppercase. */
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("type-label text-bone-muted", className)}>
      {children}
    </span>
  );
}

/** Section heading: a tape-coloured key above a display line. */
export function SectionHeading({
  kicker,
  title,
  className,
}: {
  kicker: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={clsx("mb-10", className)}>
      <Label className="mb-3 block text-tape">{kicker}</Label>
      <h2 className="type-display text-bone">{title}</h2>
    </div>
  );
}
