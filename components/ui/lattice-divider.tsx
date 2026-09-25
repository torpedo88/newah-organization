import { cn } from "@/lib/utils";

/**
 * A tikijhyā band.
 *
 * The tikijhyā is the lattice window of Newar architecture — the second-floor
 * window that lets light and air through and keeps the street's eyes out. Its
 * screen is a field of small openings set on the diagonal, held in a heavier
 * frame, and that is what this band is: the screen, run horizontally, with a
 * rail top and bottom.
 *
 * Drawn rather than photographed. A photograph of somebody else's window is
 * somebody else's photograph, with a licence attached; a drawn lattice tiles to
 * any width without going soft.
 *
 * Two crossed repeating gradients rather than an SVG `<pattern>`. The pattern
 * version needed an id, and an id on a component rendered more than once per
 * page is a duplicate id in the document — the second band referenced the first
 * band's pattern. Gradients have no such handle to collide on.
 *
 * Decoration, so it is hidden from assistive technology: the headings either
 * side already say where the reader is.
 */
export default function LatticeDivider({
  className = "",
  /** Height of the band in pixels. */
  height = 26,
}: {
  className?: string;
  height?: number;
}) {
  const slat = "rgba(201,162,39,0.38)";
  const rail = "rgba(192,16,43,0.65)";

  return (
    <div
      aria-hidden
      role="presentation"
      className={cn("w-full", className)}
      style={{
        height,
        borderTop: `2px solid ${rail}`,
        borderBottom: `2px solid ${rail}`,
        backgroundImage: [
          `repeating-linear-gradient(45deg, ${slat} 0 1.5px, transparent 1.5px 11px)`,
          `repeating-linear-gradient(-45deg, ${slat} 0 1.5px, transparent 1.5px 11px)`,
        ].join(","),
      }}
    />
  );
}
