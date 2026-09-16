# Newah Organization of America — Northern California Chapter

> A website giving the Northern California Newah community one canonical home for org info, events with registration, and membership — replacing scattered social posts and attendee spreadsheets.

**Created:** 2026-09-15
**Type:** Application
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui + Supabase (Postgres/Auth/Storage) + Vercel
**Skill Loadout:** PAUL, ui-ux-pro-max, frontend-design, design-review, browse, engineering-skills:senior-security, SonarQube (optional)
**Quality Gates:** typecheck + lint + build in CI, secret scan, RLS policy review, accessibility (WCAG AA), mobile-first responsive

---

## Problem Statement

The Newah community of Northern California has no canonical home online. Event announcements scatter across social media posts that expire from feeds, attendee lists live in ad-hoc spreadsheets, and there is no durable record of who is in the community or who showed up. Anyone looking for "when is the next event" has to already know which group or person to ask.

**Who it's for:**
- **Primary:** Newah community members in Northern California — mixed technical comfort, most arriving on a phone from a social media link. Their goal is simple: find out what's happening and sign up.
- **Secondary:** Chapter board members — need to see who registered, manage events, and get data out. Non-technical; admin surfaces must not require a deploy.

**Why build rather than buy:** Off-the-shelf options each fail a requirement. Meetup and Eventbrite own the member relationship and charge per event; a Facebook group is not indexable, not archival, and excludes people who avoid the platform; a generic site builder handles pages but not structured registration data the board can query and export. The chapter needs to own its own community data — that is the whole point.

**Context:** Volunteer-run cultural chapter of a national organization. No budget, no staff, a single technical maintainer. Success is community reach and event turnout, not revenue.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript | Server Components keep data access server-side by default; static public pages are fast on mobile; one framework covers pages and form handling |
| Backend | Next.js Server Actions (no separate API) | The website is the only client, so a public API would be surface area with no consumer |
| Database | Supabase (Postgres) | Relational fits the people/events/registrations model; RLS enforces access at the data layer; managed, so no ops burden |
| Auth | Supabase Auth | Board/admin only — event registrants never create accounts |
| Storage | Supabase Storage | Event images, org media |
| Cache | None | Traffic is small and bursty around events; Next.js static generation covers it |
| Styling | Tailwind v4 + shadcn/ui | Component baseline without a design-system build; accessible primitives out of the box |
| Deployment | Vercel | Zero-config for Next.js, free tier, preview deploys per PR |
| Package manager | pnpm 10, Node 22 | Node 22 is the current LTS and a supported Vercel runtime |

### Research Needed

- **Transactional email provider** — unresolved. Candidates: Resend (simplest DX, generous free tier), Supabase's built-in SMTP (fewer moving parts, weaker deliverability), Postmark. Needed by Phase 4.
- **Bot mitigation** for the unauthenticated registration action — starting with Vercel firewall rules plus per-event email uniqueness; captcha (Turnstile/hCaptcha) only if spam actually appears.

---

## Data Model

Core decision: **`people` is the spine.** Every human who touches the system gets exactly one `people` row, keyed by email. Registrations and memberships both point at it.

The alternative — separate, unrelated `registrations` and `members` tables — is marginally cheaper at MVP but makes the eventual CRM a data-cleanup project: answering "which of our attendees are members?" would mean fuzzy-matching emails across tables after hundreds of rows already exist. Retrofitting a spine later is expensive; adding it now costs one table and an upsert.

### Entities

| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| `people` | id, email (unique, citext), full_name, phone, created_at, updated_at | has many registrations; has many memberships |
| `events` | id, slug (unique), title, description, starts_at, ends_at, location, capacity, cover_image_path, status (draft/published), created_at | has many registrations |
| `registrations` | id, event_id, person_id, party_size, notes, status, created_at | belongs to event; belongs to person; **unique (event_id, person_id)** |
| `memberships` | id, person_id, tier, joined_at, renewal_date, status | belongs to person — post-v0.1 |
| `profiles` | id (= auth.users.id), person_id, role (admin/board) | links a Supabase auth user to a person and grants board access |

### Notes

