import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/ui/nav-links";
import { GlowButton } from "@/components/ui/glow-button";
import { ORG } from "@/lib/legal/org";

/**
 * The chapter's header.
 *
 * It lived inside the shader hero, which meant swapping the hero would have
 * taken the navigation with it. It is the site's, not any one hero's.
 *
 * The wordmark sets the organization's name in full. "NOA" is an abbreviation
 * the community already knows and a stranger does not, and the header is the
 * one place on the page that has to introduce it. Small caps with open
 * tracking keep a long name reading as a mark rather than a sentence, and it
 * breaks onto two lines by design — the chapter is the second line because the
 * organization is the first.
 */
export default function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-3 border-b-4 border-patasi bg-gradient-to-r from-haku to-haku/80 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-8">
      <Link
        href="/"
        className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lun"
        aria-label={`${ORG.name} home`}
      >
        <Image
          src="/images/newah-full-logo-transparent.png"
          alt=""
          width={512}
          height={512}
          priority
          className="size-16 shrink-0 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:size-20"
        />
        {/* At 390px the logo, a twenty-nine character name and the Register
            button cannot all have what they want, and flexbox resolves that by
            shrinking the logo — which is the thing that must not shrink. So the
            chapter line is the header's on a phone and the organization's name
            above sm; both are rendered, one is hidden, and the accessible name
            on the link is always the full one. */}
        <span className="text-[0.6875rem] font-semibold uppercase leading-[1.3] tracking-[0.1em] text-lun sm:text-sm sm:tracking-[0.12em]">
          <span className="block max-w-[8.5rem] sm:hidden">Northern California</span>
          <span className="hidden sm:block">
            {ORG.name}
            <span className="block font-medium tracking-[0.16em] text-lun/70">
              Northern California
            </span>
          </span>
        </span>
      </Link>

      <NavLinks />

      <GlowButton href="/register/indrajatra" className="shrink-0">
        Register
      </GlowButton>
    </header>
  );
}
