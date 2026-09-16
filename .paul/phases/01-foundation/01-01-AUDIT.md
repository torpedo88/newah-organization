# Enterprise Plan Audit Report

**Plan:** .paul/phases/01-foundation/01-01-PLAN.md
**Audited:** 2026-09-15
**Verdict:** Conditionally acceptable — approved with the applied upgrades
**Audit context:** Performed knowing the plan will be executed by a developer other than its author. That changes what counts as a gap: anything the author knows but the plan does not say is now a defect.

---

## 1. Executive Verdict

**Conditionally acceptable.** The plan's core judgment is sound — restoring an audited scaffold instead of rebuilding it, then refusing to inherit its verification, is the right shape, and the `.paul/` exclusion is correctly identified as load-bearing rather than cosmetic.

What it failed at is being executable by someone who was not in the room. Three defects were invisible while the author was also the executor:

1. The branch base is now wrong — `main` moved when PR #1 merged, and the plan still said "from the current branch."
2. Account ownership was unspecified, so a developer following it literally would create the organization's PII store under their own personal account.
3. The git credential configuration that makes the CI push work at all is repo-local and does not survive a clone. A fresh developer hits a hard failure the plan never mentions.

The third is not hypothetical. It was discovered by an actual push rejection during this session.

With the upgrades applied, I would approve this for handoff.

## 2. What Is Solid (Do Not Change)

- **Restore over rebuild, with verification explicitly not inherited.** Task 2's instruction — "do not cite the prior session's results" — is the sentence that makes reuse safe rather than reckless. Keep its wording.
- **The `.paul/` exclusion and its stated reason.** The plan explains *why* a merge would be wrong rather than just forbidding it, which is what stops a developer from "helpfully" using `git merge` when the checkout looks awkward.
- **Proving the secret detector fires.** Requiring a planted JWT to match before trusting a CLEAN result is the difference between a control and a decoration. Rare in plans; keep it.
- **Fail-fast verified in both directions.** The plan knows this guarantee was already false once in this codebase and tests it accordingly.
- **Node 23 warnings pre-declared as expected.** Prevents a developer from chasing a non-issue or, worse, "fixing" it by unpinning.

## 3. Enterprise Gaps Identified

**G1 — Branch base is stale.** `git checkout -b phase-01/foundation` from "the current branch" was written when the current branch was the planning branch. PR #1 merged that into `main`. Branching from a local leftover forks history and produces a divergence at merge time.

**G2 — Account ownership unspecified.** The checkpoint says "create a Supabase project" with no statement of who owns it. A contractor or volunteer following it literally creates the chapter's community-PII store under a personal account. Recovering it later depends on that person's cooperation, and offboarding becomes a data-custody dispute. For a volunteer organization with turnover, this is the single most consequential omission in the plan.

**G3 — Git credential requirement undocumented.** Pushing `.github/workflows/ci.yml` needs `workflow` scope. The working configuration is a **repo-local** git setting, which lives in `.git/config` and is not cloned. A new developer's first push of the CI file fails with an error that does not obviously point at credential scope. Observed live this session.

**G4 — No environment prerequisites.** Node 22, pnpm 10, authenticated `gh`, authenticated `vercel`. The plan assumed the executor's machine.

**G5 — SUMMARY.md unspecified.** "Create a SUMMARY" with no content contract. For a handoff, the SUMMARY is the durable record — the transcript will not be available to whoever comes next.

**G6 — No review gate before merge.** The plan opens a PR and deploys without requiring anyone to look at the diff. Acceptable for a solo author; not for work arriving from a second party into a codebase whose next phase depends on it being right.

## 4. Upgrades Applied to Plan

