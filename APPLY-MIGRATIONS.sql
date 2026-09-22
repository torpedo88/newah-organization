-- ============================================================
-- newah-organization: migrations 0003 - 0006, consolidated.
-- Safe to run more than once. Run it all in one go.
-- ============================================================

begin;

-- ---- 0003: close anonymous read access to registrations ----
-- The anon key ships in the browser bundle and is in this public repo's
-- history, so a SELECT policy here is equivalent to publishing the attendee
-- list. RLS on with no SELECT policy is the correct default.
drop policy if exists "Allow read registrations"  on registrations;
drop policy if exists "Allow insert registrations" on registrations;
drop policy if exists "anon_insert_registrations"  on registrations;

alter table registrations enable row level security;

create policy "anon_insert_registrations"
  on registrations for insert to anon with check (true);

-- ---- 0004: proof of consent ----
-- Wording is stored verbatim, not referenced, so editing the policy later
-- cannot rewrite what someone actually agreed to.
alter table registrations
  add column if not exists consent_given   boolean not null default false,
  add column if not exists consent_text    text,
  add column if not exists consent_version text,
  add column if not exists consent_at      timestamptz;

-- ---- 0005: one flow, money in cents ----
alter table registrations
  add column if not exists brought_food      boolean not null default false,
  add column if not exists food_description  text,
  add column if not exists donation_cents    integer,
  add column if not exists charged_cents     integer,
  add column if not exists payment_status    text not null default 'none',
  add column if not exists stripe_session_id text;

-- the old either/or columns must stop being mandatory
alter table registrations alter column registration_type drop not null;
alter table registrations alter column food_option       drop not null;

-- payment_status is advanced only by the Stripe webhook, never the browser
alter table registrations drop constraint if exists registrations_payment_status_check;
alter table registrations
  add constraint registrations_payment_status_check
  check (payment_status in ('none','pending','paid','failed'));

create index if not exists registrations_stripe_session_idx
  on registrations (stripe_session_id) where stripe_session_id is not null;

-- ---- 0006: named adult guests, and who pays the fee ----
-- Adults only. No minors' data is collected anywhere on this site.
alter table registrations
  add column if not exists adult_guests jsonb   not null default '[]'::jsonb,
  add column if not exists covers_fee   boolean not null default false,
  add column if not exists net_cents    integer;

commit;

-- ---- verification: paste the output back ----
select 'policy'::text as kind, policyname::text as name, cmd::text as detail
from pg_policies where tablename = 'registrations'
union all
select 'rls_enabled'::text, relrowsecurity::text, ''::text
from pg_class where relname = 'registrations'
union all
select 'column'::text, column_name::text, is_nullable::text
from information_schema.columns
where table_name = 'registrations'
  and column_name in ('consent_given','consent_text','consent_version','consent_at',
                      'brought_food','food_description','donation_cents','charged_cents',
                      'payment_status','stripe_session_id','adult_guests','covers_fee','net_cents')
order by 1, 2;
