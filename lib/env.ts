/**
 * Validated public environment variables.
 *
 * Only NEXT_PUBLIC_* variables belong in this module. It is imported by client
 * components, and Next.js replaces only NEXT_PUBLIC_-prefixed variables in the
 * browser bundle — anything else is `undefined` there, so validating a
 * server-only variable here would throw in every visitor's browser.
 *
 * Server-only configuration gets its own `server-only` module when a server
 * feature actually needs it.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env.local and fill it in, or set it in your ` +
        `Vercel project settings.`,
    );
  }
  return value;
}

// Referenced literally, not through a lookup — Next.js inlines these at build
// time only when it can see the full `process.env.NEXT_PUBLIC_*` expression.
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: required(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
} as const;
