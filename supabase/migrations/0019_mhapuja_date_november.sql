-- Mha Puja moves to Tuesday 10 November 2026, the Nepal Sambat 1147
-- rollover, confirmed with the owner (PR #79).
--
-- 0018 had already seeded the row with 22 October and was applied, so editing
-- that file changed nothing in the database; this updates the row instead.
-- 10 November is after the DST change, so 3:00 PM Pacific is UTC-8, written
-- with the zone name rather than a fixed offset so it cannot be off by an hour.

update public.events
set event_date = timestamp '2026-11-10 15:00' at time zone 'America/Los_Angeles',
    updated_at = now()
where slug = 'mhapuja';
