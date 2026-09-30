/** The mark: a rug, mid-pull. The corner is already off the floor. */
export function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
    >
      <rect x="2" y="12" width="28" height="16" fill="#ffd60a" />
      <path d="M2 12 L30 12 L30 28 L2 28 Z" fill="none" stroke="#0b0b0c" strokeWidth="2" />
      <path d="M2 28 L30 28" stroke="#0b0b0c" strokeWidth="2" />
      <path d="M18 12 C 22 8, 28 4, 30 2 L 30 12 Z" fill="#ffd60a" stroke="#0b0b0c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 16 H26 M6 20 H26 M6 24 H26" stroke="#0b0b0c" strokeWidth="1.5" strokeDasharray="2 3" />
    </svg>
  );
}
