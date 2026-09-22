# Key rotation + environment setup

Work top to bottom. Step 1 stops live data exposure and takes about ten seconds.

---

## 1. Close the exposure (do this first)

Supabase Dashboard → SQL Editor → run:

```sql
DROP POLICY IF EXISTS "Allow read registrations" ON registrations;
```

Registration submissions keep working — the INSERT policy is untouched and the
form never reads rows back.

The full version of this, with verification queries and a revert path, is in
`supabase/migrations/0003_fix_registrations_rls.sql`. Run that file rather than
just the one line if you have a moment.

**Verify it worked** (uses the *public* anon key, which is the point):

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/registrations?select=count" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

Before the fix this returned `206` with a row count. After, expect `401`/`403`,
or `200` with an empty array. **A row count means the policy is still live.**

---

## 2. Rotate the Supabase anon key

The old key is in public git history. Deleting `check_db.js` does not remove it
from history, so the key itself has to change.

Supabase Dashboard → Settings → API → **Rotate** the anon / publishable key.

> Note: rotating invalidates the old key everywhere at once. The deployed site
> will break until step 4 updates Vercel. Do steps 3 and 4 promptly, or do this
> at a quiet moment.

**Project URL does not need rotating.** It is not a secret and cannot be changed.

---

## 3. Rotate the Resend key, and check what else exists

`RESEND_API_KEY` is a real secret (unlike the anon key). I found no evidence it
was ever committed — but it lives on whatever machine the developer used and may
have been shared over chat or email. If you cannot account for every copy,
rotate it: Resend Dashboard → API Keys → revoke and create new.

**Also check:** if a `SUPABASE_SERVICE_ROLE_KEY` was ever exported to run
`run-migration.sh`, it may be sitting in that shell's history. That key bypasses
Row Level Security completely — it is the one whose exposure would be severe.
Rotate it if there is any doubt: Supabase → Settings → API → Service Role.

---

## 4. Fill in `.env.local`

`.env.local` already exists in your working copy with placeholders and is
gitignored. Open it and paste the new values:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<new anon key>
RESEND_API_KEY=<resend key>
```

Confirm it is not tracked before committing anything:

```bash
git check-ignore -v .env.local   # must print a .gitignore rule
git status --short                # .env.local must not appear
```

---

## 5. Push the same values to Vercel

Use the interactive form. It prompts for the value rather than taking it as an
argument, which keeps keys out of your shell history:

```bash
pnpm dlx vercel link          # once, if not already linked

pnpm dlx vercel env add NEXT_PUBLIC_SUPABASE_URL production
pnpm dlx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
pnpm dlx vercel env add RESEND_API_KEY production
```

Repeat with `preview` in place of `production` so pull-request deploys work.

Never run `vercel env add NAME production <<< "value"` or pass the value as an
argument — both land the key in shell history.

If you would rather use the dashboard: Vercel → Project → Settings →
Environment Variables.

**Then redeploy** so the new values are baked in. `NEXT_PUBLIC_*` variables are
inlined at build time, so an existing deployment keeps serving the old key until
it is rebuilt:

```bash
pnpm dlx vercel --prod
```

---

## 6. Confirm the old key is dead

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://<project-ref>.supabase.co/rest/v1/registrations?select=count" \
  -H "apikey: <OLD key from git history>" \
  -H "Authorization: Bearer <OLD key>"
```

Expect `401`. Anything else means rotation did not take effect.

---

## Why the anon key being public is still not fine here

The anon key is public **by design** — it ships in the browser bundle, so anyone
visiting the site can read it. That is expected and safe *when RLS is correct*.

It was not correct. `FOR SELECT USING (true)` meant that public key could read
every registration row. Committing the key to a public repo made it easier to
find, but the deployed site handed it out anyway.

So: step 1 is the actual fix. Rotation (step 2) is cleanup — it closes the window
for anyone who already copied the key from git history before step 1 landed.
