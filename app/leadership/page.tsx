import type { Metadata } from "next";
import SiteHeader from "@/components/ui/site-header";
import { ORG } from "@/lib/legal/org";
import { ADVISORS, BOARD_TERM, EXECUTIVE_BOARD, MEMBERS, type Person } from "@/lib/constants/people";

export const metadata: Metadata = {
  title: `Executive Board — ${ORG.name}, ${ORG.chapter}`,
  description:
    `The executive board, members and advisors of the ${ORG.chapter} of the ${ORG.name}, ` +
    `for the ${BOARD_TERM} term.`,
};

/**
 * The chapter's people.
 *
 * Its own page rather than a section on the landing page: thirty names is more
 * than a landing page should carry, and a roster is the kind of thing people
 * link to directly.
 */

/** Initials for the avatar, taken from the name minus its honorific. */
function initials(name: string): string {
  return name
    .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function PersonCard({ person, prominent = false }: { person: Person; prominent?: boolean }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
        prominent
          ? "border-patasi/50 bg-patasi/10 hover:border-patasi"
          : "border-white/12 bg-white/[0.04] hover:border-lun/40"
      }`}
    >
      <span
        aria-hidden
        className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          prominent ? "bg-patasi text-white" : "bg-lun/15 text-lun"
        }`}
      >
        {initials(person.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-white">{person.name}</span>
        {person.role && <span className="block text-sm text-lun">{person.role}</span>}
        {person.city && (
          <span className="block text-xs uppercase tracking-wide text-white/40">{person.city}</span>
        )}
      </span>
    </div>
  );
}

function Section({
  kicker,
  title,
  blurb,
  people,
  prominent = false,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  kicker: string;
  title: string;
  blurb: string;
  people: Person[];
  prominent?: boolean;
  columns?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-lun">{kicker}</p>
      <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-white/70">{blurb}</p>
      <div className={`mt-7 grid gap-4 ${columns}`}>
        {people.map((person) => (
          <PersonCard key={person.name} person={person} prominent={prominent} />
        ))}
      </div>
    </section>
  );
}

export default function LeadershipPage() {
  return (
    <main className="min-h-screen pt-28">
      <SiteHeader />

      <div className="mx-auto w-full max-w-5xl px-5 pb-4 pt-6 sm:px-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Who runs the chapter</h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">
          The officers, members and advisors of the {ORG.chapter}, for the {BOARD_TERM} term.
        </p>
      </div>

      <Section
        kicker="Executive board"
        title={`Officers, ${BOARD_TERM}`}
        blurb="Elected to run the chapter for this term."
        people={EXECUTIVE_BOARD}
        prominent
      />

      <Section
        kicker="Members"
        title="The people who make it happen"
        blurb="The chapter's members and volunteers across Northern California."
        people={MEMBERS}
      />

      <Section
        kicker="Advisors"
        title="Board of advisors"
        blurb="Those the chapter turns to for counsel."
        people={ADVISORS}
        columns="sm:grid-cols-2 lg:grid-cols-3"
      />

      <div className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8">
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-relaxed text-white/55">
          If you are listed here and would like your entry changed or removed, email{" "}
          <a
            href={`mailto:${ORG.contactEmail}`}
            className="font-semibold text-white/80 underline underline-offset-4 hover:text-white"
          >
            {ORG.contactEmail}
          </a>{" "}
          and it will be done.
        </p>
      </div>
    </main>
  );
}
