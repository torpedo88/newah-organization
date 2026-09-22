-- Constrain what an anonymous caller may insert.
--
-- The anon key ships in the browser bundle, so "the form validates it" is not
-- a control: anyone holding that key can POST a row straight to PostgREST.
-- Until now the INSERT policy was `with check (true)`, which accepted a row
-- claiming payment_status 'paid', a $10,000,000 donation and asserted consent.
-- The admin totals trust those columns, so the policy — not the form — has to
-- be where the rules live.
--
-- Only the service role (the Stripe webhook) may say money moved.

drop policy if exists "anon_insert_registrations" on registrations;

create policy "anon_insert_registrations"
  on registrations for insert to anon
  with check (
    -- A public caller may only ever create an unpaid row. 'paid' and 'failed'
    -- are the webhook's to write, against a Stripe signature.
    coalesce(payment_status, 'none') in ('none', 'pending')

    -- Consent is the whole point of the checkbox; a row without it is not a
    -- record of anything. The app never sends false, so this only blocks a
    -- caller going around it.
    and consent_given is true
    and consent_version is not null
    and consent_text is not null

    -- Bounds the form advertises ($1–$10,000), enforced where it counts.
    and (donation_cents is null or donation_cents between 100 and 1000000)
    and (charged_cents  is null or charged_cents  between 100 and 1100000)
    and (net_cents      is null or net_cents      between 0   and 1000000)

    -- The three amounts have to describe the same transaction: the card is
    -- charged at least the donation, and the organization never nets more
    -- than was charged.
    and (charged_cents is null or donation_cents is null or charged_cents >= donation_cents)
    and (net_cents is null or charged_cents is null or net_cents <= charged_cents)

    -- A donation and its money must appear together.
    and ((donation_cents is null) = (charged_cents is null))

    -- Nothing may be inserted already carrying a paid Stripe session.
    and (stripe_session_id is null or coalesce(payment_status, 'none') = 'pending')

    and (registration_type is null or registration_type in ('food', 'donation', 'event'))
    and number_of_guests between 1 and 21
  );

-- Omitting registration_type used to record NULL, losing the type silently.
-- A default means an omission yields the right value instead of no value,
-- without failing the insert and losing the registrant.
alter table registrations alter column registration_type set default 'event';

