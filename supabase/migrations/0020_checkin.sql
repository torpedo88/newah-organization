-- Check-in tracking for event attendees

alter table public.mhapuja_registrations add column if not exists checked_in_at timestamp with time zone;
alter table public.mhapuja_registrations add column if not exists guests_present int;

-- Index for fast lookup during check-in
create index if not exists mhapuja_checkin_lookup_idx on public.mhapuja_registrations (registration_code);

notify pgrst, 'reload schema';
