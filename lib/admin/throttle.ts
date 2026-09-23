import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Failed-login throttle for the board's shared password.
 *
 * One password is the only thing between the public and every registrant's
 * name, phone and email, and the login action processed a thousand guesses
 * without pausing. Constant-time comparison protects the password's contents;
 * it does nothing about the number of attempts.
 *
 * Counted per IP in the database rather than in memory, because serverless
 * instances do not share memory and an attacker gets a fresh one for free.
 */
const MAX_FAILURES = 8;
const LOCKOUT_MINUTES = 15;
const WINDOW_MINUTES = 15;

export type ThrottleState = { allowed: boolean; retryAfterSeconds: number };

export async function checkThrottle(ip: string): Promise<ThrottleState> {
  const supabase = createAdminClient();
  // Fail OPEN when the database is unreachable. A throttle that locks the
  // board out of its own registration desk during an outage is worse than one
  // that briefly stops counting.
  if (!supabase) return { allowed: true, retryAfterSeconds: 0 };

  const { data } = await supabase
    .from("admin_login_attempts")
    .select("failures, locked_until")
    .eq("ip", ip)
    .limit(1);

  const row = data?.[0];
  if (!row?.locked_until) return { allowed: true, retryAfterSeconds: 0 };

  const until = new Date(row.locked_until as string).getTime();
  const remaining = Math.ceil((until - Date.now()) / 1000);
  return remaining > 0
    ? { allowed: false, retryAfterSeconds: remaining }
    : { allowed: true, retryAfterSeconds: 0 };
}

export async function recordFailure(ip: string): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  const { data } = await supabase
    .from("admin_login_attempts")
    .select("failures, first_failure")
    .eq("ip", ip)
    .limit(1);

  const row = data?.[0];
  const windowStart = row ? new Date(row.first_failure as string).getTime() : Date.now();
  const stale = Date.now() - windowStart > WINDOW_MINUTES * 60_000;
  const failures = stale ? 1 : ((row?.failures as number) ?? 0) + 1;

  await supabase.from("admin_login_attempts").upsert(
    {
      ip,
      failures,
      first_failure: stale || !row ? new Date().toISOString() : (row.first_failure as string),
      locked_until:
        failures >= MAX_FAILURES
          ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
          : null,
    },
    { onConflict: "ip" },
  );
}

/** A correct password clears the record, so normal use never accumulates. */
export async function clearFailures(ip: string): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;
  await supabase.from("admin_login_attempts").delete().eq("ip", ip);
}
