-- Mha Puja ticketed registration.
--
-- Indra Jatra registrations hold an optional donation. Mha Puja is different:
-- a community dinner where each attendee buys a ticket, adult or child, and
-- the registration cannot complete without that payment. Mixing the two into
-- one table would mean conditional columns, a conditional CHECK on the money,
-- and two different definitions of "complete" sharing one row. Splitting it
-- keeps each table's rules truthful about the thing it actually stores.
--
-- The shape mirrors `registrations` where it can: SECURITY DEFINER function
-- is the single entry point, the anon role has no direct access, and consent
-- is stored verbatim so the record cannot drift from the wording actually
-- shown. The money rules are the ones that differ — a Mha Puja row MUST have
-- a positive charge, and the counts and the charge have to agree.

create table if not exists mhapuja_registrations (
  id                 bigint generated always as identity primary key,
  registration_code  varchar(32)  not null unique,
  submission_id      uuid         unique,
  full_name          varchar(100) not null,
  phone              varchar(20)  not null,
  email              varchar(254) not null,

  -- Head counts for this registration. Adults 10+, children under 10.
  -- Both are stored, including zeros, so the receipt and the printed name
  -- list can be rebuilt from the row without having to look at the Stripe
  -- line items.
  adult_count        int          not null,
  child_count        int          not null,

  -- The price schedule applied to this registration, in cents. Recorded
  -- rather than derived so a future price change does not retroactively
  -- rewrite what someone paid.
  adult_price_cents  int          not null,
  child_price_cents  int          not null,
  charged_cents      int          not null,

  stripe_session_id  text         unique,
  payment_status     varchar(20)  not null default 'pending',

  consent_given      boolean      not null,
  consent_text       text         not null,
  consent_version    varchar(40)  not null,
  consent_at         timestamptz  not null,

  created_at         timestamptz  not null default now(),

  constraint mhapuja_name_len   check (length(btrim(full_name)) between 2 and 100),
  constraint mhapuja_email_len  check (length(btrim(email)) between 3 and 254),
  constraint mhapuja_phone_fmt  check (phone ~ '^\+1[0-9]{10}$'),
  constraint mhapuja_adult_count_range check (adult_count between 0 and 20),
  constraint mhapuja_child_count_range check (child_count between 0 and 20),
  -- Zero of both is a registration for nobody. The form stops this and the
  -- database stops it too, because the price would be zero and the ticket
  -- would be free, which is not what this flow is for.
  constraint mhapuja_at_least_one check (adult_count + child_count >= 1),
  constraint mhapuja_prices_positive check (adult_price_cents > 0 and child_price_cents > 0),
  constraint mhapuja_charge_positive check (charged_cents > 0),
  -- The charged amount has to match the counts times the recorded prices.
  -- A row that disagrees with itself is the thing the webhook has to decide
  -- about, so take the decision out of the webhook's hands here.
  constraint mhapuja_charge_matches
    check (charged_cents = adult_count * adult_price_cents + child_count * child_price_cents),
  constraint mhapuja_payment_status_allowed
    check (payment_status in ('pending', 'paid', 'failed', 'refunded'))
);

-- One address, one registration. The server-side precheck is a courtesy
-- error message; this is the real guard, and the 23505 branch of the action
-- translates its violation back into the courtesy message.
alter table mhapuja_registrations
  add constraint mhapuja_registrations_email_unique unique (email);

create index if not exists mhapuja_registrations_email_idx
  on mhapuja_registrations (lower(btrim(email)));
create index if not exists mhapuja_registrations_created_idx
  on mhapuja_registrations (created_at desc);
create index if not exists mhapuja_registrations_payment_status_idx
  on mhapuja_registrations (payment_status);

alter table mhapuja_registrations enable row level security;
-- No policy at all: only the service role reads this, and nothing writes it
-- except the function below, which runs as its owner.
revoke all on table mhapuja_registrations from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- One entry point.
--
-- SECURITY DEFINER, so every rule the INSERT policy would have carried has
-- to live here instead. anon has no INSERT on the table — this function is
-- the only way in.
create or replace function public.create_mhapuja_registration(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  code              text := payload->>'registration_code';
  adult_c           int  := nullif(payload->>'adult_count', '')::int;
  child_c           int  := nullif(payload->>'child_count', '')::int;
  adult_price       int  := nullif(payload->>'adult_price_cents', '')::int;
  child_price       int  := nullif(payload->>'child_price_cents', '')::int;
  charged           int  := nullif(payload->>'charged_cents', '')::int;
begin
  -- Consent is the whole point of the checkbox. Blank text satisfies NOT NULL
  -- and records nothing, so it is length-checked rather than null-checked.
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

  if adult_c is null or child_c is null
     or adult_c not between 0 and 20
     or child_c not between 0 and 20
     or (adult_c + child_c) < 1 then
    raise exception 'invalid ticket counts' using errcode = 'check_violation';
  end if;

  if adult_price is null or child_price is null or charged is null
     or adult_price <= 0 or child_price <= 0 or charged <= 0
     or charged <> adult_c * adult_price + child_c * child_price then
    -- A row whose charge does not equal its counts times its prices would make
    -- the webhook's amount-mismatch check meaningless. Reject here.
    raise exception 'ticket money is inconsistent' using errcode = 'check_violation';
  end if;

  -- Only the Stripe webhook may say money moved.
  if coalesce(payload->>'payment_status', 'pending') <> 'pending' then
    raise exception 'payment status not permitted here' using errcode = 'check_violation';
  end if;

  insert into mhapuja_registrations (
    registration_code, submission_id, full_name, phone, email,
    adult_count, child_count,
    adult_price_cents, child_price_cents, charged_cents,
    stripe_session_id, payment_status,
    consent_given, consent_text, consent_version, consent_at, created_at
  ) values (
    code,
    nullif(payload->>'submission_id', '')::uuid,
    btrim(payload->>'full_name'),
    payload->>'phone',
    lower(btrim(payload->>'email')),
    adult_c,
    child_c,
    adult_price,
    child_price,
    charged,
    nullif(payload->>'stripe_session_id', ''),
    'pending',
    true,
    payload->>'consent_text',
    payload->>'consent_version',
    coalesce(nullif(payload->>'consent_at', '')::timestamptz, now()),
    now()
  );

  return code;
end;
$$;

revoke all on function public.create_mhapuja_registration(jsonb) from public;
grant execute on function public.create_mhapuja_registration(jsonb) to anon, authenticated, service_role;
