-- Walk-in registrations taken at the door on event night, paid in cash or
-- by Zelle. Separate from mhapuja_registrations, which is the Stripe flow and
-- whose rows are tied to a checkout session.
--
-- Entered only by a signed-in volunteer through the admin; the server action
-- re-checks the session and writes with the service role. RLS is on with no
-- policies, like the other registration tables: anon and authenticated have
-- no access at all.

create table if not exists public.door_registrations (
  id                bigint generated always as identity primary key,
  registration_code text        not null unique,
  full_name         text        not null,
  phone             text,
  email             text,
  adult_count       int         not null default 1,
  child_count       int         not null default 0,
  adult_price_cents int         not null,
  child_price_cents int         not null,
  charged_cents     int         not null,
  payment_method    text        not null,

  checked_in_at     timestamptz,
  adults_present    int,
  children_present  int,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint door_name_len check (length(btrim(full_name)) between 2 and 100),
  constraint door_counts check (
    adult_count between 0 and 20 and child_count between 0 and 20
    and adult_count + child_count >= 1
  ),
  constraint door_charge_matches check (
    charged_cents = adult_count * adult_price_cents + child_count * child_price_cents
  ),
  constraint door_payment_method check (payment_method in ('cash', 'zelle'))
);

create index if not exists door_registrations_created_at_idx
  on public.door_registrations (created_at desc);

alter table public.door_registrations enable row level security;
revoke all on table public.door_registrations from anon, authenticated;

notify pgrst, 'reload schema';
