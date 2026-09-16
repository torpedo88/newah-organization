---
description: "Newah Organization of America — Northern California Chapter — current position and accumulated context"
type: ProjectState
about: "newah-organization"
---

# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-09-15)

**Core value:** The Newah community of Northern California can find out what's happening and sign up for it in one place, while the chapter owns its own community data.
**Current focus:** v0.1 Initial Release — Phase 1 Foundation, plan 01-01

## Current Position

Milestone: v0.1 Initial Release
Phase: 1 of 5 (Foundation) — Planning
Plan: 01-01 created, awaiting approval
Status: PLAN created, ready for APPLY
Last activity: 2026-09-15 — Created .paul/phases/01-foundation/01-01-PLAN.md

Progress:
- Milestone: [░░░░░░░░░░] 0%
- Phase 1: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ✓        ○        ○     [Plan created, awaiting approval]
```

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -

*Updated after each plan completion*

## Accumulated Context

### Decisions

| Decision | Phase | Impact |
|----------|-------|--------|
| `people` as the spine, keyed by email | Ideation | Registration upserts a person; CRM is a join, not a cleanup project |
| Email-only registration, no accounts | Ideation | No registrant auth; dedupe by (event_id, person_id) |
| No public API; Server Actions only | Ideation | Removes endpoint auth, CORS, versioning surface |
| RLS is the access boundary; INSERT-without-SELECT on `people`/`registrations` | Ideation | The anon key is public — this split is what prevents dumping the attendee list |
| No service role key until a phase needs it | Ideation | It bypasses RLS entirely |
| Node 22 pinned across local, CI, Vercel | Ideation | Local machine is on Node 23.1.0 — not LTS, not a Vercel runtime |
| English only | Ideation | No translated columns, no locale routing |
| Noindex until Phase 5 | Ideation | Production deploys are crawlable |

### Deferred Issues

| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| Domain not chosen | Ideation | S | Phase 5 |
| Transactional email provider undecided | Ideation | M | Phase 4 |
| Admin portal / CRM scope undefined | Ideation | L | After v0.1 ships |
| Credential handover — sole maintainer holds all account access | Ideation | S | Before launch |
| Board content (copy, photos, leadership) | Ideation | M | Phase 2 — depends on people, not code |
| Local Node is 23.1.0; no version manager installed | Prior session | S | Before Phase 1 APPLY |

### Blockers/Concerns

| Blocker | Impact | Resolution Path |
|---------|--------|-----------------|
| Supabase and Vercel projects do not exist | Phase 1 cannot deploy | Create during Phase 1 checkpoint |

## Boundaries (Active)

From plan 01-01:
- `.paul/**` — SEED-derived state is authoritative; the prior branch's `.paul/` is superseded and must never be restored over it
- `PLANNING.md` — ideation record, frozen
- `main` / `torpedo88/main` — work happens on `phase-01/foundation`
- `.env.local`, `pnpm-lock.yaml` — maintainer-created / restored as committed
- Branch `phase-01/foundation-scaffold` — recovery point; do not delete, rebase, or force-push
- No schema, migrations, or RLS in 01-01 (owned by 01-02)
- No content, design, events, registration, auth, domain, analytics, Stripe, or email provider

## Session Continuity

Last session: 2026-09-15
Stopped at: Plan 01-01 created
Next action: Review plan, then /paul:audit .paul/phases/01-foundation/01-01-PLAN.md (enterprise audit enabled)
Resume file: .paul/phases/01-foundation/01-01-PLAN.md

**Prior work:** branch `phase-01/foundation-scaffold` holds a complete Next.js 16 + Supabase scaffold, CI workflow, and an enterprise plan audit (5 must-have + 5 strongly-recommended findings). Worth re-reading before re-executing Phase 1 — it already found three real defects.

---
*STATE.md — Updated after every significant action*
