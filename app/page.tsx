import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, LockKeyhole, MapPin } from "lucide-react";
import SiteHeader from "@/components/ui/site-header";
import AnimatedMarqueeHero from "@/components/ui/animated-marquee-hero";
import { COMMUNITY_PHOTOS } from "@/lib/constants/community-photos";
import PhotoCredits from "@/components/ui/photo-credits";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ORG, formattedAddress } from "@/lib/legal/org";
import { EVENT, FESTIVALS } from "@/lib/constants/event";
import { ABOUT_BACKGROUND, ABOUT_INTRO, MISSION_POINTS } from "@/lib/constants/about";
import { BOARD_TERM, EXECUTIVE_BOARD } from "@/lib/constants/people";

export const metadata: Metadata = {
  title: `${ORG.name} — ${ORG.chapter}`,
  description:
    "The Northern California chapter of the Newah Organization of America: preserving " +
    "and continuing Newah culture, language, traditions and arts.",
};

/**
 * Chapter landing page.
 *
 * Framed around the organization, not one festival. An earlier version led
 * with Indra Jatra, which misrepresents a chapter whose purpose is the
 * continuation of a culture — the festival is what it is raising money around
 * this year, not what it is.
 *
 * Every claim is sourced: the mission from NOA's own site, the annual
 * programme from what its chapters publish, the chapter's own description from
 * how it presents itself. Nothing is asserted about officers, founding dates
 * or finances, none of which is verified.
 */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

function Heading({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-lun">{kicker}</p>
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{children}</h2>
    </>
  );
}

