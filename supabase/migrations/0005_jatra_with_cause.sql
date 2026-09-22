-- ============================================================
-- Registration becomes one flow, not a choice between two.
--
-- Previously a person was EITHER a food registration OR a donation. For
-- "Jatra with a Cause" everyone registers to attend; bringing food and giving
-- money are two independent, optional things either of which may be true.
--
-- Money is stored in CENTS. The donation is what the fund receives; the charge
-- is what the donor paid, which is larger because the donor also covers the
-- card processing fee so that 100% of the donation reaches the fund.
-- ============================================================

ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS brought_food      boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS food_description  text,
  ADD COLUMN IF NOT EXISTS donation_cents    integer,
  ADD COLUMN IF NOT EXISTS charged_cents     integer,
  ADD COLUMN IF NOT EXISTS payment_status    text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- The old either/or columns must stop being mandatory; a person who brings
-- food and gives nothing has no donation, and vice versa.
ALTER TABLE registrations ALTER COLUMN registration_type DROP NOT NULL;
ALTER TABLE registrations ALTER COLUMN food_option       DROP NOT NULL;

-- payment_status is only ever advanced by the Stripe webhook, never by the
-- browser, so a donor cannot mark their own donation paid.
--   none    no donation was offered
--   pending checkout session created, not yet confirmed by Stripe
--   paid    Stripe confirmed the payment
--   failed  Stripe reported the session expired or failed
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_payment_status_check;
ALTER TABLE registrations
  ADD CONSTRAINT registrations_payment_status_check
  CHECK (payment_status IN ('none', 'pending', 'paid', 'failed'));

CREATE INDEX IF NOT EXISTS registrations_stripe_session_idx
  ON registrations (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

COMMENT ON COLUMN registrations.brought_food      IS 'True where the registrant said they are bringing food.';
COMMENT ON COLUMN registrations.food_description  IS 'Free text: what they are bringing.';
COMMENT ON COLUMN registrations.donation_cents    IS 'What the fund receives, in cents. Null when no donation.';
COMMENT ON COLUMN registrations.charged_cents     IS 'What the donor was charged, in cents: donation plus the processing fee they agreed to cover.';
COMMENT ON COLUMN registrations.payment_status    IS 'Advanced only by the Stripe webhook.';

-- ── Verify after applying ───────────────────────────────────
--   select column_name, data_type, is_nullable
--   from information_schema.columns where table_name = 'registrations'
--   order by ordinal_position;
