---
description: "Newah Organization of America — Northern California Chapter — milestone and phase structure"
type: Roadmap
about: "newah-organization"
---

# Roadmap: Newah Organization of America — Northern California Chapter

## Overview

A website for the NOA Northern California chapter: org information, an events calendar with email-only registration, member signup, and a board-facing admin portal that grows into a light CRM. The journey runs from an empty repo to a live public site capturing real event registrations, then outward to membership, payments, and outreach.

## Current Milestone

**v0.1 Initial Release** (v0.1.0)
Status: In progress
Phases: 0 of 5 complete

Scope of v0.1 — the MVP slice: public pages + event list + event registration portal.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with [INSERTED])

Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Foundation | 2 | Planning | - |
| 2 | Public Site | TBD | Not started | - |
| 3 | Events | TBD | Not started | - |
| 4 | Registration | TBD | Not started | - |
| 5 | Launch | TBD | Not started | - |

## Phase Details

### Phase 1: Foundation

**Goal:** A typed Next.js app wired to Supabase, styled with Tailwind + shadcn/ui, deployed to Vercel, with the events/registrations schema and RLS policies in place.
**Depends on:** Nothing (first phase)
**Research:** Unlikely (well-trodden stack)

**Scope:**
- Next.js 15 App Router + TypeScript scaffold, pnpm
- Tailwind + shadcn/ui baseline
- Supabase client wiring (browser + server), env var conventions
- Vercel project + first successful deploy
- Database schema: events, registrations
- Row Level Security policies: public reads published events; nobody reads registrations without an admin role

**Plans:**
- [ ] 01-01: Scaffold Next.js + Tailwind/shadcn + Supabase clients, deploy to Vercel
- [ ] 01-02: Database schema (events, registrations) + RLS policies + generated types

### Phase 2: Public Site

**Goal:** The public shell and org information pages a visitor can read and share.
**Depends on:** Phase 1 (app scaffold, styling baseline)
**Research:** Unlikely

**Scope:**
- Design direction: palette, typography, Newah cultural visual language
- Site layout: header, nav, footer, mobile-first responsive shell
- Pages: home, about, board, mission, culture, contact

**Plans:** Defined when Phase 2 begins.

### Phase 3: Events

**Goal:** Visitors can browse upcoming events and open a detail page, driven by real Supabase data.
**Depends on:** Phase 1 (schema), Phase 2 (layout, design system)
**Research:** Unlikely

**Scope:**
- Event list / calendar view, upcoming vs past
- Event detail page with slug routing
- Empty and error states
- Event images via Supabase Storage

**Plans:** Defined when Phase 3 begins.

### Phase 4: Registration

**Goal:** A visitor registers for an event with email only, and the board can see who is coming.
**Depends on:** Phase 3 (event pages to register from)
**Research:** Likely
**Research topics:** Transactional email provider (Resend vs Supabase SMTP vs other), spam/abuse mitigation for an unauthenticated form

**Scope:**
- Registration form: name, email, phone, party size, notes
- Server-side validation, duplicate handling per event+email, capacity enforcement
- Bot/abuse mitigation on an unauthenticated endpoint
- Confirmation email to registrant

**Plans:** Defined when Phase 4 begins.

### Phase 5: Launch

**Goal:** The site lives on a real domain the board can share, and the board can get the registration list out.
**Depends on:** Phase 4
**Research:** Likely
**Research topics:** Domain selection and registrar, analytics choice

**Scope:**
- Domain purchase + DNS + Vercel custom domain
- SEO basics, Open Graph images for event sharing
- Privacy notice covering collected PII
- Admin-authenticated registration list + CSV export

**Plans:** Defined when Phase 5 begins.

## Post-v0.1 (not yet scheduled)

- Member signup + membership records
- Stripe payments (dues, paid events)
- Full admin portal / CRM
- SMS and email marketing with consent capture

---
*Roadmap created: 2026-09-15*
*Last updated: 2026-09-15*
