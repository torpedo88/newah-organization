# Developer Handoff — newah-organization

**Prepared:** 2026-09-15
**Repository:** github.com/torpedo88/newah-organization
**Status:** Phase 1 fully planned and audited. No application code on `main` yet.
**Your first command:** `cat .paul/phases/01-foundation/01-01-PLAN.md`

---

## What this project is

A website for the **Newah Organization of America — Northern California Chapter**: org information, an events calendar with email-only registration, and later member signup and a board-facing admin surface.

It is volunteer-run, has no budget, and serves a cultural community. The data it collects — names, emails, phone numbers, eventually addresses — belongs to people who trusted a community organization with it. That fact drives most of the technical decisions below, and it is the reason several of them are stricter than a project this size would normally warrant.

**Core value:** the community can find out what's happening and sign up for it in one place, while the chapter owns its own community data.

---

## How this project is managed

It uses **PAUL** (Plan → Apply → Unify), a structured development framework. You do not need to adopt it to contribute, but you do need to read what it produced, because that is where all the decisions live.

```
.paul/
├── PROJECT.md      Requirements, constraints, 10 recorded decisions
├── ROADMAP.md      5 phases for the v0.1 milestone
├── STATE.md        Current position, deferred issues, blockers
├── SPECIAL-FLOWS.md Skills expected during each kind of work
├── config.md       Integrations enabled
└── phases/01-foundation/
    ├── 01-01-PLAN.md    Restore scaffold, verify, deploy
    ├── 01-01-AUDIT.md   Enterprise audit of that plan
    ├── 01-02-PLAN.md    Schema + RLS
    └── 01-02-AUDIT.md   Enterprise audit of that plan
```

**PLAN.md files are executable specifications.** Each contains acceptance criteria in Given/When/Then form, tasks with explicit files/action/verify/done, and a boundaries section stating what must not be touched. Follow them rather than improvising — the boundaries exist because specific things went wrong or nearly went wrong already.

**AUDIT.md files explain why plans say what they say.** Read the audit before the plan. Both audits found real defects, and the plans were rewritten around those findings.

`PLANNING.md` at the repo root is the original ideation record (produced by SEED). It is frozen history — `PROJECT.md` is where requirements live now.

---

## Current state

