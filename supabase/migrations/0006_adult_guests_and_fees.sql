-- ============================================================
-- Named adult guests, and who pays the card processing fee.
--
-- Name tags are made ahead of the event, so the organization needs the name
-- and email of every ATTENDING ADULT, not just a head count.
--
-- No details are collected for anyone under 18. That is a deliberate choice,
-- not an oversight: collecting children's personal information pulls the site
-- into a body of law (COPPA and equivalents) that a volunteer-run community
-- site should not have to carry. The form says so explicitly.
--
-- covers_fee records whether the donor agreed to pay the card processing fee
-- on top. When they did, the organization receives the whole donation. When
-- they declined, the processor's cut comes out of the donation instead, so
-- net_cents is smaller than donation_cents.
-- ============================================================

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS adult_guests jsonb   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS covers_fee   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS net_cents    integer;

COMMENT ON COLUMN registrations.adult_guests IS
  'Additional attending adults as [{"name":"...","email":"..."}]. Adults only; no minors'' data is collected.';
COMMENT ON COLUMN registrations.covers_fee IS
  'True where the donor chose to pay the card processing fee on top of their donation.';
COMMENT ON COLUMN registrations.net_cents IS
  'What the organization receives, in cents, after the processor''s cut where the donor did not cover it.';

-- ── Verify after applying ───────────────────────────────────
--   select column_name, data_type from information_schema.columns
--   where table_name = 'registrations'
--     and column_name in ('adult_guests','covers_fee','net_cents');
