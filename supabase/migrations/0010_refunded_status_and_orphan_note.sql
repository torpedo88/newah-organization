-- A refunded donation was indistinguishable from a paid one.
--
-- The webhook ignored every non-checkout event, so `charge.refunded` left the
-- row at 'paid' forever: the money went back to the donor and the board's
-- totals still counted it. 'refunded' is a state the webhook can now reach,
-- and only the service role may write it — the anon INSERT policy still
-- permits nothing but 'none' and 'pending'.
alter table registrations drop constraint if exists registrations_payment_status_check;
alter table registrations add constraint registrations_payment_status_check
  check (payment_status in ('none', 'pending', 'paid', 'failed', 'refunded'));
