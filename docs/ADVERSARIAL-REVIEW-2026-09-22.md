**Verdict: request changes. Registration is blocked by the checked-in database contract, and the public write boundary permits fabricated payment records.**

Independent reviewer: **GPT-6 Astra, high reasoning**, explicitly selected for this review. Reviewed commit `baec891c7dfb53fc37f92862a47afc2ba621f78a`; the coordinating agent independently executed additional attack probes. Application code remains unchanged. No production services, real payments, or real attendee records were touched.

This review challenges and extends the [initial QA report](QA-2026-09-22.md). Findings concern repository code and reconstructed local schema; hosted schema, column grants, firewall controls, and provider configuration were not inspected. P1 means a blocker or substantial integrity failure; P2 means a material functional defect or a conditional security risk.

| Priority | Finding | Evidence |
| --- | --- | --- |
| P1 | Public inserts can fabricate payment records and poison later writes | Direct PostgreSQL execution |
| P1 | Normal registration violates RLS and the registration-type constraint | Prior browser/SQL probes, independently reviewed source |
| P1 | Stripe session linkage fails; unmatched payments receive HTTP 200 | SQL policy probe and independent actual-handler execution |
| P2 | Custom amount typing changes the intended donation | Fresh Chrome keyboard reproduction |
| P2 | Invalid forms throw instead of displaying validation errors | Independent installed-resolver execution and prior browser reproduction |
| P2 | Delayed-payment lifecycle can mark unpaid or failed sessions paid | Actual handler, real signature verification, mocked persistence |
| P2 | Schema fallback discards consent, guests, food, and payment data | Actual action, injected missing-column response |
| P2 | Donation decline can still create an over-limit checkout | Actual action, mocked successful database/provider |
| P2 | Stored consent text differs from the checkbox text | Direct source comparison |

**1. Public INSERT is a trusted-field injection boundary, not just a forged-status bug.**

Source: [0003](../supabase/migrations/0003_fix_registrations_rls.sql), lines 27–31; [base schema](../lib/supabase/migrations.sql), line 3; [0005](../supabase/migrations/0005_jatra_with_cause.sql), session index; [admin totals](../app/admin/page.tsx), lines 152–154.

The `anon` INSERT policy uses `WITH CHECK (true)`. Under the table-level INSERT privileges modeled in the local tests, callers can supply `id`, `payment_status`, `stripe_session_id`, and donation/net amounts directly. Three attacks were reproduced:

- **Fake receipts:** a direct anonymous row containing `payment_status='paid'` and fabricated monetary values is accepted. Admin totals trust these fields.
- **Primary-key poisoning:** on a fresh reconstructed database, an anonymous row with explicit `id=1` succeeds without advancing the BIGSERIAL sequence. The next ordinary insert using its generated ID fails with `23505: registrations_pkey`. Reserving a range of future IDs can break subsequent registrations. This does not require anonymous SELECT access; predicting an unused future range is the attack prerequisite on an existing database.
- **Duplicate payment attribution:** an anonymous pending row worth $10,000 can reuse the session ID of a seeded legitimate $1 registration. Session IDs have a nonunique index. The exact webhook UPDATE marks both rows paid, yielding $10,001 in recorded receipts from a single matched session. A real-world attacker would need a valid session ID and a subsequent genuine payment event; no ability to forge a Stripe signature is assumed. The probe simulated the resulting privileged UPDATE locally.

These attacks share one root cause. Restricting only the initial payment status leaves ID/session injection open. Establish a constrained server write boundary, restrict public columns or remove public INSERT access, and enforce unique trusted checkout linkage. Keep attendee SELECT private.

**2. Two independent database defects prevent registration.**

Source: [register.ts](../lib/actions/register.ts), lines 66 and 110; [0003](../supabase/migrations/0003_fix_registrations_rls.sql), lines 18–31; [base schema](../lib/supabase/migrations.sql), line 5.

