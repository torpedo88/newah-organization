/**
 * Dates and times for the board, in the chapter's own timezone.
 *
 * `toLocaleString()` without a timezone uses the *runtime's* zone. The admin
 * page is a server component and Vercel's servers run in UTC, so every
 * registration time was being shown seven or eight hours ahead of when it
 * actually happened — which for a desk list is not a cosmetic problem.
 *
 * Pinned to America/Los_Angeles rather than to the viewer's locale: the board
 * reads these while standing in Northern California, and a list where each
 * person sees different times is worse than one that is explicitly local.
 * The zone handles PST and PDT itself, so the label stays honest year round.
 */
export const CHAPTER_TIMEZONE = "America/Los_Angeles";

// Explicit components rather than dateStyle/timeStyle: the spec forbids
// combining those shortcuts with timeZoneName, and Intl throws
// "Invalid option : option" rather than ignoring it. The zone label is worth
// keeping — a bare time on a desk list invites exactly the confusion this is
// fixing.
const dateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: CHAPTER_TIMEZONE,
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

const dateOnly = new Intl.DateTimeFormat("en-US", {
  timeZone: CHAPTER_TIMEZONE,
  year: "numeric",
  month: "short",
  day: "numeric",
});

/** e.g. "Sep 23, 2026, 11:53 AM PDT" */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateTime.format(d);
}

/** e.g. "Sep 23, 2026" */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : dateOnly.format(d);
}

// A <input type="datetime-local"> value ("2026-11-10T15:00") carries no zone.
// Sent to Postgres as is, a timestamptz column reads it as UTC, so an event
// entered as 3:00 PM was stored as 8:00 AM Pacific. These two convert
// between that input format and an instant, in the chapter's zone.

const localParts = new Intl.DateTimeFormat("en-US", {
  timeZone: CHAPTER_TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function partsOf(d: Date): Record<string, string> {
  return Object.fromEntries(localParts.formatToParts(d).map((p) => [p.type, p.value]));
}

/** Minutes the chapter's wall clock is ahead of UTC at instant `d` (negative here). */
function chapterOffsetMinutes(d: Date): number {
  const p = partsOf(d);
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return Math.round((asUtc - Math.floor(d.getTime() / 60000) * 60000) / 60000);
}

/** "2026-11-10T15:00" read as Pacific wall-clock time -> ISO instant. Null if unparseable. */
export function chapterLocalToIso(local: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(local);
  if (!m) return null;
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // Two passes settle the offset across a DST boundary.
  let instant = wall - chapterOffsetMinutes(new Date(wall)) * 60000;
  instant = wall - chapterOffsetMinutes(new Date(instant)) * 60000;
  return new Date(instant).toISOString();
}

/** ISO instant -> "2026-11-10T15:00" in Pacific, for a datetime-local input. */
export function isoToChapterLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = partsOf(d);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