- Email is the natural key for `people`; store as `citext` so casing never creates duplicate humans.
- `unique (event_id, person_id)` is what makes double-submit harmless — the second insert is a no-op conflict rather than a duplicate attendee.
- `capacity` nullable: null means unlimited. Enforced server-side at registration time, not by a DB constraint, so the error message can be humane.
- Single language — English only. No translated columns, no locale routing. Revisit only if the board asks for Nepal Bhasa content.
- `events.status` gates public visibility; drafts are invisible to the `anon` role via RLS, not via a query filter that a bug could drop.

---

## API Surface

**No public HTTP API.** The website is the only client, confirmed during ideation. Data flows through React Server Components (reads) and Server Actions (writes). This removes endpoint auth, versioning, CORS, and rate-limit surface that would otherwise exist with no consumer to justify it.

### Auth Strategy

Supabase Auth, session cookies via `@supabase/ssr`, **board and admin only**. Event registrants are never authenticated — registration is email-only by deliberate design, to remove signup friction for a community audience where most people register once.

### Server Actions

| Action | Auth | Purpose |
|--------|------|---------|
| `registerForEvent` | none (public) | Upsert `people` by email, insert `registration`, enforce capacity and per-event uniqueness |
| `createEvent` / `updateEvent` | board | Manage events — post-v0.1 admin surface |
| `exportRegistrations` | board | CSV of registrations for one event |

### Internal vs External

- **Public (unauthenticated):** event browsing (read), `registerForEvent` (write)
- **Board-only:** everything touching `people`, `memberships`, drafts, and exports
- **MCP integration points:** none

---

## Deployment Strategy

### Local Development

No Docker. Hosted Supabase only — one project, used by both local development and production at this scale, with schema changes applied as SQL migration files committed to the repo.

| Service | Runtime | Port | Purpose |
|---------|---------|------|---------|
| Next.js dev server | Node 22 | 3000 | Application |
| Supabase | hosted | — | Postgres, Auth, Storage |

### Staging / Production

- **Production:** Vercel, deployed from the default branch
- **Preview:** automatic Vercel deploy per pull request
- **CI:** GitHub Actions on every PR — `pnpm install --frozen-lockfile`, lint, `tsc --noEmit`, build, and a gitleaks secret scan. CI uses placeholder Supabase values; it never holds real credentials.
- **Node version** pinned identically in `.nvmrc`, CI, and Vercel settings
- **Not indexable until launch** — `robots.txt` disallows all agents until Phase 5

---

## Security Considerations

The security-defining fact of this project: **the Supabase anon key is public by design.** It ships in the browser bundle and anyone can read it. It is not a secret. Row Level Security is therefore the only thing standing between a visitor and the community's personal data, and "board admins only" must be expressed as database policy rather than as a UI check.

### RLS policy matrix

| Table | `anon` | `authenticated` (board) |
|-------|--------|-------------------------|
| `events` | SELECT where `status = 'published'` | full |
| `people` | INSERT / upsert only — **no SELECT** | full |
| `registrations` | INSERT only — **no SELECT** | full |
| `memberships` | none | full |
| `profiles` | none | own row SELECT |

The INSERT-without-SELECT asymmetry on `people` and `registrations` is the critical control. Get it wrong and anyone holding the public anon key can dump the full attendee list. Every new table starts deny-by-default, with policies added explicitly.

- **Auth/Authz model:** Supabase Auth for board members; role carried on `profiles`; no registrant accounts.
- **Input validation:** all Server Action inputs validated server-side (email shape, party size bounds, notes length) — never trust the client form.
- **Secrets management:** `NEXT_PUBLIC_*` only in the client; `.env.local` gitignored; `.env.example` holds names and empty placeholders. **No service role key exists in the codebase until a phase genuinely needs it** — it bypasses RLS entirely, so an unused copy is a standing risk with no benefit. When introduced, it lives in a `server-only` module.
- **OWASP concerns specific to this app:** unauthenticated write endpoint (registration) — abuse and spam; broken access control via missing or wrong RLS — the highest-impact risk here; PII exposure through an admin view that forgets a role check.
- **Rate limiting:** Vercel firewall rules plus per-event email uniqueness as the first line. Captcha added only if spam materializes — friction on a community signup form has a real cost.
- **Email-only registration accepts that anyone can register someone else's address.** Stakes are low (a free community event), and the confirmation email is the mitigation. Worth revisiting if paid events arrive.
- **Compliance:** a volunteer nonprofit chapter does not meet CCPA's for-profit thresholds, so it almost certainly does not bind. A plain-language privacy notice is still the right thing to publish, given names, emails, and phone numbers are collected from the community.
- **Credential handover:** the sole maintainer currently holds all Supabase and Vercel access. If they become unavailable, the board has no route to its own community's data. Needs a documented handover before launch.

