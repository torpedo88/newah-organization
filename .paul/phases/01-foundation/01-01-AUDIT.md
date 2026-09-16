# Enterprise Plan Audit Report

**Plan:** .paul/phases/01-foundation/01-01-PLAN.md
**Audited:** 2026-09-15
**Verdict:** Conditionally acceptable — approved for execution only with the applied upgrades

---

## 1. Executive Verdict

**Conditionally acceptable.** I would not have approved the plan as originally written, and the reason is not stylistic: it contained three defects that would have produced broken or unsafe output.

The plan's scope discipline was genuinely good — the boundaries section is specific, and the decision to create no service-role Supabase client before anything needs one is the correct instinct and better than what most teams do. But good instincts were undermined by implementation detail that did not survive scrutiny:

1. The environment-validation module would have crashed the browser bundle at runtime for every visitor.
2. The secret-scan verification command scanned the wrong thing and would have passed while proving nothing.
3. The `server-only` guard was specified without the package that makes it work, so it would have been an inert string.

Beyond the defects, the plan had no CI, no reproducibility pinning, and no standing secret control — acceptable for a weekend prototype, not for a system that will hold community members' names, emails, phone numbers, and home addresses for years under a single maintainer.

With the applied upgrades, I would approve this plan. I would not have approved it before.

## 2. What Is Solid (Do Not Change)

- **No service-role client in this plan.** Correct and deliberately reasoned. An unused RLS-bypassing credential sitting in a codebase is a standing risk with no offsetting benefit. The decision to defer it to the phase that actually needs it is the right layering.
- **Browser/server client separation.** Splitting `lib/supabase/client.ts` from `lib/supabase/server.ts` rather than exporting one ambiguous client is the correct boundary and prevents an entire class of leak.
- **Boundaries section specificity.** "No schema, no auth, no domain, no analytics, no Stripe, no email provider" is enforceable and names the owning phase for each exclusion. This is what stops a foundation plan from quietly becoming the whole product.
- **Refusal to disable typecheck or lint to force a green deploy.** Stated explicitly with its reason. Keep that language verbatim.
- **The human-action checkpoint refuses credentials in chat.** Correct — the maintainer places keys in `.env.local` and in Vercel settings, and nowhere else.

## 3. Enterprise Gaps Identified

**G1 — Environment validation would crash the client bundle.** `lib/env.ts` validated `SUPABASE_SERVICE_ROLE_KEY` alongside the public variables, in a module imported by client code. Next.js replaces only `NEXT_PUBLIC_*` variables in the browser bundle; everything else is `undefined` there. A module-load throw on a missing service-role key therefore fires in every visitor's browser. This is a functional defect, not a hardening suggestion.

**G2 — The secret scan verified the wrong surface.** The original command grepped the working directory, which includes `.next` build output and other ignored artifacts. It would generate false positives from build output while never establishing the fact that matters: whether a credential is present in the committed, pushed tree. A check that cannot fail for the right reason and can fail for wrong ones is not a control.

**G3 — `server-only` specified but never installed.** `import 'server-only'` only throws at build time because the package's `package.json` declares a browser condition that resolves to a module that throws. Without the dependency, the import is a no-op string and the stated protection does not exist.

**G4 — No CI.** All verification ran on the maintainer's laptop. With a single maintainer and no gate, nothing stands between a broken or leaking commit and the default branch, and there is no evidence trail an auditor could inspect. "The maintainer ran it locally" is not audit evidence.

**G5 — Unpinned toolchain.** `create-next-app@latest`, `shadcn@latest`, caret dependency ranges, and no Node pin. The local machine runs **Node v23.1.0 — not an LTS release and not a Vercel runtime**, so local and production were already diverging before the first line was written. Over the multi-year life of a volunteer-maintained project, an unpinned scaffold is how a site stops building two years later when someone needs to post an event.

**G6 — No standing secret protection.** The plan scanned for secrets once, during this plan. Nothing prevented the next commit from adding one. One-time scans protect the moment they run and nothing after it.

**G7 — Vercel project identity unverified.** The checkpoint said "create the Vercel project" with no confirmation step. This account also hosts unrelated client projects. A mislinked deploy publishes this organization's site into another project — potentially overwriting a live client deployment. Low probability, high blast radius, near-zero cost to prevent.

**G8 — Production deploy publicly indexable.** Vercel preview deployments carry `noindex`; production deploys do not. The plan would have published a placeholder page under this organization's name to crawlers. Reputationally awkward and slow to reverse once indexed.

**G9 — No branch or commit discipline.** The plan wrote to the working tree with no branch specified, while the session sits on `torpedo88/main`. No rollback boundary, and nothing separating scaffold work from the default branch.

**G10 — No rollback path for a bad deploy.** "Fix the cause" covers a failed build but not a deploy that succeeds and serves a broken page.

## 4. Upgrades Applied to Plan

### Must-Have (Release-Blocking)

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 1 | G1 — env validation crashes client bundle | Task 2 action; AC-2; AC-7 (new); Boundaries | `lib/env.ts` now validates public variables only; explicit prohibition on reading `SUPABASE_SERVICE_ROLE_KEY` in any client-reachable module, with the reason stated; `.env.example` no longer lists a service-role slot |
| 2 | G2 — secret scan targeted the working directory | New Task 4; AC-3; Verification | Scan rewritten to run over `git ls-files` contents; added a tracked-file check for `.env*` and `.vercel`; added an explicit stop-and-rotate instruction if a match is found |
| 3 | G3 — `server-only` not installed | Task 2 action; Verification | `server-only` added as an explicit dependency with a note that the import is inert without it; verification asserts it resolves in package.json |
| 4 | G7 — Vercel project identity unverified | Checkpoint step 5; Task 5 action; Verification | Added `vercel project ls` scope/name confirmation before deploy, with the overwrite risk stated |
| 5 | G9 — no branch discipline | Task 1 action; Boundaries; Verification | Work pinned to `phase-01/foundation-scaffold`; `main` and `torpedo88/main` added to DO NOT CHANGE; one commit per task |

