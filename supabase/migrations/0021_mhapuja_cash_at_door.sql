-- Cash taken at the door on event night.
--
-- A registrant whose card checkout never completed can pay a volunteer in
-- cash at check-in. The row becomes 'paid' and this records when, so the admin
-- can keep cash apart from money Stripe actually received. Stripe's webhook
-- never moves a row off 'paid' except to 'refunded', so a later
-- checkout.session.expired cannot undo it.

alter table public.mhapuja_registrations
  add column if not exists paid_cash_at timestamptz;

notify pgrst, 'reload schema';