| | |
|---|---|
| `main` | Project state and plans only. **Zero application files.** |
| `paul/phase-1-planning` | Merged into main (PR #1) |
| `phase-01/foundation-scaffold` | **Do not delete, rebase, or force-push.** Recovery point — see below |
| PR #2 | Closed deliberately, not abandoned. Reasoning is in the PR comment |

### The scaffold branch

`phase-01/foundation-scaffold` holds a **complete, audited Next.js 16 + Supabase scaffold** — 26 application files, a CI workflow, and working Supabase client modules. It was built and hardened in an earlier session, then set aside when the project was re-planned.

Plan 01-01 restores those files rather than rebuilding them, because the audit of that work caught three real defects that a rebuild would likely reintroduce:

1. `lib/env.ts` validated a server-only variable inside a module client code imports. Next.js leaves non-`NEXT_PUBLIC_` variables `undefined` in the browser bundle, so the module-load throw would have fired in **every visitor's browser**.
2. The secret-scan command grepped the working directory including `.next` build output — it could fail for irrelevant reasons and pass without proving anything. It now scans `git ls-files` contents.
3. `server-only` was imported but never installed, making the guard an inert string.

That branch also carries a **superseded `.paul/` tree** from an earlier project setup. Plan 01-01 restores application files with a path-filtered `git checkout` that excludes `.paul/`. **Do not `git merge` or `cherry-pick` that branch** — it would overwrite the current project state with the old one. This is exactly why PR #2 was closed rather than merged.

---

## Setup

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node | **22** (LTS) | `node -v` |
| pnpm | 10 | `pnpm -v` |
| GitHub CLI | authenticated, **`workflow` scope** | `gh auth status` |
| Vercel CLI | authenticated | `pnpm dlx vercel whoami` |

Node 22 is pinned in `.nvmrc`, `package.json` `engines`, CI, and Vercel settings. pnpm **warns but does not block** on a version mismatch, so a wrong version fails quietly rather than loudly — check it deliberately.

### Git credential requirement — read this before your first push

Pushing `.github/workflows/ci.yml` requires a token with **`workflow` scope**. Without it, the push is rejected with:

```
refusing to allow an OAuth App to create or update workflow
`.github/workflows/ci.yml` without `workflow` scope
```

The message points at the workflow file, not at your credentials, which makes it easy to misdiagnose.

On macOS, git commonly uses `osxkeychain`, which may hold an older GitHub credential **even when `gh auth status` shows the correct scopes** — git and `gh` can be using different tokens. Route git through `gh` in your clone:

```bash
git config --local --replace-all credential.https://github.com.helper ""
git config --local --add credential.https://github.com.helper "!gh auth git-credential"
```

This is **repo-local config**. It lives in `.git/config` and **does not survive a clone** — re-apply it in every fresh clone, or run `gh auth setup-git` to configure it globally.

### Accounts — decide ownership before creating anything

Plan 01-01 has a blocking checkpoint where the Supabase and Vercel projects get created. **Do not create them under a personal account.**

These projects will hold community members' personal data. They must be owned by an account the organization controls, with developers added as members. If they are created personally, the chapter's data sits in an individual's account, recoverable only with that person's cooperation, and offboarding becomes a data-custody problem rather than an access change.

Coordinate with the project owner before this step.

---

## Architecture decisions you need to know

These are settled. Each has a reason recorded in `.paul/PROJECT.md`. If you want to revisit one, raise it — don't quietly work around it.

### `people` is the identity spine

One row per human, keyed by a case-insensitive email (`citext`). `registrations` and later `memberships` both reference it.

The alternative — separate, unrelated attendee and member tables — is marginally simpler now and turns the eventual CRM into a deduplication project: answering "which attendees are members?" would mean fuzzy-matching emails across tables after hundreds of rows exist.

### Email-only registration, no accounts

Registrants never authenticate. This is deliberate friction reduction for a community audience where most people register once. It accepts that someone can register another person's email; the confirmation email is the mitigation, and the stakes are a free community event.

### No public API — Server Actions only

The website is the only client. An HTTP API would be endpoint auth, CORS, versioning, and rate-limit surface with no consumer.

### RLS is the security boundary — this is the important one

**The Supabase anon key is public by design.** It ships in the browser bundle. Anyone can read it. It is not a secret and must never be treated as one.

Row Level Security is therefore not a layer of defense — it is the only one. "Board admins only" is expressed as database policy, never as a UI check.

The critical asymmetry:

| Table | `anon` | Why |
|-------|--------|-----|
| `events` | SELECT where `status='published'` | Public listings |
| `people` | **INSERT only, no SELECT** | Registration writes; attendee list must stay unreadable |
| `registrations` | **INSERT only** (published events only), **no SELECT** | Same |

If you find yourself adding a SELECT policy to `people` or `registrations` to make something work, **stop**. That is equivalent to publishing the attendee list. Plan 01-02 documents the one case where this temptation arises — an upsert that cannot return its row — and the correct `security definer` solution.

### No service role key until something needs it

The service role key bypasses RLS entirely. There is currently no service-role client anywhere in the codebase, deliberately. An unused copy of a credential that defeats all access control is a standing risk with no benefit. It arrives in Phase 5, in a `server-only` module, when the admin export genuinely needs it.

### Other settled decisions

- **English only** — no translated columns, no locale routing
- **Free events at launch** — Stripe deferred to post-v0.1
- **Noindex until Phase 5** — production Vercel deploys are crawlable, and a half-built page indexed under the organization's name is slow to undo
- **Node 22 pinned everywhere** — Node 23 is not an LTS and not a Vercel runtime

---

## The work

### Phase 1 — Foundation (planned and audited, ready to execute)

**Plan 01-01 — Restore scaffold, verify, deploy.** 3 tasks + 1 blocking checkpoint.
Branch from `origin/main` as `phase-01/foundation`. Restore the 26 app files excluding `.paul/`, then re-verify every inherited claim from scratch — ten checks, none of which may cite the previous session's results. Then Supabase/Vercel setup (checkpoint), push, CI, deploy.

**Plan 01-02 — Schema + RLS.** 4 tasks + 1 blocking checkpoint. Depends on 01-01.
Migrations for `people`, `events`, `registrations`; RLS deny-by-default plus exactly three policies; then **fourteen empirical probes** run with the real anon key against the real database, proving what is and is not reachable. Reading a policy and believing it is how RLS mistakes ship.

Its audit caught a hole worth understanding: the registration INSERT policy originally allowed inserts against **draft** events. Draft events were hidden from reads and wide open to writes — a security property that held exactly where it was tested and nowhere else.

### Phases 2–5 (scoped in ROADMAP, not yet planned)

| Phase | Goal |
|-------|------|
| 2 Public Site | Design direction, responsive shell, org pages |
| 3 Events | Event list and detail pages from real data |
| 4 Registration | `registerForEvent` Server Action, dedupe, capacity, confirmation email |
| 5 Launch | Domain, SEO/OG, privacy notice, admin list + CSV export, remove noindex |

Run `/paul:plan` when a phase begins. Do not plan them all up front — ROADMAP carries the scope, and the detail is better written against a codebase that exists.

---

## Open items you will hit

| Item | Needed by | Notes |
|------|-----------|-------|
| Domain not chosen | Phase 5 | Needs the board |
| Transactional email provider | Phase 4 | Resend / Supabase SMTP / Postmark — undecided |
| Board content (copy, photos, leadership) | Phase 2 | Depends on people, not code |
| Credential handover to the board | Before launch | If the sole maintainer is unavailable, the board has no route to its own data |
| Admin portal / CRM scope | After v0.1 | Deliberately undefined until the board has used the basic export once |
| Automated RLS regression tests | Phase 4 | **The most important deferred item.** Probes are manual today, so a future migration can widen access and nothing will notice |
| Storage bucket policies | Phase 3 | Separate policy system from table RLS; a public bucket exposes everything in it |

---

## Conventions

- **Branch per plan**, named for it (`phase-01/foundation`, `phase-01/schema-rls`). Never commit to `main` directly.
- **One commit per task**, message describing the change. Auto-commit is off.
- **No AI attribution** in commits or PRs — no `Co-Authored-By` trailers, no "Generated with" lines.
- **PR required.** CI runs on `pull_request` only, so a branch push alone runs nothing.
- **Never commit secrets.** `.env.local` is gitignored; `.env.example` holds names with empty values. CI runs gitleaks. If a key ever reaches a commit, **rotate it in Supabase** — deleting the file in a follow-up commit does not remove it from history.
- **Migrations are the only schema truth.** A change made in the Supabase dashboard and not written as a committed migration does not exist.

### CI

`.github/workflows/ci.yml` (arrives with plan 01-01) runs on every PR: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and a gitleaks scan. It uses placeholder Supabase values — CI holds no real credentials, because the build does not talk to Supabase.

---

## If you are picking this up cold

1. Read `.paul/PROJECT.md` — requirements and the decisions table
2. Read `.paul/phases/01-foundation/01-01-AUDIT.md` — why the plan is shaped as it is
3. Read `.paul/phases/01-foundation/01-01-PLAN.md` — the work
4. Confirm prerequisites and the git credential setup above
5. Coordinate account ownership with the project owner **before** the checkpoint
6. Execute 01-01, then 01-02

For anything ambiguous, `.paul/STATE.md` records the current position, every deferred issue with its revisit trigger, and active blockers.

---

*This document describes state as of 2026-09-15. `.paul/STATE.md` is authoritative if the two disagree.*
