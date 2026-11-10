import "server-only";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, sessionTokenIsValid } from "@/lib/admin/session";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Re-establish the admin session before touching the database.
 *
 * A server action is its own endpoint. Anyone who knows its id can post to it
 * directly, and the cookie check on the page that renders the form does
 * nothing to stop them — that check only decides what gets painted. Every
 * admin action calls this first.
 *
 * The service-role client is handed back from here so that a caller cannot
 * reach the database without having passed the check first.
 */
export async function requireAdmin(): Promise<
  { ok: true; admin: SupabaseClient } | { ok: false; error: string }
> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token || !sessionTokenIsValid(token)) {
    return { ok: false, error: "Your session has expired. Sign in again." };
  }

  const admin = createAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY is not set, so this cannot be changed." };
  }

  return { ok: true, admin };
}
