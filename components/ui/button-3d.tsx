"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

/**
 * The 3D pill button, from 21st.dev, rebuilt as a link.
 *
 * The source arrived incomplete: its markup hangs off a stylesheet of `.button`,
 * `.bg`, `.wrap`, `.path`, `.outline`, `.content`, `.char` and `.icon` rules
 * that was never included — only the @keyframes were. Pasted as-is it renders
 * as unstyled text. So the behaviour is rebuilt here from what the markup and
 * the keyframes imply, in Tailwind, against this project's palette.
 *
 * What is kept: the outline that draws itself round the pill, the label whose
 * characters rise one after another, and the rays that flick outward on press.
 *
 * What is dropped, and why:
 * - The `useState` counter. It was never read or rendered.
 * - The hard-coded "Join Today"/"Join Now" labels. A header link says where it
 *   goes; the label is a prop.
 * - The 342x208 splash canvas. At the size a header link actually is, twelve
 *   full-length rays are noise — six short ones read as a flick.
 * - `<button>`. These navigate, so they are links. A button that navigates is
 *   not reachable by middle-click, cannot be opened in a new tab, and lies to
 *   assistive technology about what it does.
 */

type Button3DProps = {
  href: string;
  children: string;
  className?: string;
};

export default function Button3D({ href, children, className }: Button3DProps) {
  const reduceMotion = usePrefersReducedMotion();
  const characters = [...children];

  return (
    <Link
      href={href}
      data-animated-button
      className={cn(
        "group/btn relative inline-flex select-none items-center justify-center",
        "rounded-full px-4 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.14em]",
        "text-lun/75 transition-[color,transform] duration-200",
        "hover:text-lun focus-visible:text-lun focus-visible:outline-none active:scale-[0.97]",
        className,
      )}
    >
      {/* The pill that fills in behind the label. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 scale-95 rounded-full bg-lun/0 opacity-0 transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-lun/10 group-hover/btn:opacity-100 group-focus-visible/btn:scale-100 group-focus-visible/btn:bg-lun/10 group-focus-visible/btn:opacity-100"
      />

      {/* The outline, drawn from one end to the other. A rect rather than the
          source's hand-plotted path, so it fits a label of any length, with
          pathLength normalising the perimeter to 100 so one dash array serves
          every label.

          rx and ry are half the rendered height, not some large number: SVG
          clamps rx to half the width and ry to half the height independently,
          so rx="999" on a wide, short rect draws an ellipse, not a pill. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="18"
          ry="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset="100"
          className={cn(
            "text-lun/70 transition-[stroke-dashoffset] duration-500 ease-out",
            "[stroke-dashoffset:100] group-hover/btn:[stroke-dashoffset:0] group-focus-visible/btn:[stroke-dashoffset:0]",
          )}
        />
      </svg>

      {/* The rays. Six, short, and only on press — the source fires twelve at
          full length on a canvas five times the button's size. */}
      {!reduceMotion && (
        <svg
          aria-hidden
          viewBox="0 0 120 60"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[220%] w-[160%] -translate-x-1/2 -translate-y-1/2 overflow-visible opacity-0 group-active/btn:opacity-100"
        >
          <g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-lun [stroke-dasharray:60] [stroke-dashoffset:0] group-active/btn:[animation:splash_0.5s_ease-out_forwards]"
          >
            <path d="M18 30 C 10 30, 6 26, 0 24" />
            <path d="M102 30 C 110 30, 114 26, 120 24" />
            <path d="M40 14 C 38 6, 40 2, 42 -4" />
            <path d="M80 14 C 82 6, 80 2, 78 -4" />
            <path d="M40 46 C 38 54, 40 58, 42 64" />
            <path d="M80 46 C 82 54, 80 58, 78 64" />
          </g>
        </svg>
      )}

      {/* The label. Each character is its own span so they can rise in
          sequence; the delay is the index, which is what the source's --i was
          for. The visible copy is hidden from assistive technology and a plain
          one carries the name, because a word split into nine elements is
          announced as nine separate words. */}
      <span aria-hidden className="relative flex">
        {characters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className={cn(
              "inline-block whitespace-pre",
              !reduceMotion &&
                "[animation-fill-mode:both] group-hover/btn:[animation:char-appear_0.45s_ease-out_both] group-focus-visible/btn:[animation:char-appear_0.45s_ease-out_both]",
            )}
            style={reduceMotion ? undefined : { animationDelay: `${index * 28}ms` }}
          >
            {character}
          </span>
        ))}
      </span>
      <span className="sr-only">{children}</span>
    </Link>
  );
}