The anonymous action requests `.insert(...).select('id').single()`, but RLS denies SELECT. PostgreSQL rejects the insert with `42501`. Independently, the action writes `registration_type='event'`, while the schema permits only `food` or `donation`; no subsequent migration repairs the CHECK constraint. Removing RETURNING from the probe exposes the separate `23514` failure.

Both need correction. Adding a public SELECT policy to make the action work would expose attendee information and is not an acceptable repair.

**3. Checkout linkage and webhook acknowledgement can lose payment state.**

Source: [register.ts](../lib/actions/register.ts), lines 223–227; [webhook](../app/api/stripe/webhook/route.ts), lines 55–65.

The action attempts to save `stripe_session_id` using the anonymous client despite having no UPDATE policy. The update affects zero rows and its result is ignored. The webhook then updates by that missing session ID and acknowledges success even when nothing matched. Astra independently invoked the actual handler with a locally signed unknown-session event and observed HTTP 200.

The normal checkout path reaches this defect after the registration blockers are fixed. Use authorized, verified session persistence and explicitly handle missing matches; receipt of a valid signature does not prove a registration was updated.

**4. Custom donation entry changes the amount while the donor types.**

Source: [donation-fields.tsx](../components/registration/donation-fields.tsx), line 89.

The controlled input becomes an empty string whenever its numeric value equals a preset. A real keyboard sequence therefore loses digits as soon as it crosses a preset:

| Typed | Field ends at | Charge shown with fee coverage |
| --- | --- | --- |
| `52` | `2` | `$2.37` |
| `1000` | `0` | No summary |
| `2500` | `0` | No summary |
| `15` | `15` | `$15.76` |
| `123` | `123` | `$126.99` |

Reproduced in Chrome with `pressSequentially`, not a single programmatic fill. Store the custom input's editing string separately from preset selection and the validated numeric donation.

**5. Validation errors escape the form resolver.**

Source: [package.json](../package.json), lines 17 and 35; [registration-form.tsx](../components/registration/registration-form.tsx), line 29.

The installed resolver expects the Zod 3 error shape but the app installs Zod 4. Astra independently invoked the installed resolver with empty input and received a thrown `ZodError` with five issues. Earlier Chrome tests show no field messages for empty forms, missing food details, and incomplete guests. Align the dependency contract and test visible errors, not only schema acceptance.

**6. Webhook event names are mistaken for settled payment state.**

Source: [webhook](../app/api/stripe/webhook/route.ts), lines 36–46.

With a stored session and delayed payment methods enabled, `checkout.session.completed` may precede payment settlement. This handler immediately writes paid and ignores `checkout.session.async_payment_succeeded`. Independent actual-handler probes produced `completed(unpaid) → paid`, `async_payment_failed → failed`, then a redelivered `completed(unpaid) → paid`; a separate async-success event left a pending row unchanged.

Stripe documents the need to inspect payment status, handle repeated processing, and process the async-success event for delayed methods. [Stripe fulfillment documentation](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted).

The deployed payment-method configuration was not inspected. Reconcile verified payment state and handle event delivery order and retries. This is not a signature bypass.

**7. The missing-column fallback silently removes the registration's substantive data.**

Source: [register.ts](../lib/actions/register.ts), lines 69–88.

An injected `PGRST204` for `adult_guests` made the actual action retry using only code, name, phone, email, head count, and creation time. The successful fallback omitted consent evidence, adult names/contact details, food details, donation amounts, and payment state. The action nevertheless proceeded to create checkout and returned successful registration details from the original input.

This probe used mocked successful persistence to reach behavior currently blocked by RLS. The relevant deployment condition is an incomplete migration with a write path that otherwise works. A partial row must not be reported as if all details were saved. Avoid a broad fallback that also treats unrelated constraint messages containing a field name as missing-column errors.

**8. Declining a donation does not constrain server-side payment creation.**

Source: [validation](../lib/validation/registration.ts), lines 79–89; [register.ts](../lib/actions/register.ts), lines 98–101.

