import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Server-only, by construction and by the
 * `server-only` import above.
 *
 * The registrations table has no SELECT policy — that is deliberate, because
 * the anon key ships to every browser and was committed to a public repo. The
 * board therefore reads through the service role, which bypasses RLS, and it
 * must never be reachable from the client bundle.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
