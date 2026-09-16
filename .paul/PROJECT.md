---
description: "One canonical home for Northern California Newah community info, events with registration, and membership"
type: Project
about: "newah-organization"
---

# Newah Organization of America — Northern California Chapter

## What This Is

A website giving the Northern California Newah community one canonical home for org information, an events calendar with email-only registration, and member signup — replacing scattered social posts and attendee spreadsheets. It grows into a board-facing admin surface that doubles as a lightweight CRM.

## Core Value

The Newah community of Northern California can find out what's happening and sign up for it in one place, while the chapter owns its own community data.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application |
| Version | 0.0.0 |
| Status | Initializing |
| Last Updated | 2026-09-15 |

**Production URLs:** Domain TBD (Phase 5).

## Requirements

### Core Features

- Public org info pages (home, about, board, mission, culture, contact)
- Events calendar + event detail pages, driven by real data
- Event registration — email-only, no account required
- Member signup and membership records (post-v0.1)
- Board admin surface: registration list, CSV export, growing into a light CRM

### Validated (Shipped)

None yet.

### Active (In Progress)

None yet.

### Planned (Next)

v0.1 milestone, five phases: Foundation → Public Site → Events → Registration → Launch.

Post-v0.1, not scheduled:
- [ ] Memberships + Stripe dues
- [ ] Full admin CRM
- [ ] SMS and email marketing with consent capture and unsubscribe handling

### Out of Scope

- Accounts or logins for event registrants — email-only by design, to remove friction for a community audience where most people register once
- A public HTTP API — the website is the only client, so an API would be surface area with no consumer
- Paid events at launch — all free; Stripe arrives with dues
- Public access to member or attendee data — board admins only
- Bilingual content — English only; no translated columns, no locale routing, revisit only if the board asks for Nepal Bhasa

## Target Users

**Primary:** Newah community members in Northern California
- Mixed technical comfort; most arrive on a phone from a social media link
- Goal: find out what's happening and sign up

**Secondary:** Chapter board members
- Need to see who registered, manage events, export data
- Non-technical — admin surfaces must not require a deploy

## Context

**Business Context:**
Volunteer-run cultural chapter of a national organization. No budget, no staff, one technical maintainer. Success is community reach and event turnout, not revenue. Off-the-shelf options were rejected deliberately: Meetup and Eventbrite own the member relationship and charge per event; a Facebook group is not indexable or archival and excludes people who avoid the platform; a site builder handles pages but not queryable registration data. Owning the community's own data is the point.

**Technical Context:**
Greenfield. A prior scaffold attempt is preserved on branch `phase-01/foundation-scaffold` — Next.js 16 + Supabase scaffold, CI workflow, and an enterprise plan audit worth re-reading before Phase 1 re-execution.

## Constraints

### Technical Constraints

- Hosting on Vercel; backend on Supabase (Postgres, Auth, Storage)
- Registration must work without registrant accounts
- No public API — reads via Server Components, writes via Server Actions
- Admin surfaces gated by Supabase Auth with role on `profiles`
- Single maintainer — favor managed services over custom infrastructure
- Node 22 pinned across local, CI, and Vercel

### Business Constraints

- Domain not chosen — required before launch
- Volunteer-run; free/low tiers preferred
- No hard deadline; the first real chapter event is the forcing function
- Org copy, photos, and board details depend on the board, not on code

### Compliance Constraints

- Member and attendee PII visible to board admins only — enforced by Supabase Row Level Security, not UI checks
- The Supabase anon key is public by design; RLS is the only real access boundary
- No service role key in the codebase until a phase genuinely needs it — it bypasses RLS
- A volunteer nonprofit chapter does not meet CCPA's for-profit thresholds, so it almost certainly does not bind; a plain-language privacy notice is still required before launch
- SMS and email marketing require opt-in consent capture and unsubscribe handling before that feature ships

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| `people` as the spine — one row per human, keyed by email | Registrations and memberships both reference it; retrofitting identity after hundreds of registrations is a data-cleanup project, adding it now costs one table and an upsert | 2026-09-15 | Active |
| Email-only registration, no accounts | Removes signup friction for a community audience; accepts that someone can register another person's email, with the confirmation email as mitigation | 2026-09-15 | Active |
| No public API; Server Actions only | The website is the only client | 2026-09-15 | Active |
| RLS as the access boundary, INSERT-without-SELECT on `people` and `registrations` | The anon key is public, so the database is the only place enforcement is real; this split is what prevents dumping the attendee list | 2026-09-15 | Active |
| No service role key until a phase needs it | It bypasses RLS; an unused copy is a standing risk with zero benefit | 2026-09-15 | Active |
| Vercel + Supabase, both managed | A single volunteer maintainer cannot carry infrastructure operations | 2026-09-15 | Active |
| English only | No translated columns, no locale routing | 2026-09-15 | Active |
| Free events at launch; Stripe deferred | Nothing to charge for yet | 2026-09-15 | Active |
| Node 22 pinned across local, CI, and Vercel | Node 23 is not an LTS and not a Vercel runtime; unpinned toolchains break volunteer projects years later | 2026-09-15 | Active |
| Noindex until launch | Production Vercel deploys are crawlable; an unfinished page indexed under the org's name is slow to undo | 2026-09-15 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Site live on real domain | Board can share the link | - | Not started |
| Upcoming event listed publicly | ≥1 event with detail page | - | Not started |
| Registrations captured without a spreadsheet | All registrations land in Supabase | - | Not started |
| Board can export the attendee list | CSV export works, auth-gated | - | Not started |
| anon role cannot read `people` or `registrations` | Verified by policy test | - | Not started |
| Mobile performance | LCP < 2.5s on 4G | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16 (App Router) + TypeScript | Server Components keep data access server-side by default |
| Backend | Next.js Server Actions | No separate API — website is the only client |
| Database | Supabase (Postgres) | `people`, `events`, `registrations`, `memberships`, `profiles` |
| Auth | Supabase Auth | Board/admin only; registrants never authenticate |
| Storage | Supabase Storage | Event images, org media |
| Cache | None | Small, bursty traffic; static generation covers it |
| Styling | Tailwind v4 + shadcn/ui | Accessible primitives without building a design system |
| Hosting | Vercel | Preview deploy per PR |
| CI | GitHub Actions | lint, typecheck, build, gitleaks — placeholder env values only |
| Package manager | pnpm 10 / Node 22 | Current LTS, supported Vercel runtime |
| Email | TBD | Resend vs Supabase SMTP vs Postmark — needed by Phase 4 |
| Payments | Stripe | Post-v0.1 |

## Specialized Flows

See: .paul/SPECIAL-FLOWS.md

Quick Reference:
- /ui-ux-pro-max → UI/UX design decisions
- /frontend-design → Frontend implementation
- /design-review → Visual QA
- /browse → Live-site QA
- /vercel:nextjs, /vercel:deploy → Next.js & deployment
- /engineering-skills:senior-security → Schema, RLS, auth, PII
- /code-review → Pre-merge review
- /aegis:audit → Multi-domain codebase audit (post-phase)
- /obsidian-sync → End-of-session notes sync

## Links

| Resource | URL |
|----------|-----|
| Repository | github.com/torpedo88/newah-organization |
| Ideation | PLANNING.md (SEED, application type) |
| Production | TBD |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-09-15*
