import Image from "next/image";
import Link from "next/link";
import { ORG } from "@/lib/legal/org";

/**
 * The chapter's header.
 *
 * It lived inside the shader hero, which meant swapping the hero would have
 * taken the navigation with it. It is the site's, not any one hero's.
 */
export default function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-4 border-b-4 border-patasi bg-gradient-to-r from-haku to-haku/80 px-5 py-3 backdrop-blur-sm sm:px-8">
      <Link href="/" className="flex items-center gap-3" aria-label={`${ORG.name} home`}>
        <Image
          src="/images/newah-full-logo-transparent.png"
          alt=""
          width={512}
          height={512}
          priority
          className="size-12 object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:size-16"
        />
        <span className="hidden text-sm font-semibold leading-tight text-lun sm:block">
          {ORG.shortName}
          <span className="block text-xs font-normal text-lun/80">Northern California</span>
        </span>
      </Link>

      <nav className="flex items-center gap-2 text-sm sm:gap-3">
        {[
          ["Our year", "#our-year"],
          ["This year", "#this-year"],
          ["Contact", "#contact"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-3 py-1 font-medium text-lun/80 transition-colors hover:bg-lun/20 hover:text-lun"
          >
            {label}
          </a>
        ))}
      </nav>

      <Link
        href="/register/indrajatra"
        className="rounded-full bg-lun px-6 py-2 text-sm font-semibold text-haku transition-colors hover:bg-lun/90"
      >
        Register
      </Link>
    </header>
  );
}
