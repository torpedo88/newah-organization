-- ============================================================
-- SECURITY FIX — close anonymous read access to registrations
--
-- Incident: the policy below permitted unrestricted SELECT for
-- every role, including `anon`. Because the anon key ships in the
-- browser bundle and was additionally committed to a public
-- repository, every registration row was readable by anyone on
-- the internet: full_name, phone, email, number_of_guests,
-- donation_amount. Confirmed live against the project.
--
--   CREATE POLICY "Allow read registrations" ON registrations
--     FOR SELECT USING (true);
--
-- Run this FIRST, before anything else. Registration keeps working:
-- the INSERT policy is untouched, and the form never reads back.
-- ============================================================

DROP POLICY IF EXISTS "Allow read registrations" ON registrations;

-- Confirm RLS is on. Enabled with no SELECT policy means no role
-- can read the table — which is the correct default here.
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Keep anonymous INSERT so the public form still submits.
-- Recreated idempotently so this file is safe to re-run.
DROP POLICY IF EXISTS "Allow insert registrations" ON registrations;
-- Dropped too: without this, replaying the file fails with 42710 once the
-- policy exists, despite the note above claiming it is safe to rerun.
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Deliberately NOT created:
--   * any SELECT policy — a SELECT policy on this table is
--     equivalent to publishing the attendee list, because the
--     anon key is public by design
--   * any UPDATE or DELETE policy — nobody edits registrations
--     from the public site; deny-by-default is correct
--   * any `authenticated` policy — the board role model does not
--     exist yet. Board read access arrives with the admin surface,
--     scoped to an admin role, not granted to every logged-in user.
--
-- Until then the board reads registrations through the Supabase
-- dashboard, which authenticates as the project owner and is not
-- subject to these policies.

-- ── Verify after applying ───────────────────────────────────
-- Expect exactly one policy, INSERT only:
--   select policyname, cmd, roles from pg_policies
--   where tablename = 'registrations';
--
-- Expect rowsecurity = true:
--   select relrowsecurity from pg_class where relname = 'registrations';
--
-- Then probe with the ANON key (not the service role, which
-- bypasses RLS and would make this pass meaninglessly):
--   curl "$URL/rest/v1/registrations?select=count" \
--     -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
-- Expect an empty result or a permission error — NOT a count.
--
-- ── Revert (only if registration submissions break) ─────────
--   DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
--   CREATE POLICY "Allow insert registrations" ON registrations
--     FOR INSERT WITH CHECK (true);
-- Do NOT revert by recreating a SELECT policy.
