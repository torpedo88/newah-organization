-- Prevent duplicate email registrations and normalize phone to E.164, email to lowercase.
--
-- 1. Add unique constraint on email to prevent duplicates at the database level.
-- 2. Update phone format validation to accept E.164 format (+1XXXXXXXXXX).
-- 3. Normalize email to lowercase in the create_registration function.
-- 4. Update create_registration to handle E.164 phone numbers from the app.

-- Add unique constraints to prevent duplicates
alter table registrations add constraint registrations_email_unique unique (email);
alter table registrations add constraint registrations_phone_unique unique (phone);

-- Update phone validation constraint for registration_guests to accept E.164 format
alter table registration_guests drop constraint if exists registration_guests_phone_fmt;
alter table registration_guests
  add constraint registration_guests_phone_fmt check (phone ~ '^\+1[0-9]{10}$');

-- Recreate the create_registration function to handle normalization
create or replace function public.create_registration(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id     bigint;
  guest      jsonb;
  guests     jsonb := coalesce(payload->'guests', '[]'::jsonb);
  guest_count int;
  code       text := payload->>'registration_code';
  donation   int  := nullif(payload->>'donation_cents', '')::int;
  charged    int  := nullif(payload->>'charged_cents', '')::int;
  net        int  := nullif(payload->>'net_cents', '')::int;
begin
  if jsonb_typeof(guests) <> 'array' then
    raise exception 'guests must be an array' using errcode = 'check_violation';
  end if;
  guest_count := jsonb_array_length(guests);
  if guest_count > 20 then
    raise exception 'too many guests' using errcode = 'check_violation';
  end if;

  if coalesce(payload->>'consent_given', 'false') <> 'true'
     or length(btrim(coalesce(payload->>'consent_text', ''))) < 50
     or length(btrim(coalesce(payload->>'consent_version', ''))) not between 1 and 40 then
    raise exception 'consent is required' using errcode = 'check_violation';
  end if;

  if length(btrim(coalesce(payload->>'full_name', ''))) not between 2 and 100
     or length(btrim(coalesce(payload->>'email', ''))) not between 3 and 254
     or coalesce(payload->>'phone', '') !~ '^\+1[0-9]{10}$' then
    raise exception 'invalid registrant details' using errcode = 'check_violation';
  end if;

  if coalesce(payload->>'payment_status', 'none') not in ('none', 'pending') then
    raise exception 'payment status not permitted here' using errcode = 'check_violation';
  end if;

  if (donation is null) <> (charged is null) then
    raise exception 'donation and charge must appear together' using errcode = 'check_violation';
  end if;
  if donation is not null then
    if donation not between 100 and 1000000
       or charged not between 100 and 1100000
       or charged < donation
       or net is null or net < 0 or net > charged then
      raise exception 'donation amounts are inconsistent' using errcode = 'check_violation';
    end if;
  end if;

  insert into registrations (
    registration_code, submission_id, registration_type, full_name, phone, email,
    number_of_guests, brought_food, food_description,
    donation_cents, charged_cents, net_cents, covers_fee,
    stripe_session_id, payment_status,
    consent_given, consent_text, consent_version, consent_at, created_at
  ) values (
    code,
    nullif(payload->>'submission_id', '')::uuid,
    coalesce(payload->>'registration_type', 'event'),
    btrim(payload->>'full_name'),
    payload->>'phone',
    lower(btrim(payload->>'email')),
    1 + guest_count,
    coalesce((payload->>'brought_food')::boolean, false),
    nullif(left(coalesce(payload->>'food_description', ''), 300), ''),
    donation, charged, net,
    coalesce((payload->>'covers_fee')::boolean, false),
    nullif(payload->>'stripe_session_id', ''),
    coalesce(payload->>'payment_status', 'none'),
    true,
    payload->>'consent_text',
    payload->>'consent_version',
    now(), now()
  )
  returning id into new_id;

  for guest in select * from jsonb_array_elements(guests) loop
    insert into registration_guests (registration_id, name, email, phone)
    values (
      new_id,
      btrim(guest->>'name'),
      lower(btrim(guest->>'email')),
      coalesce(guest->>'phone', '')
    );
  end loop;

  return code;
end;
$$;
