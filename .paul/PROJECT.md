---
description: "Central place for all Newah community organization of Northern California info, events, and data collection"
type: Project
about: "newah-organization"
---

# Newah Organization of America — Northern California Chapter

## What This Is

A website for the Newah Organization of America, Northern California chapter. It carries org information, an events calendar with registration, and member signup — giving the chapter one canonical home instead of scattered social posts and spreadsheets. Longer term it grows a board-facing admin portal that doubles as a lightweight CRM for members and event attendees.

## Core Value

Central place for all Newah community org of Northern California info and events, and for collecting member/attendee data.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application |
| Version | 0.0.0 |
| Status | Initializing |
| Last Updated | 2026-09-15 |

**Production URLs:** Domain TBD.

## Requirements

### Core Features

- Public org info pages (about, board, mission, Newah culture)
- Events calendar + event detail pages
- Event registration portal — email-only, no account required
- Member signup form (+ dues via Stripe when introduced)
- Admin/board portal: view and manage collected data, CSV export, light CRM

### Validated (Shipped)

None yet.

### Active (In Progress)

None yet.

### Planned (Next)

**MVP slice (first milestone):** public pages + event list + event registration portal.

Deferred to later phases:
- [ ] Member signup + membership records
- [ ] Stripe payments (dues, paid events)
- [ ] Admin portal / CRM views + export
- [ ] SMS and email marketing

### Out of Scope

- Accounts/logins for event registrants — email-only registration, chosen to minimize friction for a community audience
- Paid events at launch — all events free for now; Stripe arrives with dues/paid events
- Public access to member or attendee data — board admins only

## Target Users

**Primary:** Newah community members in Northern California
- Mixed technical comfort; many will arrive on mobile from a social media link
- Main goal: find out what events are happening and sign up for one

**Secondary:** Chapter board members and admins
- Need to see who registered, manage events, and export data
- Non-technical — admin surfaces must not require a deploy to use

## Context

**Business Context:**
Volunteer-run cultural community chapter of a national organization. No dedicated budget or staff assumed. Success is measured in community reach and turnout, not revenue.

**Technical Context:**
Greenfield — repository is empty at init. Single maintainer (project owner) handles development and operations after launch.

## Constraints

### Technical Constraints

- Hosting on Vercel; backend on Supabase (Postgres, Auth, Storage)
- Event registration must work without registrant accounts (email-only)
- Admin surfaces gated by Supabase Auth with role-based access
- Single maintainer — favor managed services and low operational burden over custom infrastructure

### Business Constraints

- Domain not yet chosen — required before launch
- Volunteer-run; assume minimal budget, free/low tiers preferred
- No hard launch deadline stated; first real chapter event is the natural forcing function

### Compliance Constraints

- Member and attendee PII (names, emails, phone numbers, addresses) is visible to board admins only — enforced with Supabase Row Level Security, not just UI gating
- Stripe integration must not store raw card data; use hosted Checkout/Elements
- SMS and email marketing require opt-in consent capture and unsubscribe handling before launch of that feature

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Vercel + Supabase stack | Managed, free/low tier, minimal ops for a single volunteer maintainer | 2026-09-15 | Active |
| Email-only event registration (no accounts) | Removes signup friction for a community audience where many attendees register once | 2026-09-15 | Active |
| Free events at launch; Stripe deferred | Nothing to charge for yet — avoids payment surface before it earns its keep | 2026-09-15 | Active |
| Board-admins-only access to PII, enforced via RLS | Community trust depends on member data not leaking; database-level enforcement survives UI mistakes | 2026-09-15 | Active |
| MVP = public pages + event list + registration portal | Smallest slice that replaces the spreadsheet and proves the concept | 2026-09-15 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Site live on real domain | Reachable, board can share the link | - | Not started |
| Upcoming event listed publicly | ≥1 event with detail page | - | Not started |
| Registrations captured without a spreadsheet | All registrations for next event land in Supabase | - | Not started |
| Admin can view/export registration list | CSV export works for board | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js (App Router) | Assumed at init — confirm during /paul:plan |
| Hosting | Vercel | Preview deploys, free tier |
| Database | Supabase (Postgres) | Events, registrations, members |
| Auth | Supabase Auth | Board/admin only; registrants need no account |
| Storage | Supabase Storage | Event images, org media |
| Payments | Stripe | Deferred — dues and paid events |
| Messaging | TBD (email + SMS) | Provider not chosen; needed for confirmations and later marketing |

## Specialized Flows

See: .paul/SPECIAL-FLOWS.md

Quick Reference:
- /ui-ux-pro-max → UI/UX design decisions
- /frontend-design → Frontend implementation
- /design-review → Visual QA
- /browse → Live-site QA
- /vercel:nextjs, /vercel:deploy → Next.js & deployment
- /engineering-skills:senior-security → Supabase schema, RLS, auth, PII
- /code-review → Pre-merge review
- /obsidian-sync → End-of-session notes sync

## Links

| Resource | URL |
|----------|-----|
| Repository | (local: newah-organization) |
| Production | TBD |
| Documentation | TBD |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-09-15*
