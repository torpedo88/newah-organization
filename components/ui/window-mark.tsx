/**
 * A tikijhyā, drawn.
 *
 * The section mark was an endless knot to begin with. It came out looking like
 * a bow tie: the knot is a specific over-and-under weave, and approximating it
 * with a handful of arcs produces something that is not the symbol. Shipping a
 * bad drawing of a sacred sign is worse than shipping no drawing, so the mark
 * is a window instead — geometry, which can be drawn exactly.
 *
 * What is here: the heavy outer frame, the lattice screen behind it, the sill
 * below, and the two side posts. The proportions follow a second-floor
 * tikijhyā, wider than it is tall, with the screen set back from the frame.
 */
export default function WindowMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      fill="none"
      aria-hidden
      role="presentation"
      className={className}
    >
      <defs>
        <pattern id="window-mark-screen" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 H11 M0 0 V11" stroke="currentColor" strokeWidth="1.6" opacity="0.75" />
        </pattern>
        <clipPath id="window-mark-clip">
          <rect x="18" y="20" width="64" height="58" rx="2" />
        </clipPath>
      </defs>

      {/* The screen, clipped inside the opening. */}
      <g clipPath="url(#window-mark-clip)">
        <rect x="18" y="20" width="64" height="58" fill="url(#window-mark-screen)" />
      </g>

      {/* The frame. */}
      <rect x="18" y="20" width="64" height="58" rx="2" stroke="currentColor" strokeWidth="3.5" />

      {/* The mullion: a tikijhyā is set in units, not one sheet. */}
      <path d="M50 20 V78" stroke="currentColor" strokeWidth="3" />

      {/* The lintel above and the sill below, both oversailing the frame. */}
      <path d="M10 14 H90 M8 84 H92" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

      {/* The struts under the sill, as the carved brackets sit. */}
      <path
        d="M24 86 L30 100 M76 86 L70 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}
