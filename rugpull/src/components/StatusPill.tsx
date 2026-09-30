"use client";

import { clsx } from "clsx";
import { isHot, phaseCopy } from "@/lib/rug";
import { useRug } from "@/lib/useRug";

/** The one-word state of the project. Yellow until it isn't. */
export function StatusPill({ className }: { className?: string }) {
  const { phase } = useRug();
  const hot = isHot(phase);

  return (
    <span
      className={clsx(
        "type-label inline-flex items-center gap-2 border px-2.5 py-1.5",
        hot
          ? "border-blood/50 bg-blood/10 text-blood"
          : "border-tape/40 bg-tape/10 text-tape",
        className,
      )}
    >
      <span
        className={clsx(
          "h-1.5 w-1.5",
          hot ? "bg-blood animate-blink" : "bg-tape",
        )}
      />
      {phaseCopy[phase].status}
    </span>
  );
}