With `donationChoice='none'` and `donationAmount=20000`, validation passes. Against mocked successful persistence, the actual action requested checkout with `unit_amount=2000000`. It ignores the decline and bypasses the $10,000 maximum because bounds are checked only for the `amount` choice. This does not silently charge a card: checkout still requires payment authorization. It is a server contract failure, not evidence of unauthorized completed charges.

Make the donation choice and amount one consistent validated state and derive the checkout from that state.

**9. The saved consent statement is not what the visitor sees.**

Source: [org.ts](../lib/legal/org.ts), lines 71–74; [registration-form.tsx](../components/registration/registration-form.tsx), lines 196–201; [register.ts](../lib/actions/register.ts), line 125.

The stored `CONSENT_TEXT` has different opening wording and includes a withdrawal sentence absent from the checkbox. The code claims it stores the displayed wording verbatim, but it does not. Render and persist the same versioned text. This is a technical audit-record mismatch, not a legal conclusion.

**Other actionable findings and conditions**

- **P2, login guessing:** [admin/actions.ts](../app/admin/actions.ts), lines 12–15, has no application throttle or failed-attempt state. Astra executed the action with 1,000 bad guesses followed by the correct password; all were processed. Practical compromise depends on password strength and external controls, which were not inspected. No authentication bypass was found.
- **P2, partial admin totals:** [admin/page.tsx](../app/admin/page.tsx), lines 136–154, makes one unpaginated request and treats its rows as the complete dataset. If registrations exceed the configured API response cap, counts and money totals silently exclude older rows. The actual cap is unknown. Aggregate on the server and paginate the list.
- **P2, retry duplication:** two identical actual-action calls against mocked persistence generated different codes and two inserts. After fixing inserts, a retry can inflate attendance and repeat email/checkout creation. Introduce an appropriate idempotency boundary without assuming an email address can attend only once.
- **P2, donation email wording:** [confirmation email](../lib/emails/registration-confirmation.tsx), line 117, thanks the recipient for a donation before checkout is completed. Describe an unpaid pledge until payment is verified.
- Checkout success/cancel URLs still render a blank registration form, and the board view still omits collected adult details. See the initial report for reproductions.

**Challenges to overbroad conclusions**

- Checkout-provider failure is not falsely displayed as paid on the website: `paymentPending` causes explicit unpaid messaging. The separate email wording is the narrower defect.
- The earlier completed → expired webhook probe establishes permissive handler behavior, but not a realistic lifecycle. The delayed-payment/retried-completion scenario above is better supported.
- Anonymous reads remained closed in local tests. There is no evidence here of a current public attendee read policy, a leaked service key, or a forged admin session being accepted.
- Admin tokens correctly reject modified signatures, modified expiries, malformed/empty tokens, expired tokens, old tokens after password rotation, and missing configuration.
- Several downstream probes deliberately mock successful insertion. They demonstrate latent defects, not working end-to-end checkout against the presently broken schema.
- The local SQL tests explicitly grant table-level INSERT and sequence privileges to `anon`. More restrictive hosted column grants could mitigate particular direct-write attacks; those hosted grants were not verified.

**Evidence**

- [Database attack probes](qa/2026-09-22/adversarial-db-results.json)
- [Actual registration action with injected provider/database boundaries](qa/2026-09-22/adversarial-action-results.json)
- [Admin token rejection probes](qa/2026-09-22/adversarial-auth-results.json)
- [Real keyboard donation-entry probes](qa/2026-09-22/adversarial-ui-results.json)
- [Astra independent resolver, login, and webhook probes](qa/2026-09-22/astra-independent-results.json)

Temporary harnesses: `/tmp/newah-qa/adversarial-{db.mjs,action.mts,auth.mts,ui.mjs}` and `/tmp/newah-independent-review.cjs`. SQL used an isolated PGlite database built from the repository migrations; UI tests used the existing production build in local Chrome; provider/action tests blocked or mocked external calls. No production exploit attempts were made.

Recommended repair order: constrain trusted writes and checkout linkage; repair the registration schema/write contract; fix amount input and validation; then cover retries, payment events, return states, and accurate admin totals with regression tests.
