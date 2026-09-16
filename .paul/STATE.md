---
description: "Newah Organization of America — Northern California Chapter — current position and accumulated context"
type: ProjectState
about: "newah-organization"
---

# Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-09-15)

**Core value:** The Newah community of Northern California can find out what's happening and sign up for it in one place, while the chapter owns its own community data.
**Current focus:** Project initialized from SEED ideation — ready for planning

## Current Position

Milestone: v0.1 Initial Release
Phase: Not yet planned (5 defined in ROADMAP)
Plan: None yet
Status: Ready for first PLAN
Last activity: 2026-09-15 — Initialized from PLANNING.md (SEED, application type)

Progress:
- Milestone: [░░░░░░░░░░] 0%

## Loop Position

Current loop state:
```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Ready for first PLAN]
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

None yet — set when the first PLAN is created.

## Session Continuity

Last session: 2026-09-15
Stopped at: PAUL initialized from SEED PLANNING.md
Next action: Run /paul:plan to create the first plan for Phase 1 (Foundation)
Resume file: .paul/PROJECT.md

**Prior work:** branch `phase-01/foundation-scaffold` holds a complete Next.js 16 + Supabase scaffold, CI workflow, and an enterprise plan audit (5 must-have + 5 strongly-recommended findings). Worth re-reading before re-executing Phase 1 — it already found three real defects.

---
*STATE.md — Updated after every significant action*