export default function Home() {
  const hasWhen = EVENT.date !== "";
  const hasWhere = EVENT.venue !== "" || EVENT.city !== "";

  return (
    <main className="bg-haku">
      <SiteHeader />
      <AnimatedMarqueeHero
        tagline={`${ORG.name} \u00b7 Northern California`}
        title={
          <>
            <span className="block font-light text-white/85">Our culture,</span>
            <span className="block">tradition &amp; heritage</span>
            <span className="block font-light italic text-lun">our pride</span>
          </>
        }
        description={`The ${ORG.chapter} of the ${ORG.name} \u2014 keeping Newah language, festivals and craft alive on this side of the world.`}
        ctaText="Register for Indra Jatra"
        ctaHref="/register/indrajatra"
        secondaryText="See our year"
        secondaryHref="#our-year"
        images={COMMUNITY_PHOTOS}
      />

        {/* Who we are ------------------------------------------------- */}
        <Section className="py-16">
          <Heading kicker="Who we are">A community, kept</Heading>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/80">
            We are the {ORG.chapter} of the {ORG.name}. {ABOUT_INTRO}
          </p>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            {ABOUT_BACKGROUND}
          </p>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            {ORG.shortName} has served the Newah diaspora in the United States for a quarter of a
            century, with chapters in Northern California, Southern California, Seattle, Florida
            and New England. This one is based in {ORG.basedIn}.
          </p>

          <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-lun">
            Our mission
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {MISSION_POINTS.map((point) => (
              <li
                key={point}
                className="rounded-2xl border border-white/12 bg-white/[0.04] p-5 text-sm leading-relaxed text-white/75"
              >
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-white/45">
            &mdash; {ORG.name},{" "}
            <a
              href={ORG.website}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-white/75"
            >
              newah.org
            </a>
          </p>
        </Section>

        {/* Language ---------------------------------------------------- */}
        <Section className="py-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <Heading kicker="Nepal Bhasa">A language, and a script</Heading>
              <p className="mt-5 text-pretty leading-relaxed text-white/75">
                Newah is not only a people. It is a language with its own literature, and a script
                that predates the country it is spoken in. Nepal Sambat, the era the community
                still counts by, began in 879 AD and is still running.
              </p>
              <p className="mt-4 text-pretty leading-relaxed text-white/75">
                Keeping that alive outside the Valley is most of what a chapter is for &mdash; the
                festivals are how a language gets spoken by people who do not otherwise have a
                reason to speak it.
              </p>
            </div>
            <div className="photo-bleed relative aspect-[4/3]">
              <Image
                src="/images/patan-durbar.jpg"
                alt="Patan Durbar Square at dusk"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover saturate-90"
              />
            </div>
          </div>
        </Section>

        {/* The year ---------------------------------------------------- */}
        <Section className="py-16" id="our-year">
          <Heading kicker="Our year">What the chapter keeps</Heading>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
            The calendar the community observes, wherever it lives.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FESTIVALS.map((f) => (
              <div key={f.name} className="group rounded-2xl border-2 border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 transition-all hover:border-patasi/50 hover:bg-patasi/12">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-white text-lg">{f.name}</h3>
                  <div className="size-2 rounded-full bg-patasi opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-sm font-medium text-patasi">{f.also}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-white/40">{f.when}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{f.what}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Upcoming events ---------------------------------------------- */}
        <Section className="py-16" id="upcoming">
          <Heading kicker="Upcoming events">What the chapter is doing next</Heading>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
            One event at a time, announced here as the board confirms it.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border-2 border-patasi bg-patasi/12">
            <div className="grid md:grid-cols-5">
              <div className="relative min-h-52 md:col-span-2">
                <Image
                  src="/images/community/indra-jatra-2023-kumari.jpg"
                  alt="The Kumari at the chapter's Indra Jatra in Berkeley, 2023"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-7 sm:p-9 md:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lun-bright">
                  Next up
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  {EVENT.name}: {EVENT.title}
                </h2>

                {!hasWhen && !hasWhere && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-lun/40 bg-lun/10 px-4 py-1.5 text-sm text-lun">
                    <CalendarDays className="size-4 shrink-0" aria-hidden />
                    Date and venue to be announced
                  </p>
                )}

                {(hasWhen || hasWhere) && (
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-white/85">
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

                <p className="mt-4 text-pretty leading-relaxed text-white/80">
                  {EVENT.promise}{" "}
                  <strong className="font-semibold text-white">{EVENT.fundName}</strong>.
                </p>

                <LiquidButton asChild size="xl" className="mt-6 text-white">
                  <Link href="/register/indrajatra">
                    Register
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </LiquidButton>
                <p className="mt-3 text-sm text-white/55">Free to attend &middot; donations optional</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Who runs it -------------------------------------------------- */}
        <Section className="py-16" id="board">
          <Heading kicker="Executive board">Who runs the chapter</Heading>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
            Elected for the {BOARD_TERM} term. The members and advisors are on the{" "}
            <Link href="/leadership" className="underline underline-offset-4 hover:text-white">
              full roster
            </Link>
            .
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {EXECUTIVE_BOARD.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border-2 border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 transition-colors hover:border-patasi/50"
              >
                <p className="font-bold text-white">{person.name}</p>
                <p className="mt-0.5 text-sm font-medium text-patasi-bright">{person.role}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/40">{person.city}</p>
              </div>
            ))}
          </div>
          <Link
            href="/leadership"
            className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
          >
            Members and advisors
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Section>

        {/* Contact ------------------------------------------------------ */}
        <Section className="py-16" id="contact">
          <Heading kicker="Get in touch">Membership, volunteering, questions</Heading>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-white/85">
            <a href={`mailto:${ORG.contactEmail}`} className="font-semibold underline underline-offset-4 hover:text-white">
              {ORG.contactEmail}
            </a>
            <a href={`tel:${ORG.phone.replace(/-/g, "")}`} className="font-semibold underline underline-offset-4 hover:text-white">
              {ORG.phone}
            </a>
            <a href={ORG.facebook} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4 hover:text-white">
              Facebook
            </a>
            <a href={ORG.website} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4 hover:text-white">
              newah.org
            </a>
          </div>
          <p className="mt-5 inline-flex items-start gap-2 text-white/60">
            <MapPin className="mt-0.5 size-4 shrink-0 text-lun" aria-hidden />
            {formattedAddress()}
          </p>
        </Section>

        {/* Footer -------------------------------------------------------- */}
        <footer className="mx-auto w-full max-w-5xl px-5 pb-14 sm:px-8">
          <div className="border-t border-white/10 pt-7">
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55">
              <Link href="/register/indrajatra" className="underline-offset-4 hover:text-white/85 hover:underline">Register</Link>
              <Link href="/privacy" className="underline-offset-4 hover:text-white/85 hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="underline-offset-4 hover:text-white/85 hover:underline">Terms and Conditions</Link>
            </nav>
            <p className="mt-5 text-center text-xs text-white/40">
              &copy; {new Date().getFullYear()} {ORG.name} &mdash; {ORG.chapter}
            </p>
            <div className="mt-4 flex justify-center">
              <Link href="/admin" aria-label="Board sign-in" className="inline-flex items-center gap-1.5 text-xs text-white/30 underline-offset-4 hover:text-white/60 hover:underline">
                <LockKeyhole className="size-3" aria-hidden />
                Board sign-in
              </Link>
            </div>
            <PhotoCredits className="mt-6 text-center" />
          </div>
        </footer>
    </main>
  );
}