---

## UI/UX Needs

### Design System

Tailwind v4 + shadcn/ui (radix base). Gets accessible primitives and a coherent component set without building a design system. Visual direction — palette, typography, Newah cultural visual language — is decided in Phase 2 rather than inherited from a template.

### Key Views / Pages

| View | Purpose | Complexity |
|------|---------|------------|
| Home | Orientation + next upcoming event | low |
| About / Mission / Culture | Who the chapter is, Newah cultural context | low |
| Board | Chapter leadership | low |
| Events list | Upcoming and past events | medium — date grouping, empty states |
| Event detail | Full event info + registration form | high — the conversion surface |
| Registration confirmation | Reassurance that it worked | low |
| Contact | Reach the board | low |
| Admin: registration list + export | Board sees and exports attendees | medium — auth-gated, Phase 5 |

### Real-Time Requirements

None. Registration counts do not need live updates at this scale.

### Responsive Needs

**Mobile-first, non-negotiable.** Most visitors arrive on a phone from a social media link. Desktop is the secondary case.

---

## Integration Points

| Integration | Type | Purpose | Auth | Phase |
|------------|------|---------|------|-------|
| Supabase | SDK | Database, auth, storage | anon key (public) + session | 1 |
| Vercel | platform | Hosting, preview deploys, firewall | account | 1 |
| Transactional email | API | Registration confirmations | API key (server-only) | 4 — provider undecided |
| Stripe | API | Membership dues, paid events | secret key (server-only) | post-v0.1 |
| SMS / email marketing | API | Community outreach with consent capture | API key (server-only) | post-v0.1 |

**Failure behavior:** if the email provider is down, registration must still succeed — the database write is the source of truth and the confirmation email is best-effort. A failed send gets logged, never rolled back into a lost registration.

---

## Phase Breakdown

### Phase 1: Foundation
- **Build:** Next.js + Tailwind + shadcn scaffold; Supabase browser/server clients; pinned toolchain (Node 22, committed lockfile); CI with lint/typecheck/build/secret-scan; schema for `people`, `events`, `registrations`; RLS policies; Vercel deploy; `robots.txt` noindex
- **Testable:** deploy returns 200; build fails loudly on missing env; anon can SELECT published events; anon **cannot** SELECT `people` or `registrations`; committed tree has no secrets
- **Outcome:** stack proven end to end, data layer safe by default before any real data exists

### Phase 2: Public Site
- **Build:** visual direction, responsive layout shell, header/nav/footer, org pages (home, about, board, mission, culture, contact)
- **Testable:** renders correctly at 375px and desktop; passes WCAG AA contrast and keyboard navigation
- **Outcome:** the board has a real link to share

### Phase 3: Events
- **Build:** event list with upcoming/past grouping, event detail pages by slug, cover images via Supabase Storage, empty and error states
- **Testable:** a published event appears with correct date, time, and location; a draft event is invisible to anonymous visitors
- **Outcome:** the community can see what's happening

### Phase 4: Registration
- **Build:** `registerForEvent` Server Action — server-side validation, `people` upsert by email, registration insert, per-event dedupe, capacity enforcement, confirmation email, abuse mitigation
- **Testable:** a registration lands in Supabase; a duplicate submit does not double-book; a full event refuses politely; an email-provider outage does not lose the registration
- **Outcome:** the spreadsheet is retired

### Phase 5: Launch
- **Build:** domain purchase and DNS, SEO + Open Graph images for event sharing, privacy notice, admin-authenticated registration list with CSV export, remove noindex, credential handover doc
- **Testable:** a board member logs in, sees the attendee list, exports a CSV; a non-board user cannot reach it; shared event links render a proper preview card
- **Outcome:** live on a real domain, self-serve for the board

