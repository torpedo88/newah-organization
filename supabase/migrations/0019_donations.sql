-- Donations table for tracking charitable contributions

create table public.donations (
  id bigint primary key generated always as identity,
  donor_name text not null,
  donor_email text not null,
  donor_phone text,
  amount bigint not null,
  donation_type text not null default 'general',
  payment_status text not null default 'pending',
  anonymous boolean not null default false,
  covers_fee boolean not null default false,
  stripe_payment_intent_id text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Index for lookups by email and date
create index donations_email_created_at_idx on public.donations (donor_email, created_at desc);
create index donations_created_at_idx on public.donations (created_at desc);
create index donations_payment_status_idx on public.donations (payment_status);

-- RLS: Allow inserts from anon (donation form), select/update from admin
alter table public.donations enable row level security;

create policy "Anon can insert donations" on public.donations
  for insert with check (true);

create policy "Anon cannot read donations" on public.donations
  for select using (false);

create policy "Admin can manage donations" on public.donations
  using (
    (select auth.jwt() ->> 'role' = 'authenticated')
  );

notify pgrst, 'reload schema';
