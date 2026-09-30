import { clsx } from "clsx";

/**
 * The mark: a flame cut from a single stroke, with the tally notch at its
 * base. Drawn in ember on paper, in ember-hot on the slab.
 */
export function Flame({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={clsx("shrink-0", className)}
    >
      <path
        d="M16 2c1 6-6 8-6 15a6 6 0 0 0 12 0c0-3-2-5-3-6 0 3-2 4-2 4s-1-2 1-5c2.5-3.5 0-8-2-8Z"
        fill="currentColor"
      />
      <path d="M8 29h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
