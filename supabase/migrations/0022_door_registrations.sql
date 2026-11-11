-- Separate table for walk-in door registrations
-- Tracks attendees registered at event door with cash or Zelle payment

create table if not exists door_registrations (
  id bigint primary key generated always as identity,
  registration_code text not null unique,
  full_name text not null,
  phone text,
  email text,
  adult_count int not null default 1,
  child_count int not null default 0,
  payment_method text not null check (payment_method in ('cash', 'zelle')),

  -- Check-in tracking
  checked_in_at timestamp with time zone,
  adults_present int,
  children_present int,

  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Indexes for fast lookup
create index idx_door_registrations_code on door_registrations(registration_code);
create index idx_door_registrations_email on door_registrations(email);
create index idx_door_registrations_payment_method on door_registrations(payment_method);
create index idx_door_registrations_created_at on door_registrations(created_at desc);

-- RLS: Allow anon inserts for door registration
alter table door_registrations enable row level security;

create policy "Allow anon insert door registrations" on door_registrations
  for insert with check (true);

create policy "Allow service role full access" on door_registrations
  for all using (true) with check (true);

-- Function to update updated_at timestamp
create or replace function update_door_registrations_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger door_registrations_updated_at_trigger
  before update on door_registrations
  for each row
  execute function update_door_registrations_updated_at();
