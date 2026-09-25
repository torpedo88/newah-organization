import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FestivalBackdrop, { FestivalPhotoCredit } from "@/components/ui/festival-backdrop";
import { ORG, POLICY_EFFECTIVE_DATE } from "@/lib/legal/org";

/**
 * Shared shell for the privacy policy and the terms.
 *
 * Long legal text needs to be read, not admired, so the card is more opaque
 * than the registration card and the body copy runs near-white rather than at
 * the muted 70% used elsewhere.
 */
export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <FestivalBackdrop />
      <div className="relative mx-auto w-full max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to home
        </Link>

        <article className="rounded-3xl border border-white/10 bg-haku/80 p-8 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] sm:p-10">
          <header className="mb-8 border-b border-white/15 pb-6">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-white/60">
              {ORG.name} &mdash; {ORG.chapter}
            </p>
            <p className="mt-1 text-sm text-white/50">
              Effective {POLICY_EFFECTIVE_DATE}
            </p>
          </header>

          <div className="space-y-6 text-[15px] leading-relaxed text-white/85 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-white [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-white [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-white [&_ul]:space-y-2">
            {children}
          </div>
        </article>

        <FestivalPhotoCredit className="mt-8 text-center text-xs text-white/55" />
      </div>
    </div>
  );
}
