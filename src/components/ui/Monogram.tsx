import { clsx } from "clsx";

/**
 * A token's mark before it has media: two letters on a tinted plate. The
 * hue is decorative and stable per token, so a coin looks the same in the
 * docket, on the tape and on its own page.
 */
export function Monogram({
  letters,
  hue,
  size = 40,
  className,
}: {
  letters: string;
  hue: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-serif text-paper",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        letterSpacing: "-0.02em",
        background: `linear-gradient(135deg, hsl(${hue} 42% 32%), hsl(${(hue + 30) % 360} 46% 18%))`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
      }}
      aria-hidden
    >
      {letters}
    </span>
  );
}
