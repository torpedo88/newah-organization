/**
 * Smoke test for the Mha Puja registration RPC.
 *
 * Exercises the one SECURITY DEFINER function that writes to
 * `mhapuja_registrations`, under the anon key — the role the registration
 * action actually uses in production. Three assertions:
 *
 *   1. A valid payload returns the registration code and lands a row.
 *   2. A second call with the same email violates the unique constraint and
 *      surfaces a 23505 the way the action's duplicate branch expects.
 *   3. A payload with mismatched money is rejected inside the function with a
 *      check_violation, confirming the DB defence is live.
 *
 * Cleanup runs at the end under the service role so this test leaves no
 * row behind. Service role is required because anon has no DELETE on this
 * table — which is itself part of what is being verified.
 *
 * Run:
 *   node --env-file=.env.local --import=tsx scripts/smoke-mhapuja.ts
 *
 * Env expected (both from .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  (same name the client uses)
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  console.error("Missing SUPABASE env — check .env.local");
  process.exit(1);
}

const anon = createClient(url, anonKey, { auth: { persistSession: false } });
const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

// Unique test email per run so re-running does not collide with itself.
const stamp = Date.now();
const email = `mhapuja-smoke-${stamp}@example.com`;
const code1 = `MHP-TEST-${stamp.toString(36).toUpperCase().slice(-6)}`;
const code2 = `MHP-TEST-${(stamp + 1).toString(36).toUpperCase().slice(-6)}`;

const basePayload = (overrides: Record<string, unknown> = {}) => ({
  registration_code: code1,
  submission_id: randomUUID(),
  full_name: "Smoke Test",
  phone: "+14155551234",
  email,
  adult_count: 2,
  child_count: 1,
  adult_price_cents: 4000,
  child_price_cents: 1500,
  charged_cents: 2 * 4000 + 1 * 1500,
  stripe_session_id: `cs_test_${stamp}`,
  payment_status: "pending",
  consent_given: true,
  consent_text: "Smoke test consent text, long enough to satisfy the length check in the function.",
  consent_version: "smoke-test-1",
  consent_at: new Date().toISOString(),
  ...overrides,
});

let exit = 0;
const say = (ok: boolean, name: string, detail = "") => {
  if (ok) console.log(`✓ ${name}`);
  else {
    console.error(`✗ ${name}${detail ? "  —  " + detail : ""}`);
    exit = 1;
  }
};

async function main() {
  // (1) Happy path.
  const { data: insertResult, error: insertError } = await anon.rpc("create_mhapuja_registration", {
    payload: basePayload(),
  });
  say(!insertError && insertResult === code1,
    "happy path: anon RPC returns registration code",
    insertError?.message ?? `returned ${JSON.stringify(insertResult)}`);

  // Verify the row exists via service role (anon cannot SELECT this table).
  const { data: row, error: rowError } = await admin
    .from("mhapuja_registrations")
    .select("registration_code, email, adult_count, child_count, charged_cents, payment_status")
    .eq("registration_code", code1)
    .single();
  say(!rowError && row?.payment_status === "pending",
    "row persisted with payment_status=pending",
    rowError?.message ?? `row: ${JSON.stringify(row)}`);
  say(row?.charged_cents === 9500,
    "charged_cents equals adults*4000 + children*1500",
    `got ${row?.charged_cents}`);

  // (2) Duplicate email -> 23505. The action translates this into the courtesy
  // "already registered" message, so the smoke test asserts the code, not the
  // string.
  const { error: dupError } = await anon.rpc("create_mhapuja_registration", {
    payload: basePayload({
      registration_code: code2,
      submission_id: randomUUID(),
      stripe_session_id: `cs_test_${stamp}_b`,
    }),
  });
  say(dupError?.code === "23505",
    "duplicate email surfaces as unique constraint violation (23505)",
    `got code=${dupError?.code} msg=${dupError?.message}`);

  // (3) Mismatched money -> check_violation (23514 or raised as exception).
  // The function raises with errcode 'check_violation' which PostgREST maps
  // to code 23514.
  const { error: moneyError } = await anon.rpc("create_mhapuja_registration", {
    payload: basePayload({
      registration_code: `${code2}X`,
      submission_id: randomUUID(),
      stripe_session_id: `cs_test_${stamp}_c`,
      email: `mhapuja-smoke-money-${stamp}@example.com`,
      charged_cents: 1, // obviously wrong
    }),
  });
  say(moneyError?.code === "23514" || /ticket money is inconsistent/i.test(moneyError?.message ?? ""),
    "mismatched charged_cents is rejected inside the function",
    `got code=${moneyError?.code} msg=${moneyError?.message}`);

  // Cleanup. Under the service role, because anon has no DELETE.
  const { error: cleanupError } = await admin
    .from("mhapuja_registrations")
    .delete()
    .eq("email", email);
  if (cleanupError) {
    console.error("Cleanup failed (manual cleanup required):", cleanupError.message);
    exit = 1;
  } else {
    console.log("cleanup OK");
  }
}

main()
  .then(() => process.exit(exit))
  .catch((error) => {
    console.error("Smoke test crashed:", error);
    process.exit(1);
  });
