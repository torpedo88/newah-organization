"use client";

import Button3D from "@/components/ui/button-3d";

/**
 * The header's section links.
 *
 * Each is a Button3D: the pill fills, its outline draws itself round the
 * label, the characters rise in sequence, and a few short rays flick outward
 * on press.
 *
 * The section links are "/#id", not "#id". The header now renders on pages
 * other than the landing page, where a bare hash would look for a section that
 * is not there and do nothing.
 */

const LINKS: ReadonlyArray<readonly [label: string, href: string]> = [
  ["Our people", "/newah"],
  ["Upcoming", "/#upcoming"],
  ["Board", "/leadership"],
  ["Contact", "/#contact"],
];

export default function NavLinks() {
  return (
    <nav className="hidden items-center gap-1 sm:flex">
      {LINKS.map(([label, href]) => (
        <Button3D key={href} href={href}>
          {label}
        </Button3D>
      ))}
    </nav>
  );
}
