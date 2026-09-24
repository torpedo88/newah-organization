"use client";

import Button3D from "@/components/ui/button-3d";

/**
 * The header's section links.
 *
 * Each is a Button3D: the pill fills, its outline draws itself round the
 * label, the characters rise in sequence, and a few short rays flick outward
 * on press.
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
        <Button3D key={href} href={href}>
          {label}
        </Button3D>
      ))}
    </nav>
  );
}