### Must-Have (Release-Blocking)

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 1 | G1 — stale branch base | Task 1 action | Explicit `git fetch origin && git checkout -b phase-01/foundation origin/main`, with the PR #1 merge named as the reason |
| 2 | G2 — account ownership | Checkpoint | Ownership note placed before step 1: both projects owned by an organization-controlled account with the developer invited, with the data-custody consequence spelled out |
| 3 | G3 — credential scope | Checkpoint | Documented the `workflow` scope requirement, the exact error text, the fact that repo-local config does not survive a clone, and the commands to re-apply |

### Strongly Recommended

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 4 | G4 — prerequisites | Checkpoint | Verify block for Node 22, pnpm 10, `gh auth status` showing `workflow`, `vercel whoami` |
| 5 | G5 — SUMMARY contract | `<output>` | Seven required contents including per-check results rather than a blanket "verified", and any check that failed first |
| 6 | G6 — review gate | Task 3 action | `/code-review` required before merge, plus a second human reviewer where available |

### Deferred (Can Safely Defer)

| # | Finding | Rationale for Deferral |
|---|---------|----------------------|
| 1 | Pre-commit hooks for secret scanning | CI gitleaks already blocks the merge path. A local hook is convenience, and one a developer can bypass; the CI gate is the control. |
| 2 | Staging environment | Vercel preview deploys per PR already provide pre-production verification at this scale. Revisit if the board grows beyond one maintainer. |
| 3 | Automated RLS policy tests | Belongs to plan 01-02, which creates the policies. Auditing it there. |
| 4 | Dependency update policy (Dependabot/Renovate) | No dependencies to age yet. Right trigger is after v0.1 ships. |

## 5. Audit & Compliance Readiness

**Evidence:** CI produces a per-PR record of lint, typecheck, build, and gitleaks, attached to a commit and inspectable by someone who is not the author. The SUMMARY contract now requires per-check results, so "verified" cannot stand in for evidence.

**Silent failures:** AC-4 requires environment misconfiguration to fail loudly naming the variable, with fallbacks explicitly prohibited. Task 2 tests it in both directions because this exact guarantee was already vacuous once.

**Reconstruction:** Feature branch, one commit per task, recorded deployment URL, and a documented rollback path.

**Ownership:** This was the weakest area and is now the most improved. Before the upgrade, the plan would have produced a community PII store under an unspecified personal account. After, ownership is a stated precondition with its consequence explained.

**Still open:** credential handover for the board remains a deferred issue in STATE.md. It does not block this plan but must not reach launch unaddressed — if the sole maintainer becomes unavailable, the board has no route to its own community's data.

## 6. Final Release Bar

**Must be true before this plan ships:**

1. Branch created from `origin/main`, not a local leftover
2. Supabase and Vercel projects owned by an organization-controlled account
3. `gh auth status` lists `workflow`, and the credential helper is configured in the working clone
4. All ten Task 2 checks executed fresh, each result recorded individually in the SUMMARY
5. CI green on the PR; `/code-review` run on the diff
6. Deployment returns 200 and `/robots.txt` disallows all agents
7. `git status --short .paul/` reports nothing — the SEED-derived state is untouched

**Remaining risks if shipped as-is:**

- Node 22 is pinned but the author's machine runs 23; a developer on yet another version gets warnings rather than errors, since pnpm does not enforce `engines` by default
- gitleaks catches known credential shapes, not every possible secret
- No staging tier — production is where real Supabase credentials are first exercised

**Would I sign my name to this system?**

For what it is — a scaffold with no user data in it — yes. My signature covers the foundation, not the product.

The decision that actually protects this community is the RLS work in **plan 01-02**, and it deserves a harder audit than this one. A wrong scaffold costs an afternoon. A wrong RLS policy publishes the home addresses of people who trusted a cultural organization with them, and neither the board nor the members would find out until someone told them.

---

**Summary:** Applied 3 must-have + 3 strongly-recommended upgrades. Deferred 4 items.
**Plan status:** Updated and ready for APPLY or handoff

---
*Audit performed by PAUL Enterprise Audit Workflow*
*Audit template version: 1.0*
