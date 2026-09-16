---
description: "Newah Organization of America — Northern California Chapter — milestone and phase structure"
type: Roadmap
about: "newah-organization"
---

# Roadmap: Newah Organization of America — Northern California Chapter

## Overview

From an empty repository to a live site on a real domain capturing real event registrations. Foundation proves the stack and makes the data layer safe before any real data exists; the public site and events give the community something to read; registration retires the spreadsheet; launch hands the board a self-serve tool. Membership, payments, and outreach follow after v0.1 ships.

## Current Milestone

**v0.1 Initial Release** (v0.1.0)
Status: Not started
Phases: 0 of 5 complete

Scope: public pages + event list + event registration portal, live on a real domain.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with [INSERTED])

Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Foundation | TBD | Not started | - |
| 2 | Public Site | TBD | Not started | - |
| 3 | Events | TBD | Not started | - |
| 4 | Registration | TBD | Not started | - |
| 5 | Launch | TBD | Not started | - |

## Phase Details

### Phase 1: Foundation

**Goal:** A typed Next.js app wired to Supabase, deployed to Vercel, with the `people`/`events`/`registrations` schema and RLS policies that make the data layer safe by default.
**Depends on:** Nothing (first phase)
**Research:** Unlikely (well-trodden stack; prior scaffold exists on `phase-01/foundation-scaffold` for reference)

**Scope:**
- Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui scaffold, pnpm, Node 22 pinned
- Supabase browser and server clients, fail-fast public env validation
- CI: lint, typecheck, build, gitleaks secret scan
- Schema: `people` (email-keyed spine), `events`, `registrations` with unique (event_id, person_id)
- RLS: anon SELECTs published events only; anon INSERTs into `people`/`registrations` with **no SELECT**
- Vercel deploy, robots noindex until launch

**Testable:** deploy returns 200; build fails loudly on missing env; anon can read published events; anon **cannot** read `people` or `registrations`; committed tree has no secrets.

**Plans:** Defined at `/paul:plan`. Expect a split: scaffold/deploy, then schema/RLS.

### Phase 2: Public Site

**Goal:** The public shell and org information pages a visitor can read and share.
**Depends on:** Phase 1 (scaffold, styling baseline)
**Research:** Unlikely

**Scope:**
- Visual direction: palette, typography, Newah cultural visual language
- Mobile-first responsive layout: header, nav, footer
- Pages: home, about, board, mission, culture, contact

**Testable:** renders correctly at 375px and desktop; passes WCAG AA contrast and keyboard navigation.

**Plans:** Defined when Phase 2 begins.

### Phase 3: Events

**Goal:** Visitors browse upcoming events and open a detail page, driven by real Supabase data.
**Depends on:** Phase 1 (schema), Phase 2 (layout, design system)
**Research:** Unlikely

**Scope:**
- Event list with upcoming/past grouping
- Event detail page by slug
- Cover images via Supabase Storage
- Empty and error states

**Testable:** a published event shows correct date, time, location; a draft event is invisible to anonymous visitors.

**Plans:** Defined when Phase 3 begins.

### Phase 4: Registration

**Goal:** A visitor registers for an event with email only, and the board can see who is coming.
**Depends on:** Phase 3 (event pages to register from)
**Research:** Likely
**Research topics:** Transactional email provider (Resend vs Supabase SMTP vs Postmark); abuse mitigation for an unauthenticated write

**Scope:**
- `registerForEvent` Server Action with server-side validation
- `people` upsert by email; registration insert; per-event dedupe; capacity enforcement
- Confirmation email — best-effort, never rolls back a successful registration
- Vercel firewall rules; captcha only if spam materializes

**Testable:** a registration lands in Supabase; duplicate submit does not double-book; a full event refuses politely; an email outage does not lose the registration.

**Plans:** Defined when Phase 4 begins.

### Phase 5: Launch

**Goal:** The site lives on a real domain the board can share, and the board can get the registration list out.
**Depends on:** Phase 4
**Research:** Likely
**Research topics:** Domain selection and registrar; analytics choice

**Scope:**
- Domain purchase, DNS, Vercel custom domain
- SEO basics, Open Graph images for event sharing
- Privacy notice covering collected PII
- Admin-authenticated registration list + CSV export
- Remove robots noindex
- Credential handover document for the board

**Testable:** a board member logs in, sees the list, exports a CSV; a non-board user cannot reach it; shared event links render a preview card.

**Plans:** Defined when Phase 5 begins.

## Post-v0.1 (not yet scheduled)

- Memberships + Stripe dues
- Full admin portal / CRM
- SMS and email marketing with consent capture and unsubscribe handling

---
*Roadmap created: 2026-09-15*
*Last updated: 2026-09-15*
