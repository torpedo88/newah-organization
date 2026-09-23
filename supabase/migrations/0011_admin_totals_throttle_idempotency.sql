-- Three gaps an adversarial review found outside the write boundary.

-- ---------------------------------------------------------------------------
-- 1. The board's totals were computed in JavaScript over one unpaginated
--    request, so once registrations exceed PostgREST's response cap the
--    counts and the money would quietly exclude the rest — understating what
--    the fund received, with nothing on the page to say so.
--
--    SECURITY DEFINER so it can read a table with no SELECT policy, and
--    granted ONLY to service_role: the board reads through that role already,
--    and anon must not reach it.
create or replace function public.registration_totals()
returns table (
  registrations   bigint,
  guests          bigint,
  bringing_food   bigint,
  paid_cents      bigint,
  pending_cents   bigint,
  needs_followup  bigint
)
language sql
security definer
set search_path = public
as $$
  select
    count(*),
    coalesce(sum(number_of_guests), 0),
    count(*) filter (where brought_food is true),
    -- What the organization actually receives, which is less than the
    -- donation wherever the donor declined to cover the processing fee.
    coalesce(sum(coalesce(net_cents, donation_cents)) filter (where payment_status = 'paid'), 0),
    coalesce(sum(donation_cents) filter (where payment_status = 'pending'), 0),
    -- A donation whose checkout never started: told "recorded but not paid",
    -- and nothing will ever mark it otherwise.
    count(*) filter (
      where payment_status = 'pending'
        and stripe_session_id is null
        and coalesce(donation_cents, 0) > 0
    )
  from registrations;
$$;

revoke all on function public.registration_totals() from public, anon, authenticated;
grant execute on function public.registration_totals() to service_role;

-- ---------------------------------------------------------------------------
-- 2. /admin had no throttle. A thousand guesses were processed without delay,
--    against a single shared password that is the only thing between the
--    public and every registrant's contact details.
create table if not exists admin_login_attempts (
  ip            text primary key,
  failures      integer     not null default 0,
  first_failure timestamptz not null default now(),
  locked_until  timestamptz
);

alter table admin_login_attempts enable row level security;
-- No policy at all: only the service role, which bypasses RLS, may touch this.
revoke all on table admin_login_attempts from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. A resubmitted form created a second registration. The browser now sends a
--    submission id, unique per filled-in form, and the registration code is
--    derived from it — so a retry lands on the same code instead of a second
--    attendee.
alter table registrations add column if not exists submission_id uuid;
create unique index if not exists registrations_submission_unique
  on registrations (submission_id) where submission_id is not null;

-- 0009 replaced anon's table-level INSERT with column-level grants, so a new
-- column is not insertable until it is named. Without this every registration
-- carrying a submission_id would be denied.
grant insert (submission_id) on registrations to anon;
