"use client";

import { motion } from "motion/react";

/**
 * The header's section links.
 *
 * Plain anchors with a hover colour read as an afterthought next to the solid
 * Register button. These are buttons: a gold rule draws itself under the label
 * from left to right, the label lifts a little, and the whole control presses
 * on tap.
 *
 * The rule is scaled rather than animated in width, so it runs on the
 * compositor and does not lay out the header on every frame. Focus draws the
 * same rule as hover, so it is not a mouse-only affordance.
 */

const LINKS: ReadonlyArray<readonly [label: string, href: string]> = [
  ["Our year", "#our-year"],
  ["Upcoming", "#upcoming"],
  ["Contact", "#contact"],
];

export default function NavLinks() {
  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {LINKS.map(([label, href]) => (
        <motion.a
          key={href}
          href={href}
          whileHover="on"
          whileFocus="on"
          whileTap={{ scale: 0.96 }}
          initial="off"
          className="group relative rounded-lg px-3 py-2 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-lun/75 transition-colors hover:text-lun focus-visible:text-lun focus-visible:outline-none"
        >
          <motion.span
            variants={{ off: { y: 0 }, on: { y: -1 } }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="block"
          >
            {label}
          </motion.span>
          <motion.span
            aria-hidden
            variants={{ off: { scaleX: 0 }, on: { scaleX: 1 } }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
            className="absolute inset-x-3 bottom-1 h-px bg-lun"
          />
        </motion.a>
      ))}
    </nav>
  );
}
