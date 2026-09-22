-- ============================================================
-- Proof of consent for registrations.
--
-- The site now asks every registrant to agree to the Terms and the Privacy
-- Policy, and to being contacted about support requests, membership drives and
-- future events. If that consent is ever questioned, the organization needs to
-- show what the person actually agreed to and when.
--
-- The wording is stored VERBATIM on each row rather than referenced by id, so
-- editing the policy text later cannot retroactively change what a given
-- person saw. consent_version records which revision it was.
-- ============================================================

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS consent_given   boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_text    text,
  ADD COLUMN IF NOT EXISTS consent_version text,
  ADD COLUMN IF NOT EXISTS consent_at      timestamptz;

COMMENT ON COLUMN registrations.consent_given   IS 'True only where the registrant ticked the consent box. Never default to true.';
COMMENT ON COLUMN registrations.consent_text    IS 'The exact wording shown at the time of consent.';
COMMENT ON COLUMN registrations.consent_version IS 'Revision identifier of the consent wording (see lib/legal/org.ts).';
COMMENT ON COLUMN registrations.consent_at      IS 'When consent was given.';

-- Rows that predate this migration had no consent step. They stay false, which
-- is the truthful value: those people were never asked.

-- ── Verify after applying ───────────────────────────────────
--   select column_name, data_type, is_nullable, column_default
--   from information_schema.columns
--   where table_name = 'registrations' and column_name like 'consent%';
