import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, Phone, Ticket } from "lucide-react";
import SiteHeader from "@/components/ui/site-header";
import NhuDayaBackdrop from "@/components/ui/nhu-daya-backdrop";
import LatticeDivider from "@/components/ui/lattice-divider";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { ORG } from "@/lib/legal/org";
import {
  MHAPUJA_ADULT_PRICE_CENTS,
  MHAPUJA_CHILD_AGE_CEILING,
  MHAPUJA_CHILD_PRICE_CENTS,
  MHAPUJA_CONTACTS,
  MHAPUJA_EVENT,
  MHAPUJA_FEE_INCLUDES,
  MHAPUJA_STORY,
} from "@/lib/constants/mhapuja";
import { NEPAL_SAMBAT } from "@/lib/constants/event";

const PAGE_TITLE = `${MHAPUJA_EVENT.name} — ${ORG.chapter}`;
const PAGE_DESCRIPTION =
  `Mha Puja with the Newah Organization of America, Northern California Chapter. ` +
  `${MHAPUJA_EVENT.tagline}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/mhapuja" },
  openGraph: {
    url: "/mhapuja",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

/**
 * Mha Puja landing page.
 *
 * A page a visitor skims first and reads second. The hero names what the
 * evening is and what it costs; the body tells the story in three short
 * sections (what Mha Puja is, when it falls, why it is held here); the
 * footer leads to the registration form.
 *
 * Nothing is asserted about this chapter's own evening until the board
 * supplies it. `MHAPUJA_EVENT.date / venue / city` start empty and the
 * when/where panel renders only when they are set — a date invented to fill
 * a layout is worse than a layout that admits the field is blank.
 */
const ADULT_PRICE = (MHAPUJA_ADULT_PRICE_CENTS / 100).toFixed(0);
const CHILD_PRICE = (MHAPUJA_CHILD_PRICE_CENTS / 100).toFixed(0);

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
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl scroll-mt-28 px-5 sm:px-8 ${className}`}
    >
      {children}
    </section>
  );
}

export default function MhaPujaPage() {
  // The when/where fields are now populated from the 2025 flyer. Values are
  // compile-time literals so the TypeScript narrowing used earlier (treating
  // them as possibly empty) is no longer needed. If any of these ever go blank
  // again, the panel below has to grow its guards back.
  const hasWhen = Boolean(MHAPUJA_EVENT.date);
  const hasWhere = Boolean(MHAPUJA_EVENT.venue) || Boolean(MHAPUJA_EVENT.city);

  return (
    <div className="relative min-h-screen">
      <NhuDayaBackdrop />
      <SiteHeader />

      <main className="relative pt-28 pb-24">
        {/* Hero */}
        <Section className="pt-6 pb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-lun">
            Nepal Sambat {MHAPUJA_EVENT.nepalSambatYear} begins {NEPAL_SAMBAT.nextNewYear}
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            {MHAPUJA_EVENT.name}
          </h1>
          {/* Nepal Bhasa title printed under the English name. On the 2025 flyer
              the Nepal Bhasa title was the dominant one; here the English name
              leads so a search engine or screen reader finds the event first,
              and the Nepal Bhasa title keeps its place beside it. */}
          <p className="mt-2 text-xl font-semibold text-lun sm:text-2xl">
            {MHAPUJA_EVENT.nepalBhasaTitle}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            {MHAPUJA_EVENT.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register/mhapuja">
              <LiquidButton size="xxl" className="text-white">
                <Ticket className="mr-2 size-5" />
                Register
              </LiquidButton>
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/60">
            Adults (10 and over) ${ADULT_PRICE} &middot; children (under {MHAPUJA_CHILD_AGE_CEILING}) ${CHILD_PRICE}
            {" "}&middot; {MHAPUJA_FEE_INCLUDES}
          </p>
        </Section>

        <LatticeDivider />

        {/* When & where — rendered only when the board has supplied values. */}
        {(hasWhen || hasWhere) && (
          <Section className="py-14">
            <div className="grid gap-6 sm:grid-cols-2">
              {hasWhen && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <CalendarDays className="mb-3 size-6 text-lun" />
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/55">
                    When
                  </p>
                  <p className="text-xl font-bold text-white">{MHAPUJA_EVENT.date}</p>
                  {MHAPUJA_EVENT.schedule && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                      <Clock className="size-4 text-lun" aria-hidden />
                      {MHAPUJA_EVENT.schedule}
                    </p>
                  )}
                </div>
              )}
              {hasWhere && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <MapPin className="mb-3 size-6 text-lun" />
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/55">
                    Where
                  </p>
                  {MHAPUJA_EVENT.venue && (
                    <p className="text-xl font-bold text-white">{MHAPUJA_EVENT.venue}</p>
                  )}
                  {MHAPUJA_EVENT.city && (
                    <p className="text-white/70">{MHAPUJA_EVENT.city}</p>
                  )}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Story */}
        <Section className="py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {MHAPUJA_STORY.map((part) => (
              <article key={part.heading} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="mb-3 text-lg font-bold text-white">{part.heading}</h2>
                <p className="text-white/75">{part.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <LatticeDivider />

        {/* Final CTA */}
        <Section className="py-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Join us for Mha Puja</h2>
          <p className="mx-auto mb-8 max-w-xl text-white/70">
            Tickets are limited. Register in advance so the chapter can plan
            seating and sagan for everyone coming.
          </p>
          <Link href="/register/mhapuja">
            <LiquidButton size="xxl" className="text-white">
              <Ticket className="mr-2 size-5" />
              Register and pay
            </LiquidButton>
          </Link>

          {/* Day-of contacts, carried from the 2025 flyer. People print the
              phone numbers off and bring them; keeping the two names and
              numbers readable at the bottom of the page serves that use. */}
          {MHAPUJA_CONTACTS.length > 0 && (
            <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
              {MHAPUJA_CONTACTS.map((contact) => (
                <div
                  key={contact.phone}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80"
                >
                  <Phone className="size-4 text-lun" aria-hidden />
                  <span className="font-semibold text-white">{contact.name}</span>
                  <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="hover:text-white">
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-sm text-white/55">
            Questions? Write to{" "}
            <a href={`mailto:${ORG.contactEmail}`} className="underline underline-offset-2 hover:text-white/80">
              {ORG.contactEmail}
            </a>
            .
          </p>
        </Section>
      </main>
    </div>
  );
}
