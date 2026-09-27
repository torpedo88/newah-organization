import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/ui/site-header";
import LatticeDivider from "@/components/ui/lattice-divider";
import { ORG } from "@/lib/legal/org";
import {
  CRAFTS,
  LIFE_RITUALS,
  PILLARS,
  SOURCES,
  WHO_THEY_ARE,
  type Fact,
} from "@/lib/constants/newars";
import { ASTA_MANGAL, FAMOUS_WINDOWS, NEWAR_WINDOWS } from "@/lib/constants/motifs";
import { FESTIVALS } from "@/lib/constants/event";

export const metadata: Metadata = {
  title: `Who the Newars are — ${ORG.name}, ${ORG.chapter}`,
  description:
    "The Newars are the historic inhabitants of the Kathmandu Valley: their language Nepal " +
    "Bhasa, the Nepal Sambat era, the guthi, the festivals, the craft and the rituals that mark " +
    "a life.",
};

/**
 * Who the Newars are.
 *
 * The chapter exists to keep a culture going on this side of the world, and
 * until now the site said that without ever saying what the culture is. This
 * page is the answer, and it is sourced: every claim comes from the references
 * listed at the bottom, which are on the page so a reader can check them
 * rather than take a website's word for it.
 */

function Section({
  kicker,
  title,
  lede,
  children,
  id,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl 2xl:max-w-7xl scroll-mt-28 px-5 py-14 sm:px-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-lun">{kicker}</p>
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      {lede && <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">{lede}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function FactCards({ facts, columns = "sm:grid-cols-2" }: { facts: Fact[]; columns?: string }) {
  return (
    <div className={`grid gap-4 ${columns}`}>
      {facts.map((fact) => (
        <div
          key={fact.term}
          className="rounded-2xl border-2 border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 transition-colors hover:border-lun/40"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-bold text-white">{fact.term}</h3>
            {fact.script && (
              <span lang="ne" className="shrink-0 text-sm text-lun">
                {fact.script}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{fact.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function NewahPage() {
  return (
    <main className="min-h-screen pt-28">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl 2xl:max-w-7xl px-5 pb-6 pt-8 sm:px-8">
        <div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-lun">
              Newa&#x304;h
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Who the Newars are
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/80">
              {WHO_THEY_ARE.lede}
            </p>
          </div>
        </div>

        {WHO_THEY_ARE.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            {paragraph}
          </p>
        ))}

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-12">
          {WHO_THEY_ARE.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-2xl font-bold tabular-nums text-lun">{stat.value}</span>
                <span
                  aria-hidden
                  className="mt-1 block text-[0.6875rem] font-medium uppercase leading-snug tracking-[0.14em] text-white/55"
                >
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <LatticeDivider className="my-6" />

      <Section
        kicker="What holds it together"
        title="A language, an era, and a way of running a city"
        lede="Five things do most of the work of keeping a Newah community a community."
        id="pillars"
      >
        <FactCards facts={PILLARS} />
      </Section>

      <Section
        kicker="The year"
        title="What the chapter keeps"
        lede="The calendar the community observes, wherever it lives."
        id="year"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FESTIVALS.map((festival) => (
            <div
              key={festival.name}
              className="rounded-2xl border-2 border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6"
            >
              <h3 className="text-lg font-bold text-white">{festival.name}</h3>
              <p className="mt-0.5 text-sm font-medium text-patasi-bright">{festival.also}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/55">{festival.when}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{festival.what}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="A life"
        title="How the community marks one"
        lede="Three passages, each with its own ceremony."
        id="rituals"
      >
        <FactCards facts={LIFE_RITUALS} columns="sm:grid-cols-3" />
      </Section>

      <LatticeDivider className="my-6" />

      <Section
        kicker="Craft"
        title="What the hands made"
        lede="Painting, casting, carving and the drums, all out of the same valley."
        id="craft"
      >
        <FactCards facts={CRAFTS} />
      </Section>

      <Section
        kicker="Windows"
        title="A house is read from its windows"
        lede="Each floor takes a different one, and each does a job before it is beautiful."
        id="windows"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {NEWAR_WINDOWS.map((window) => (
            <div
              key={window.name}
              className="rounded-2xl border-2 border-white/12 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-bold text-white">{window.name}</h3>
                <span lang="ne" className="text-sm text-lun">
                  {window.devanagari}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{window.what}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-lun">
          Three the valley knows by name
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {FAMOUS_WINDOWS.map((window) => (
            <li key={window.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-semibold text-white">{window.name}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-white/55">{window.where}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{window.what}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        kicker="Asta Mangal"
        title="The eight auspicious signs"
        lede="Carved over doorways, beaten into metal, drawn in colour at the threshold on a festival morning. They are signs rather than ornament, so they are named."
        id="asta-mangal"
      >
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {ASTA_MANGAL.map((sign) => (
            <div key={sign.name} className="border-l-2 border-patasi/50 pl-4">
              <dt className="font-semibold text-white">
                {sign.name} <span className="font-normal text-lun">&mdash; {sign.english}</span>
              </dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-white/60">{sign.meaning}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <LatticeDivider className="my-6" />

      <section className="mx-auto w-full max-w-6xl 2xl:max-w-7xl px-5 py-14 sm:px-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-lun">Where this comes from</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
          Written from published references rather than from memory, and listed here so anyone can
          check it. Corrections are welcome and wanted &mdash; this is the community&rsquo;s own
          story, and the chapter would rather be told it has something wrong than leave it wrong.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-white/70 underline underline-offset-4 hover:text-white"
              >
                {source.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/45">
          Two things are deliberately left out. Newar cuisine has an article whose own editors warn
          it may contain machine-written text and invented references, so nothing here is taken
          from it. And the caste and occupational groups are not listed: they are real and they are
          contested, and they belong to the community to write about rather than to a website to
          summarise.
        </p>

        <Link
          href="/#contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
        >
          Tell us what we got wrong
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </main>
  );
}