### Post-v0.1 (not scheduled)
Memberships + Stripe dues · full admin CRM · SMS and email marketing with consent capture and unsubscribe handling

---

## Skill Loadout & Quality Gates

### Skills Used During Build

| Skill | When It Fires | Purpose |
|-------|--------------|---------|
| PAUL | Every phase | Managed build — plans, audits, boundaries, state |
| `ui-ux-pro-max` | Phases 2, 3, 5 | Design system, palette, component patterns |
| `frontend-design` | Phases 2, 3, 5 | Component implementation |
| `design-review` | End of frontend phases | Visual QA before UNIFY |
| `browse` | Every deploy | Live-site QA (never `mcp__claude-in-chrome__*`) |
| `engineering-skills:senior-security` | Phases 1, 4, 5 | Schema, RLS policies, auth, PII surfaces |
| `vercel:nextjs`, `vercel:deploy` | Phases 1, 5 | Framework patterns and deploys |
| `code-review` | Before every merge | Pre-merge review; `high` effort for RLS/auth/payment code |
| `/paul:audit` | Between PLAN and APPLY | Enterprise architecture review — enabled for this project |
| SonarQube | Optional | Needs a reachable server; no-ops until configured |

### Quality Gates

| Gate | Threshold | When |
|------|-----------|------|
| Lint + typecheck + build | pass | Every PR |
| Secret scan (gitleaks) | pass | Every PR |
| RLS policy review | anon cannot SELECT `people` or `registrations` | Phase 1, re-verified any phase touching schema |
| Accessibility | WCAG AA | Frontend phases |
| Responsive | usable at 375px | Frontend phases |
| Performance | LCP < 2.5s on 4G mobile | Phase 5 |

---

## Design Decisions

1. **`people` as the spine** — one row per human, keyed by email; registrations and memberships reference it. Retrofitting identity after hundreds of registrations exist is a data-cleanup project; adding it now costs one table and an upsert.
2. **Email-only registration, no accounts** — removes signup friction for a community audience where most attendees register once. Accepts that someone can register another person's email; confirmation email is the mitigation.
3. **No public API; Server Actions only** — the website is the only client, so an HTTP API would be unjustified surface area.
4. **RLS as the access-control boundary, not UI checks** — the anon key is public by design, so the database is the only place enforcement is real. INSERT-without-SELECT on `people` and `registrations` is the critical policy.
5. **No service role key until a phase needs it** — it bypasses RLS; an unused copy is a standing risk with zero benefit.
6. **Vercel + Supabase, both managed** — a single volunteer maintainer cannot carry infrastructure operations.
7. **English only** — no translated columns, no locale routing. Revisit only if the board asks for Nepal Bhasa content.
8. **Free events at launch; Stripe deferred** — nothing to charge for yet; payments arrive with dues.
9. **Node 22 pinned across local, CI, and Vercel** — Node 23 is not an LTS and not a Vercel runtime; unpinned toolchains drift and break a volunteer project years later.
10. **Noindex until launch** — production Vercel deploys are crawlable; an unfinished page indexed under the organization's name is slow to undo.

---

## Open Questions

1. **Domain** — not chosen. Needed by Phase 5.
2. **Transactional email provider** — Resend vs Supabase SMTP vs Postmark. Needed by Phase 4.
3. **Admin portal / CRM scope** — deliberately undefined beyond the Phase 5 registration list and CSV export. Revisit after v0.1 ships and the board has used it once.
4. **Credential handover** — how the board regains access to Supabase and Vercel if the sole maintainer is unavailable. Must be answered before launch.
5. **Board content** — org copy, photos, and leadership details have to come from the board; this is a dependency on people, not code.

---

## Next Actions

- [ ] Run `/paul:init` in the repository root — it will import this PLANNING.md and skip its own walkthrough
- [ ] `/paul:plan` Phase 1, splitting into scaffold and schema/RLS plans
- [ ] Decide the transactional email provider before Phase 4 planning begins

---

## References

- Prior scaffold work preserved on branch `phase-01/foundation-scaffold` — includes a completed Next.js 16 + Supabase scaffold, CI workflow, and an enterprise plan audit worth re-reading before Phase 1 re-execution
- Repository: github.com/torpedo88/newah-organization

---

*Last updated: 2026-09-15*
