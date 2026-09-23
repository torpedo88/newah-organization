-- Give attending adults their own table, and one atomic way in.
--
-- adult_guests was a JSONB blob on the registration. That made the board's
-- view awkward, made the guests unqueryable, and — as an adversarial review
-- found — let an anonymous caller store a JSON *string* where an array was
-- expected, which crashed /admin on render.
--
-- Splitting it out creates a problem worth naming: a registration and its
-- guests must be written together. Two PostgREST calls are two transactions,
-- so a failure between them leaves a registration whose guests are missing
-- with nothing to indicate it. The insert therefore moves into a function.

create table if not exists registration_guests (
  id              bigint generated always as identity primary key,
  registration_id bigint      not null references registrations(id) on delete cascade,
  name            varchar(100) not null,
  email           varchar(254) not null,
  phone           varchar(20)  not null,
  created_at      timestamptz  not null default now(),

  constraint registration_guests_name_len  check (length(btrim(name)) between 2 and 100),
  constraint registration_guests_email_len check (length(btrim(email)) between 3 and 254),
  constraint registration_guests_phone_fmt check (phone ~ '^[0-9]{10}$')
);

create index if not exists registration_guests_registration_idx
  on registration_guests (registration_id);

alter table registration_guests enable row level security;
-- No policy at all: like registrations, only the service role reads this, and
-- nothing writes it except the function below, which runs as its owner.
revoke all on table registration_guests from public, anon, authenticated;

-- Carry across what is already stored, so no guest is lost.
insert into registration_guests (registration_id, name, email, phone, created_at)
select r.id,
       left(btrim(g->>'name'), 100),
       left(btrim(g->>'email'), 254),
       regexp_replace(coalesce(g->>'phone', ''), '\D', '', 'g'),
       r.created_at
from registrations r
cross join lateral jsonb_array_elements(coalesce(r.adult_guests, '[]'::jsonb)) as g
where jsonb_typeof(r.adult_guests) = 'array'
  and length(btrim(coalesce(g->>'name', ''))) between 2 and 100
  and length(btrim(coalesce(g->>'email', ''))) between 3 and 254
  and regexp_replace(coalesce(g->>'phone', ''), '\D', '', 'g') ~ '^[0-9]{10}$'
  and not exists (
    select 1 from registration_guests rg where rg.registration_id = r.id
  );

-- ---------------------------------------------------------------------------
-- One entry point.
--
-- SECURITY DEFINER, so every rule that used to live in the INSERT policy has
-- to live here instead — the function runs as its owner and RLS does not
-- apply to it. That is the trade: one place to validate, and no way to reach
-- the table around it.
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

  -- Consent is the whole point of the checkbox. Blank text satisfies NOT NULL
  -- and records nothing, so it is length-checked rather than null-checked.
  if coalesce(payload->>'consent_given', 'false') <> 'true'
     or length(btrim(coalesce(payload->>'consent_text', ''))) < 50
     or length(btrim(coalesce(payload->>'consent_version', ''))) not between 1 and 40 then
    raise exception 'consent is required' using errcode = 'check_violation';
  end if;

  if length(btrim(coalesce(payload->>'full_name', ''))) not between 2 and 100
     or length(btrim(coalesce(payload->>'email', ''))) not between 3 and 254
     or coalesce(payload->>'phone', '') !~ '^[0-9]{10}$' then
    raise exception 'invalid registrant details' using errcode = 'check_violation';
  end if;

  -- Only the Stripe webhook may say money moved.
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
    consent_given, consent_text, consent_version, consent_at, created_at,
    adult_guests
  ) values (
    code,
    nullif(payload->>'submission_id', '')::uuid,
    coalesce(payload->>'registration_type', 'event'),
    btrim(payload->>'full_name'),
    payload->>'phone',
    btrim(payload->>'email'),
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
    now(), now(),
    -- Kept in step for now so nothing that still reads the column breaks.
    '[]'::jsonb
  )
  returning id into new_id;

  for guest in select * from jsonb_array_elements(guests) loop
    insert into registration_guests (registration_id, name, email, phone)
    values (
      new_id,
      btrim(guest->>'name'),
      btrim(guest->>'email'),
      regexp_replace(coalesce(guest->>'phone', ''), '\D', '', 'g')
    );
  end loop;

  return code;
end;
$$;

revoke all on function public.create_registration(jsonb) from public;
grant execute on function public.create_registration(jsonb) to anon;

-- With one validated entry point, the table itself no longer needs to be
-- writable by the public role at all.
drop policy if exists "anon_insert_registrations" on registrations;
revoke insert on registrations from anon;
