import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { CalendarDays, LockKeyhole, MapPin, ArrowRight } from "lucide-react";
import FestivalBackdrop, { FestivalPhotoCredit } from "@/components/ui/festival-backdrop";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ORG } from "@/lib/legal/org";
import { EVENT } from "@/lib/constants/event";

export const metadata: Metadata = {
  title: `${ORG.name} — ${ORG.chapter}`,
  description:
    `The Northern California chapter of the ${ORG.name}, celebrating Newah identity, ` +
    `language and culture. Register for ${EVENT.name}.`,
};

/**
 * Chapter landing page.
 *
 * Every claim here is either published by the organization itself on
 * newah.org and its chapter Facebook page, or lives in lib/legal/org.ts and
 * lib/constants/event.ts. Nothing about the chapter's founding, its officers
 * or its finances is asserted, because none of that is verified — the officer
 * list on the national chapter page belongs to the organization as a whole,
 * not to this chapter, and repeating it here would put names on a page that
 * may not hold them.
 *
 * The date and venue render only when EVENT supplies them. A festival page
 * that states the wrong date is worse than one that states none.
 */

/** Festivals the organization itself lists as what it celebrates. */
const FESTIVALS = [
  {
    name: "Yenya Punhi",
    also: "Indra Jatra",
    what: "The festival of Kathmandu, and the reason this year's gathering exists.",
  },
  {
    name: "Group Kayeta Puja",
    also: "coming of age",
    what: "The rite that marks a generation stepping into adulthood together.",
  },
  {
    name: "Nepal Sambat",
    also: "the Newah new year",
    what: "Our own calendar, kept and counted by our own community.",
  },
] as const;

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</section>
  );
}

export default function Home() {
  const hasWhen = EVENT.date !== "";
  const hasWhere = EVENT.venue !== "" || EVENT.city !== "";

  return (
    <main className="relative min-h-screen pb-20">
      <FestivalBackdrop />

      {/* Hero ---------------------------------------------------------- */}
      <Section className="pt-16 pb-14 text-center sm:pt-24">
        <Image
          src="/images/newah-full-logo-transparent.png"
          alt=""
          width={1024}
          height={1024}
          priority
          className="mx-auto mb-7 size-28 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] sm:size-36"
        />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-lun">
          {ORG.chapter}
        </p>
        <h1 className="text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
          {ORG.name}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/75">
          Our culture, tradition and heritage &mdash; our pride. A home in Northern California for
          the Newah community, its festivals and the people who keep them.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <LiquidButton asChild size="xxl" className="w-full max-w-sm text-white">
            <Link href="/register/indrajatra">
              Register for {EVENT.name}
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </LiquidButton>
          <p className="text-sm text-white/55">
            Free to attend &middot; donations optional
          </p>
        </div>
      </Section>

      {/* The event and the cause --------------------------------------- */}
      <Section className="pb-14">
        <div className="rounded-3xl border-2 border-patasi bg-patasi/12 p-7 backdrop-blur-[3px] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lun-bright">
            This year
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {EVENT.name}: {EVENT.title}
          </h2>

          {(hasWhen || hasWhere) && (
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-white/85">
              {hasWhen && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 shrink-0 text-lun" aria-hidden />
                  {EVENT.date}
                </span>
              )}
              {hasWhere && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-lun" aria-hidden />
                  {[EVENT.venue, EVENT.city].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          )}

          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-white/80">
            We gather to celebrate {EVENT.name} the way it has always been celebrated &mdash;
            together, with food, with our own music, and with the next generation watching.
          </p>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-white/80">
            {EVENT.promise}{" "}
            <strong className="font-semibold text-white">{EVENT.fundName}</strong>.
          </p>

          <Link
            href="/register/indrajatra"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-lun-bright underline-offset-4 hover:underline"
          >
            Register and see the donation options
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Section>

      {/* Who we are ----------------------------------------------------- */}
      <Section className="pb-14">
        <h2 className="text-xl font-bold text-white sm:text-2xl">Who we are</h2>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/80">
          We are the {ORG.chapter} of the {ORG.name} &mdash; {ORG.shortName}, a non-profit serving
          the Newah diaspora across the United States, with chapters in Northern California,
          Southern California, Seattle, Florida and New England. This chapter is based in{" "}
          {ORG.basedIn}.
        </p>

        {/* Quoted rather than paraphrased: it is the organization's own
            statement of purpose, and rewording it would make it ours. */}
        <blockquote className="mt-6 max-w-2xl border-l-4 border-lun pl-5">
          <p className="text-pretty italic leading-relaxed text-white/75">
            &ldquo;To provide a democratic forum for the Newah community to advance in all field of
            human activities, keeping in perspective the rich historical heritage of the Past,
            working creatively and collectively with friends and well-wishers to resolve important
            issues of the present and to secure the future for the coming generation and our
            country Nepal.&rdquo;
          </p>
          <footer className="mt-3 text-sm text-white/50">
            &mdash; {ORG.name},{" "}
            <a
              href={ORG.website}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-white/75"
            >
              newah.org
            </a>
          </footer>
        </blockquote>
      </Section>

      {/* What we celebrate ---------------------------------------------- */}
      <Section className="pb-14">
        <h2 className="text-xl font-bold text-white sm:text-2xl">What we celebrate</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {FESTIVALS.map((f) => (
            <div
              key={f.name}
              className="rounded-2xl border border-white/12 bg-white/[0.05] p-5 backdrop-blur-[2px]"
            >
              <h3 className="font-bold text-white">{f.name}</h3>
              <p className="mt-0.5 text-sm text-lun">{f.also}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{f.what}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stay in touch --------------------------------------------------- */}
      <Section className="pb-14">
        <div className="rounded-3xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-[2px] sm:p-9">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Stay in touch</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/75">
            Membership, volunteering, or a question about the festival &mdash; write to us, or
            follow the chapter for what is coming next.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-white/85">
            <a
              href={`mailto:${ORG.contactEmail}`}
              className="font-semibold underline underline-offset-4 hover:text-white"
            >
              {ORG.contactEmail}
            </a>
            <a
              href={ORG.facebook}
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline underline-offset-4 hover:text-white"
            >
              Facebook
            </a>
            <a
              href={ORG.website}
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline underline-offset-4 hover:text-white"
            >
              newah.org
            </a>
          </div>
        </div>
      </Section>

      {/* Footer ---------------------------------------------------------- */}
      <footer className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="border-t border-white/10 pt-7">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55">
            <Link href="/register/indrajatra" className="underline-offset-4 hover:text-white/85 hover:underline">
              Register
            </Link>
            <Link href="/privacy" className="underline-offset-4 hover:text-white/85 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="underline-offset-4 hover:text-white/85 hover:underline">
              Terms and Conditions
            </Link>
          </nav>
          <p className="mt-5 text-center text-xs text-white/40">
            &copy; {new Date().getFullYear()} {ORG.name} &mdash; {ORG.chapter}
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/admin"
              aria-label="Board sign-in"
              className="inline-flex items-center gap-1.5 text-xs text-white/35 underline-offset-4 hover:text-white/60 hover:underline"
            >
              <LockKeyhole className="size-3" aria-hidden />
              Board sign-in
            </Link>
          </div>
          <div className="mt-6 flex justify-center">
            <FestivalPhotoCredit />
          </div>
        </div>
      </footer>
    </main>
  );
}
