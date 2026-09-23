-- Close the gaps an adversarial review found in the anonymous write boundary.
--
-- 0008 validated the scalar money and consent columns but left the JSONB shape,
-- the Stripe session id, the primary key and payload size unguarded. Each of
-- the following was reproduced against the live endpoint with the publishable
-- key and returned 201.

-- ---------------------------------------------------------------------------
-- 1. adult_guests had no shape. `"adult_guests": "pwned"` was accepted, and
--    /admin renders it with (row.adult_guests ?? []).map(...). `?? []` does
--    not replace a non-null string, so .map threw and the board's ONLY view of
--    registrations failed to render — and because reads are service-role only,
--    the board could not see the poison row to remove it.
alter table registrations drop constraint if exists registrations_adult_guests_shape;
alter table registrations add constraint registrations_adult_guests_shape
  check (adult_guests is null or jsonb_typeof(adult_guests) = 'array');

alter table registrations drop constraint if exists registrations_adult_guests_bounds;
alter table registrations add constraint registrations_adult_guests_bounds
  check (
    adult_guests is null
    or (jsonb_array_length(adult_guests) <= 20 and pg_column_size(adult_guests) <= 8192)
  );

-- ---------------------------------------------------------------------------
-- 2. stripe_session_id was not unique, and the webhook updates by it with no
--    LIMIT. A donor can read their own session id out of their checkout URL,
--    insert a second pending row carrying the same id and a $10,000 amount,
--    pay their real $1, and the webhook marks BOTH rows paid. One index makes
--    the second insert impossible.
create unique index if not exists registrations_stripe_session_unique
  on registrations (stripe_session_id)
  where stripe_session_id is not null;

-- Only ever a Stripe Checkout Session id.
alter table registrations drop constraint if exists registrations_stripe_session_shape;
alter table registrations add constraint registrations_stripe_session_shape
  check (stripe_session_id is null or stripe_session_id like 'cs\_%');

-- ---------------------------------------------------------------------------
-- 3. Size bounds. A 4 MB adult_guests payload and a 2 MB food_description were
--    both accepted. These are advertised limits, so they belong in the schema.
alter table registrations drop constraint if exists registrations_food_description_len;
alter table registrations add constraint registrations_food_description_len
  check (food_description is null or length(food_description) <= 300);

-- NULL stays legal: three registrations predate the consent columns.
alter table registrations drop constraint if exists registrations_consent_text_len;
alter table registrations add constraint registrations_consent_text_len
  check (consent_text is null or length(consent_text) between 50 and 4000);

-- ---------------------------------------------------------------------------
-- 4. The policy gains the rules a CHECK cannot express for anon alone: consent
--    must be real text rather than "", and the guest list must be an array.
drop policy if exists "anon_insert_registrations" on registrations;

create policy "anon_insert_registrations"
  on registrations for insert to anon
  with check (
    coalesce(payment_status, 'none') in ('none', 'pending')
    and consent_given is true
    -- 0008 required these to be non-null, which "" satisfies. A blank consent
    -- record is not a lesser record of consent, it is the absence of one.
    and length(btrim(consent_text)) >= 50
    and length(btrim(consent_version)) between 1 and 40
    and (donation_cents is null or donation_cents between 100 and 1000000)
    and (charged_cents  is null or charged_cents  between 100 and 1100000)
    and (net_cents      is null or net_cents      between 0   and 1000000)
    and (charged_cents is null or donation_cents is null or charged_cents >= donation_cents)
    and (net_cents is null or charged_cents is null or net_cents <= charged_cents)
    and ((donation_cents is null) = (charged_cents is null))
    and (stripe_session_id is null or coalesce(payment_status, 'none') = 'pending')
    and (registration_type is null or registration_type in ('food', 'donation', 'event'))
    and number_of_guests between 1 and 21
    and jsonb_typeof(adult_guests) = 'array'
    and jsonb_array_length(adult_guests) <= 20
    and length(full_name) between 2 and 100
    and length(email) between 3 and 254
    and (food_description is null or length(food_description) <= 300)
    -- The legacy numeric column is unused by the app and unbounded.
    and donation_amount is null
  );

-- ---------------------------------------------------------------------------
-- 5. The primary key was insertable. `"id": 999999` was accepted, which lets a
--    caller reserve ids ahead of the sequence and make a later real
--    registration fail on a duplicate key. Column-level grants are the only
--    way to express "every column except this one".
revoke insert on registrations from anon;
grant insert (
  registration_code, registration_type, full_name, phone, email, number_of_guests,
  food_option, donation_amount, payment_status, created_at, updated_at,
  consent_given, consent_text, consent_version, consent_at, brought_food,
  food_description, donation_cents, charged_cents, stripe_session_id,
  adult_guests, covers_fee, net_cents
) on registrations to anon;

-- ---------------------------------------------------------------------------
-- 6. An unrelated helper was callable by the public role.
revoke all on function public.rls_auto_enable() from anon, public;
