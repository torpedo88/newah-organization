create table public.donations (
  id bigint primary key generated always as identity,
  donor_name text not null,
  donor_email text not null,
  donor_phone text,
  amount_cents int not null,
  payment_method text not null check (payment_method in ('card', 'cash', 'zelle')),
  donation_type text not null default 'general',
  anonymous boolean default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.donations enable row level security;

create policy "Service role full access" on public.donations
  for all
  to service_role
  using (true)
  with check (true);

create policy "Anon can insert donations" on public.donations
  for insert
  to anon
  with check (payment_method = 'card');

create index idx_donations_created on public.donations (created_at desc);
create index idx_donations_status on public.donations (status);
create index idx_donations_payment_method on public.donations (payment_method);
