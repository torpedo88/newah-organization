import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Supabase client for browser/client components.
 *
 * Uses the anon key only. Every query made through this client is subject to
 * Row Level Security — that is the point. Never introduce the service role key
 * here; it bypasses RLS and would be readable by any visitor.
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
