# Enterprise Plan Audit Report

**Plan:** .paul/phases/01-foundation/01-02-PLAN.md
**Audited:** 2026-09-15
**Verdict:** Conditionally acceptable — approved with the applied upgrades
**Audit posture:** Deliberately harsher than the 01-01 audit. This plan is the one that decides whether a community's contact details stay private. A wrong scaffold costs an afternoon; a wrong policy here is a disclosure incident that nobody notices until someone outside the organization mentions it.

---

## 1. Executive Verdict

**Conditionally acceptable.** The plan gets the central thing right and gets it right for the stated reason: RLS is the only real boundary because the anon key is public, and the plan refuses to accept policy-by-inspection, demanding empirical probes with the real key instead. That instinct is what most implementations of this get wrong.

But the policy set as originally written had a hole, and it is exactly the kind that reads as correct: `registrations` had an unconditional `with check (true)` on anonymous INSERT. Draft events were protected on reads and completely unprotected on writes. Anyone with the public key — it ships in the browser bundle — could insert registrations against events the board had not announced or finalized. "Draft means invisible" would have been true for `select` and false for `insert`, which is the worst version of a security property: the one that holds where you test it.

The probe set also tested only reads and inserts. Deny-by-default was assumed to block UPDATE and DELETE, and assumption is what this plan otherwise refuses to accept. An anonymous UPDATE on `events` would let a stranger rewrite the details of a public community event.

With those closed, I would approve this. I would not have approved it before.

## 2. What Is Solid (Do Not Change)

- **Empirical verification over inspection.** Task 3's insistence on real queries with the real anon key, and its instruction to approach the task as an attacker, is the correct posture. Keep the wording "the goal is to make the policies fail; if you cannot, they hold."
- **No SELECT policy on `people` and `registrations`, with the reason written down.** The plan explains that a SELECT policy is equivalent to publishing the attendee list. That sentence is what stops a future maintainer from "fixing" the missing policy.
- **The upsert trap, pre-empted.** The plan anticipates that `on conflict ... returning` will fail without a SELECT policy, names the dangerous fix someone will reach for under time pressure, and points at the `security definer` solution in Phase 4. That is the single most valuable paragraph in the plan — it defuses a future incident before it has a chance to happen.
- **Refusing to write `authenticated` policies yet.** Declining to guess at a role model that does not exist is right. A placeholder policy would be a guess enforced by the database.
- **`citext` for email with the reason stated.** Prevents the duplicate-human problem the spine exists to solve.
- **Migrations as the only source of truth, dashboard explicitly excluded.** Correct, and stated strongly enough to survive a hurried change.

## 3. Enterprise Gaps Identified

**G1 — Anonymous INSERT on `registrations` was unrestricted.** `with check (true)` permitted inserts referencing any event, including drafts. The read policy hid draft events; nothing stopped writes against them. Release-blocking.

**G2 — Write denial was assumed, never probed.** Ten probes covered SELECT and INSERT. None attempted UPDATE or DELETE. Deny-by-default should refuse them, but the plan's own standard is that unproven is unknown. An anon UPDATE on `events` is public-facing vandalism; an anon DELETE on `registrations` destroys attendance records.

**G3 — AC-1 was self-contradictory.** "Applying twice produces no error on the second run **or** fails loudly" accepts both outcomes and therefore tests nothing. An acceptance criterion satisfied by either branch of a disjunction is not a criterion.

**G4 — Unbounded anonymous writes.** The `people` INSERT policy is deliberately permissive with no column constraints behind it. Nothing bounded email length, name length, or shape, so the only limit on what an unauthenticated writer could store was Postgres's own.

**G5 — No revert path.** A wrong RLS policy is a live exposure incident where response time matters. The plan had no documented rollback, leaving someone to compose `drop policy` statements from memory while data is readable.

**G6 — Probe mechanism unspecified.** "A client constructed with the anon key" left open whether probes run through a script, the dashboard, or the app. Probing through the UI tests the UI. The distinction decides whether the evidence means anything.

**G7 — Fixture creation path undefined.** Task 3 needs a draft event, which the anon client cannot create by design. The plan did not say how fixtures get in, inviting someone to reach for the service role and then keep using it for the probes — which would make every check pass meaninglessly.

## 4. Upgrades Applied to Plan

### Must-Have (Release-Blocking)

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 1 | G1 — draft events writable anonymously | Task 2 policy table | `registrations` INSERT now requires `exists (select 1 from events e where e.id = event_id and e.status = 'published')`, with an explanation of why the subquery resolves correctly under the inserting role's own RLS |
| 2 | G2 — write denial unproven | Task 3; Verification | Probes 11-14 added: UPDATE and DELETE on `events` and `registrations`, plus an INSERT against a draft event, each expected to be denied |
| 3 | G3 — untestable acceptance criterion | AC-1 | Replaced the disjunction with two checkable properties: the migration set reproduces an identical schema on a second empty project, and re-applying an applied migration fails visibly |

