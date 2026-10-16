-- Events, as managed from /admin/events (PR #73).
--
-- #73 shipped the admin pages and server actions but no migration, so every
-- visit to /admin/events failed with "Could not find the table
-- 'public.events' in the schema cache". The columns below are the ones those
-- actions read and write (app/admin/events/actions.ts, event-form.tsx).
--
-- Access mirrors the registration tables: RLS on, no policies. Only the
-- service role, which the admin actions use after re-checking the admin
-- session, can read or write. No public page reads this table yet, so
-- "published" changes nothing a visitor sees until one does.

create table if not exists public.events (
  id           bigint generated always as identity primary key,
  title        varchar(200) not null,
  slug         varchar(120) not null unique,
  description  text,
  event_date   timestamptz  not null,
  location     varchar(300),
  capacity     int,
  image_url    text,
  published    boolean      not null default false,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now(),

  constraint events_title_len check (length(btrim(title)) between 1 and 200),
  constraint events_slug_len  check (length(btrim(slug)) between 1 and 120),
  constraint events_capacity_nonneg check (capacity is null or capacity >= 0)
);

create index if not exists events_event_date_idx on public.events (event_date);

alter table public.events enable row level security;
revoke all on table public.events from anon, authenticated;

-- PostgREST caches the schema; without this the API keeps reporting the
-- table missing until its next reload.
notify pgrst, 'reload schema';
