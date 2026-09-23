import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Publishable-key Supabase client, used by the registration Server Action.
 *
 * Despite the `NEXT_PUBLIC_` name on the key, nothing in this app hands this
 * client to a browser: the only importers are the Server Action and the Stripe
 * webhook, both server-side. The `server-only` import above turns that from a
 * fact about today's imports into something the build enforces, so the key
 * cannot start shipping in a client bundle by accident.
 *
 * It is still a *public* key by design, and this project's was committed to a
 * public repository, so it must be treated as known. Everything protecting the
 * registrations table is therefore in the row-level security policy, not here.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
