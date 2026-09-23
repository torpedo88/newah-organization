/**
 * Absolute base URL for the site.
 *
 * Needed by metadataBase so Open Graph image and canonical URLs resolve to
 * absolute links — a relative one makes link previews silently fail, since the
 * scraper has no page context to resolve it against.
 *
 * Every candidate is validated before it is returned. `new URL()` throws on a
 * malformed value, and this runs at module scope in app/layout.tsx, so one bad
 * environment variable would otherwise take down every page in the app rather
 * than degrading a preview image. That is exactly what happened locally when
 * NEXT_PUBLIC_SITE_URL was marked Sensitive in Vercel and `vercel env pull`
 * returned the literal string "[SENSITIVE]".
 */
const FALLBACK = "https://newah-organization.vercel.app";

function valid(candidate: string | undefined): string | null {
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function siteUrl(): string {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return (
    valid(process.env.NEXT_PUBLIC_SITE_URL) ??
    valid(host ? `https://${host}` : undefined) ??
    valid(process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined) ??
    FALLBACK
  );
}