### Strongly Recommended

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 6 | G4 — no CI gate | New Task 3; AC-5 (new); Verification | GitHub Actions workflow: install (frozen lockfile), lint, `tsc --noEmit`, build, gitleaks — on pull request and default-branch push, using dummy public env values so CI holds no real credentials |
| 7 | G5 — unpinned toolchain | Task 1 action; Objective; Verification | `.nvmrc` = 22, `engines.node` = `>=22 <23`, exact versions pinned for next/react/react-dom, lockfile committed, Vercel Node set to 22; local Node 23.1.0 called out as the mismatch to fix |
| 8 | G6 — no standing secret control | New Task 3; `.gitleaks.toml` | gitleaks in CI on every pull request, with a narrow allowlist for `.env.example` only |
| 9 | G8 — production deploy indexable | New Task 3; AC-6 (new); Boundaries; Task 5 verify | `app/robots.ts` disallowing all agents, with removal designated explicitly as Phase 5 work |
| 10 | G10 — no rollback path | Task 5 action | `vercel rollback` procedure added for a deploy that succeeds but serves a broken page, plus a SUMMARY record requirement |

### Deferred (Can Safely Defer)

| # | Finding | Rationale for Deferral |
|---|---------|----------------------|
| 1 | No logging or observability baseline | No user data flows through the system in this plan. Phase 4 (Registration) is the correct trigger — that is where a silent failure first costs someone their spot at an event. |
| 2 | No privacy notice | No PII is collected by this scaffold. Phase 5 owns it, and PROJECT.md already records it as a compliance constraint so it cannot be quietly dropped. |
| 3 | No accessibility baseline in the root layout | Phase 2 owns the design system; setting it here would be overwritten. Must not slip past Phase 2 — a community site with mixed-ability visitors needs it. |
| 4 | No Supabase backup or disaster-recovery plan | No tables exist yet. Correct trigger is plan 01-02, when the schema lands. |
| 5 | Bus factor of one | Organizational, not fixable inside a plan. Recorded so it is visible: if the sole maintainer becomes unavailable, the board has no route to the Vercel or Supabase accounts. Worth a credentials-handover note before launch. |

## 5. Audit & Compliance Readiness

**Before the upgrades:** would have failed a real review. No CI meant no evidence that any check ever ran. The secret scan produced an unreliable signal. The `server-only` guard was decorative. There was no branch boundary, so no clean statement of what changed and when.

**After the upgrades:**

- **Defensible evidence** — CI produces a per-pull-request record of lint, typecheck, build, and secret scan results, attached to a commit and timestamped. That is inspectable by someone who is not the maintainer.
- **Silent failures prevented** — AC-7 requires environment misconfiguration to fail loudly and name the offending variable, with fallbacks to defaults or unauthenticated clients explicitly prohibited. Fail-fast at startup instead of a client that silently connects as nobody.
- **Post-incident reconstruction** — feature branch plus one commit per task plus a recorded deployment URL plus `vercel rollback` gives a coherent timeline and a reversal path.
- **Ownership** — single maintainer, explicitly named as a project constraint and as deferred finding 5. Honest rather than resolved.

**Remaining area that would still draw an auditor's question:** the credential recovery path. If the sole maintainer is unavailable, no one can reach the Supabase or Vercel accounts holding community members' personal data. That is out of scope for a scaffold plan but should not reach launch unaddressed.

## 6. Final Release Bar

**What must be true before this plan ships:**

1. `pnpm build` and `pnpm exec tsc --noEmit` both exit 0 on Node 22
2. The committed-tree secret scan prints CLEAN, and `.env*` / `.vercel` appear in no tracked path
3. `server-only` is an installed dependency and `SUPABASE_SERVICE_ROLE_KEY` appears in no module and no example file
4. CI runs and passes on the pull request
5. The linked Vercel project is confirmed to be newah-organization before any deploy
6. The deployed URL returns 200 and its `/robots.txt` disallows all agents

**Risks that remain if shipped as-is, with the upgrades applied:**

- Node 22 pinning fixes drift going forward but does not retroactively test against Node 23; the maintainer must actually switch local versions or the mismatch persists in a different direction
- gitleaks catches known credential patterns, not every possible secret shape
- No staging environment — production is the first place real Supabase credentials are exercised. Acceptable at this scale; revisit if the board grows beyond one maintainer

**Would I sign my name to this system?**

With the applied upgrades, yes — for what it is: a scaffold with no user data in it. My signature covers the foundation, not the product. The decision that actually protects this organization's members is the Row Level Security work in plan 01-02, and that plan deserves a harder audit than this one. A scaffold can be wrong and be fixed in an afternoon. An RLS policy that is wrong leaks the home addresses of a community that trusted this organization with them.

---

**Summary:** Applied 5 must-have + 5 strongly-recommended upgrades. Deferred 5 items.
**Plan status:** Updated and ready for APPLY

---
*Audit performed by PAUL Enterprise Audit Workflow*
*Audit template version: 1.0*
