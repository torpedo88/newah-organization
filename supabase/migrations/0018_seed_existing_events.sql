-- The two events the site already runs, as rows in `events`.
--
-- Mha Puja and Indra Jatra were built as their own pages and registration
-- tables before /admin/events existed, so Events Management listed nothing
-- while both were live. Seeding them makes the events list the one place
-- the board starts from; each row links to that event's registrations.
--
-- The slug is load-bearing for these two: it is the /register/<slug> path
-- and it selects which registration table the admin reads
-- (lib/admin/event-registrations.ts). The admin actions refuse to change or
-- delete it.
--
-- Indra Jatra's date was never recorded anywhere in the codebase
-- (EVENT.date is empty), so event_date becomes nullable rather than
-- inventing one. The board can fill it in from Edit.

alter table public.events alter column event_date drop not null;

insert into public.events (title, slug, description, event_date, location, capacity, published)
values
  (
    'Mha Puja — Nhu Daya Bhintuna',
    'mhapuja',
    'Mha Puja and dinner for Nepal Sambat 1147. Bhintuna 3:00 PM, Mha Puja 5:00 PM onwards. Adults $40, children under 10 $15.',
    '2026-10-22 15:00:00-07',
    'Nepali Community Center, 369 Chesley Ave, Richmond, CA 94801',
    null,
    true
  ),
  (
    'Indra Jatra — Jatra with a Cause',
    'indrajatra',
    'Free to attend. After event expenses, remaining proceeds go to the Prime Minister''s Disaster Relief Fund.',
    null,
    null,
    null,
    true
  )
on conflict (slug) do nothing;

notify pgrst, 'reload schema';
