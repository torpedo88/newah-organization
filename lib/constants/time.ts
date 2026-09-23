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