### Strongly Recommended

| # | Finding | Plan Section Modified | Change Applied |
|---|---------|----------------------|----------------|
| 4 | G4 — unbounded anonymous writes | Task 1 action | Column checks on `people`: email shape and 254-char limit, `full_name` 1-200 chars, with the note that these constraints are the only bound on an unauthenticated writer |
| 5 | G5 — no revert path | Task 2 action | Revert SQL required as a comment in the migration, with the reasoning that incident response is measured in minutes |
| 6 | G6, G7 — probe and fixture mechanism | Task 3 action | Probes run from a Node script under `scripts/` reading `.env.local`, never inlining a key, never through the UI; fixtures seeded via the SQL editor rather than the anon client, with the service-role trap called out |

### Deferred (Can Safely Defer)

| # | Finding | Rationale for Deferral |
|---|---------|----------------------|
| 1 | Supabase Storage bucket policies | No buckets exist until Phase 3. **Flagged as a landmine:** Storage has its own policy system separate from table RLS, and a public bucket would expose event images and any file mistakenly placed there. Phase 3 must audit bucket policies as deliberately as this plan audits table policies. |
| 2 | Rate limiting on anonymous inserts | Phase 4 owns abuse mitigation via Vercel firewall and per-event uniqueness. The column constraints added here bound row size; volume is Phase 4's problem. |
| 3 | Audit logging of registration writes | No admin surface exists to read a log. Post-v0.1, alongside the CRM. |
| 4 | Automated RLS regression tests in CI | The right end state — these probes should run on every PR so a future migration cannot silently widen access. Needs a test harness and a CI-reachable database, which is real work. Correct trigger is Phase 4, when the registration path makes regressions expensive. Until then the probes are manual and recorded in the SUMMARY. |

## 5. Audit & Compliance Readiness

**Evidence:** The probe transcript recorded in the SUMMARY is the artifact that demonstrates the organization's PII was protected at a specific point in time. It names what was attempted and what the database refused. That is inspectable by someone who did not write the policies, which is the standard that matters.

**Silent failures:** The plan's largest contribution is refusing to let a policy be trusted because it reads correctly. Probes 3, 4, 5, 8, 10 and now 11-14 are the difference between believing and knowing.

**Reconstruction:** Migrations are committed, ordered, and declared the sole source of truth, with the dashboard explicitly excluded. The schema at any commit is knowable from the repository alone.

**Ownership:** Inherited from 01-01's checkpoint — the Supabase project must be owned by an organization-controlled account. That remains the precondition for this plan meaning anything: correct policies on a database owned by a departing volunteer still leave the chapter without custody of its own data.

**Would fail an audit without:** the probe transcript. Policy definitions alone are a claim. The transcript is the evidence.

## 6. Final Release Bar

**Must be true before this plan ships:**

1. RLS enabled on all three tables; exactly three policies; no SELECT policy on `people` or `registrations`
2. `registrations` INSERT restricted to published events, verified by probe 14
3. All fourteen probes executed with the **anon** key against the real project, transcript recorded
4. Probes 3, 4, 5, 8, 10 returned zero rows; probes 11-14 denied
5. Case-differing emails collapse to one `people` row; duplicate (event_id, person_id) rejected
6. Revert SQL present in the RLS migration
7. `/code-review high` run on the diff
8. Human checkpoint approved after reading the transcript

**Remaining risks if shipped as-is:**

- The probes are manual. A future migration can widen access and nothing automated will notice — this is the deferred CI regression suite, and it is the most important deferred item in this project
- Storage policies are a separate system not covered here; Phase 3 inherits that obligation
- `security definer` in Phase 4 will legitimately bypass RLS for the upsert. That function becomes the next place a mistake would be expensive, and it deserves its own audit

**Would I sign my name to this system?**

Yes, with the upgrades applied — and with more conviction than for 01-01, because this plan proves its claims instead of asserting them.

The honest caveat: this audit verifies that anonymous users cannot read community data. It does not verify the Phase 4 registration path, where a `security definer` function will deliberately cross the boundary this plan builds. That function is where the next real risk lives, and whoever writes it should re-read this audit first.

---

**Summary:** Applied 3 must-have + 3 strongly-recommended upgrades. Deferred 4 items.
**Plan status:** Updated and ready for APPLY or handoff

---
*Audit performed by PAUL Enterprise Audit Workflow*
*Audit template version: 1.0*
