import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Server-only, by construction and by the
 * `server-only` import above.
 *
 * The registrations table has no SELECT policy — that is deliberate. The
 * publishable key is public by design and this project's was committed to a
 * public repository, so anything the anon role may read should be treated as
 * readable by anyone. The board therefore reads through the service role, which
 * bypasses RLS, and which must never be reachable from the client bundle.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
