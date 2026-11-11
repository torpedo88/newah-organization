-- Donations table for tracking charitable contributions.
-- Was 0019_donations.sql, which shared its number with 0019_mhapuja_date_november.sql.
-- Not yet applied to production.

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

-- RLS on, no policies, like the registration tables: only the service role,
-- used by server code after its own checks, can read or write. The earlier
-- draft let anon insert any row and gave every authenticated user full access.
alter table public.donations enable row level security;
revoke all on table public.donations from anon, authenticated;

notify pgrst, 'reload schema';
