-- Applied 2026-09-22 via the Supabase MCP. Recorded here so the repo's
-- migration history matches the database.
--
-- Three real defects were found live in the database:
--
-- 1. "Allow read registrations" USING (true) was STILL PRESENT. Migration 0003
--    was written but never applied, so anyone holding the anon key — which
--    ships in the browser bundle and is in this repo's public git history —
--    could read every registrant's name, phone and email.
--
-- 2. registration_type had a CHECK allowing only 'food' | 'donation', but the
--    application writes 'event'. Every insert violated it and fell back to a
--    reduced row, which is why the registrations taken before this date have
--    null registration_type and consent_given = false: their consent records
--    were discarded.
--
-- 3. net_cents was genuinely missing.

drop policy if exists "Allow read registrations"   on registrations;
drop policy if exists "Allow insert registrations" on registrations;
drop policy if exists "anon_insert_registrations"  on registrations;
alter table registrations enable row level security;
create policy "anon_insert_registrations"
  on registrations for insert to anon with check (true);

alter table registrations drop constraint if exists registrations_registration_type_check;
alter table registrations
  add constraint registrations_registration_type_check
  check (registration_type is null
         or registration_type::text in ('food', 'donation', 'event'));

alter table registrations add column if not exists net_cents integer;

update registrations set adult_guests = '[]'::jsonb where adult_guests is null;
update registrations set covers_fee   = false       where covers_fee   is null;
alter table registrations alter column adult_guests set default '[]'::jsonb;
alter table registrations alter column adult_guests set not null;
alter table registrations alter column covers_fee   set default false;
alter table registrations alter column covers_fee   set not null;

update registrations set payment_status = 'none'
  where payment_status = 'pending' and donation_cents is null;
alter table registrations alter column payment_status set default 'none';

create index if not exists registrations_stripe_session_idx
  on registrations (stripe_session_id) where stripe_session_id is not null;

-- NOTE: there is deliberately NO SELECT and NO UPDATE policy. That is why
-- lib/actions/register.ts must not use INSERT ... RETURNING (`.select()` after
-- `.insert()`) and must not update the row after inserting it — both require
-- policies that would reopen access to registrant contact details.
