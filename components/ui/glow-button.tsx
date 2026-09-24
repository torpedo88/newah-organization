"use client";

import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

/**
 * The glow button, from 21st.dev, rebuilt for this chapter.
 *
 * Three stacked gradients rotate behind the surface and are pushed through an
 * feColorMatrix that crushes everything but the brightest part, so the light
 * reads as a moving edge rather than a blur. That technique is the component;
 * the rest needed changing.
 *
 * - **It was not clickable.** The source's only `<button>` is
 *   `absolute … opacity-0` over a stack of divs, so the thing a person sees is
 *   not the thing they press, the label is not the button's accessible name,
 *   and the whole control vanishes for anyone navigating by keyboard. Here the
 *   link is the element, and the glow is painted behind it.
 * - **`<style jsx global>` is gone.** styled-jsx in an App Router tree pulls
 *   the subtree client-side to ship a stylesheet. The keyframes are in
 *   globals.css.
 * - **The clip-path is gone.** It was a literal path in pixels, which fixes the
 *   button at 120x60 and clips any other label. A rounded rectangle gives the
 *   same silhouette at any width.
 * - **The palette.** #f50 orange into #05f blue belongs to the demo. This runs
 *   patasi red into lun gold.
 * - The `dark:` variants did nothing: this project never sets `.dark`.
 *
 * The rotation is infinite, so it stops under prefers-reduced-motion — the
 * button keeps its colour and its border, and simply holds still.
 */

type GlowButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Patasi red through to lun gold, the sari's own two colours. */
const SWEEP = "linear-gradient(90deg, #C0102B 22%, transparent 45% 55%, #C9A227 78%)";
const SWEEP_SOFT = "linear-gradient(90deg, #E23B50 28%, transparent 48% 52%, #E3C463 72%)";

export function GlowButton({ href, children, className }: GlowButtonProps) {
  const reactId = useId().replace(/:/g, "");
  const hard = `glow-hard-${reactId}`;
  const soft = `glow-soft-${reactId}`;
  const reduceMotion = usePrefersReducedMotion();

  const spin = reduceMotion
    ? ""
    : "animate-[glow-spin_8s_cubic-bezier(0.56,0.15,0.28,0.86)_infinite,glow-breathe_4s_infinite]";

  return (
    <div data-animated-button className={cn("group/glow relative inline-flex", className)}>
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <filter id={hard} width="300%" x="-100%" height="300%" y="-100%">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 9 0" />
        </filter>
        <filter id={soft} width="300%" x="-100%" height="300%" y="-100%">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0" />
        </filter>
      </svg>

      {/* The halo the button throws onto the header. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden rounded-full opacity-40 transition-opacity duration-300 group-hover/glow:opacity-80"
        style={{ filter: `blur(1.1em) url(#${hard})` }}
      >
        <span className={cn("absolute inset-[-150%] block", spin)} style={{ background: SWEEP }} />
      </span>

      {/* The lit edge. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-1.5px] -z-10 overflow-hidden rounded-full opacity-70 transition-opacity duration-300 group-hover/glow:opacity-100"
        style={{ filter: `blur(2px) url(#${soft})` }}
      >
        <span className={cn("absolute inset-[-150%] block", spin)} style={{ background: SWEEP_SOFT }} />
      </span>

      <Link
        href={href}
        className="relative inline-flex items-center justify-center rounded-full bg-haku-deep px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-kwa transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lun active:scale-[0.98] sm:text-sm"
      >
        {children}
      </Link>
    </div>
  );
}

export default GlowButton;
