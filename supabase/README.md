# Database

Schema lives in `supabase/migrations/`, applied in filename order.

**The Supabase dashboard is not the source of truth.** A change made there and
not written as a migration here does not exist as far as this repo is concerned,
and will be lost the next time the schema is rebuilt.

## Applying a migration

Paste the file into the Supabase SQL editor (Dashboard → SQL Editor) and run it.

## History

| File | Purpose |
|------|---------|
| `0003_fix_registrations_rls.sql` | Security fix — removes anonymous read access to registrations |

Numbering starts at 0003 because the original `registrations` table was created
by `lib/supabase/migrations.sql` and `run-migration.sh` before this directory
existed. Those two files are the de-facto 0001 and 0002. New schema changes go
here.

## The rule that matters

`registrations` holds community members' names, phone numbers, and email
addresses. The Supabase anon key is **public by design** — it ships in the
browser bundle, and anyone can read it from the deployed site.

Row Level Security is therefore not one layer of defense. It is the only one.

Never add a SELECT policy to `registrations` for the `anon` role. If something
seems to need one, it needs a `security definer` function or an authenticated
admin path instead.
