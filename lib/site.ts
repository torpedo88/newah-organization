/**
 * Absolute base URL for the site.
 *
 * Needed by metadataBase so Open Graph image and canonical URLs resolve to
 * absolute links — a relative one makes link previews silently fail, since the
 * scraper has no page context to resolve it against.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
