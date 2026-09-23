"use server";

import { registrationSchema, Registration, filledGuests } from "@/lib/validation/registration";
import { createHash } from "node:crypto";
import { normalizePhone } from "@/lib/validation/contact";
import { domainAcceptsMail } from "@/lib/validation/email-domain";
import { supabase } from "@/lib/supabase/client";
import { render } from "@react-email/render";
import { RegistrationConfirmationEmail } from "@/lib/emails/registration-confirmation";
import { sendEmail } from "@/lib/emails/send";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/legal/org";
import { EVENT } from "@/lib/constants/event";
import { settlement } from "@/lib/payments/fees";
import { getStripe, siteUrl } from "@/lib/payments/stripe";

/**
 * The registration code.
 *
 * Derived from the submission id rather than drawn at random, so a retry of
 * the same form produces the same code. That is what makes the insert
 * idempotent: the second attempt collides on registration_code instead of
 * creating a second attendee, and we can still tell the registrant the code
 * their first attempt was given.
 */
function registrationCode(submissionId?: string): string {
  const year = new Date().getFullYear();
  if (!submissionId) {
    return `NOA-${year}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
  const digest = createHash("sha256").update(submissionId).digest("base64url");
  const suffix = digest.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase();
  return `NOA-${year}-${suffix}`;
}

export type RegisterResult = {
  success: boolean;
  registrationCode?: string;
  /** Present only when a donation needs paying; the browser redirects here. */
  checkoutUrl?: string;
  donationCents?: number;
  chargedCents?: number;
  netCents?: number;
  broughtFood?: boolean;
  /** Whether a confirmation actually went out, so the screen can stop promising one. */
  emailSent?: boolean;
  /** This exact form had already been saved; the code is the original one. */
  alreadyRegistered?: boolean;
  error?: string;
};

/**
 * Insert a registration.
 *
 * There is deliberately no `.select()` here. Reading the new row back needs a
 * SELECT policy, and this table holds registrant names, phones and emails, so
 * no such policy exists — the Stripe session id is written with the row rather
 * than updated onto it afterwards.
 *
 * There is also deliberately no reduced-row fallback. One used to drop the
 * consent columns and retry when PostgREST rejected the insert, which is how
 * three real registrations were saved with consent_given false: the retry
 * succeeded, so nothing looked wrong. A registration whose consent was not
 * recorded is not a lesser record of the same thing, it is a different and
 * unusable one. If a column is missing, this now fails loudly and the migration
 * gets applied.
 */
async function insertRegistration(payload: Record<string, unknown>) {
  // One RPC rather than two inserts. A registration and its guests now live in
  // separate tables and must be written together: two PostgREST calls are two
  // transactions, and a failure between them would leave a registration whose
  // guests are silently missing. create_registration does both, or neither.
  //
  // The function also carries every rule the INSERT policy used to, because it
  // is SECURITY DEFINER and RLS does not apply to it. anon has no INSERT on
  // either table now — this is the only way in.
  return supabase.rpc("create_registration", { payload });
}

export async function registerAttendee(input: Registration): Promise<RegisterResult> {
  try {
    const validated = registrationSchema.parse(input);

    // Syntax cannot tell gmail.com from gmial.co.uk, but DNS can. This is the
    // last point at which a typo is still cheap to fix: after this the
    // registrant walks away believing a confirmation is coming.
    if (!(await domainAcceptsMail(validated.email ?? ""))) {
      return {
        success: false,
        error: "We could not find that email domain. Please check the address and try again.",
      };
    }

    const code = registrationCode(validated.submissionId);
    const broughtFood = validated.broughtFood === true;
    const guests = filledGuests(validated.adultGuests);
    // Only an explicit "amount" choice produces a charge. Deriving this from
    // donationAmount alone would let a caller decline the donation and still
    // name a figure, and the figure is what the charge is built from.
    const donationCents =
      validated.donationChoice === "amount" &&
      validated.donationAmount &&
      validated.donationAmount > 0
        ? Math.round(validated.donationAmount * 100)
        : null;
    // Covering the fee is the donor's choice. Covered, they pay a grossed-up
    // total and the organization receives the whole donation; declined, the
    // processor's cut comes out of the donation instead.
    const coversFee = validated.coversFee === true;
    const money = donationCents ? settlement(donationCents, coversFee) : null;

    // The checkout session is created BEFORE the insert so its id can be
    // written with the row. Doing it afterwards would need an UPDATE policy
    // for anon, and reading the new row's id back would need a SELECT policy —
    // neither of which should exist on a table holding registrant contact
    // details. A session created for an insert that then fails is harmless: it
    // is never handed to anyone and Stripe expires it.
    let checkoutUrl: string | undefined;
    let stripeSessionId: string | undefined;
    if (donationCents && money) {
      const session = await createCheckout({
        code,
        email: validated.email ?? "",
        donationCents,
        chargedCents: money.chargedCents,
        coversFee,
      });
      checkoutUrl = session?.url;
      stripeSessionId = session?.id;
    }

    const { error } = await insertRegistration({
      registration_code: code,
      submission_id: validated.submissionId ?? null,
      registration_type: "event",
      full_name: validated.fullName ?? "",
      phone: normalizePhone(validated.phone ?? ""),
      email: validated.email ?? "",
      // The registrant plus every named adult they are bringing.
      // number_of_guests is derived inside the function from the guest list,
      // so the count and the names cannot disagree.
      guests,
      brought_food: broughtFood,
      food_description: broughtFood ? (validated.foodDescription ?? "") : null,
      donation_cents: donationCents,
      charged_cents: money?.chargedCents ?? null,
      net_cents: money?.toOrganizationCents ?? null,
      covers_fee: coversFee,
      stripe_session_id: stripeSessionId ?? null,
      payment_status: donationCents ? "pending" : "none",
      consent_given: validated.consentGiven === true,
      consent_text: CONSENT_TEXT,
      consent_version: CONSENT_VERSION,
      consent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    // A duplicate submission id or registration code means this exact form was
    // already saved — a double click, a browser retry, a flaky connection. The
    // registrant is told the code their first attempt was given rather than
    // becoming a second attendee.
    if (error?.code === "23505") {
      if (stripeSessionId) await expireSession(stripeSessionId);
      return {
        success: true,
        registrationCode: code,
        donationCents: donationCents ?? undefined,
        chargedCents: money?.chargedCents,
        netCents: money?.toOrganizationCents,
        broughtFood,
        emailSent: false,
        alreadyRegistered: true,
      };
    }

    if (error) {
      console.error("Supabase error:", error);
      // The Stripe session was created before this insert, so a failure here
      // strands a live session that nothing will ever claim. Left alone it
      // fires checkout.session.expired in 24 hours, the webhook cannot match
      // it, and the endpoint returns 500 for three days of retries. Enough of
      // those and Stripe disables the endpoint — at which point real payments
      // stop being recorded. Expiring it now costs one API call.
      if (stripeSessionId) await expireSession(stripeSessionId);
      if (error.code === "PGRST205") {
        return { success: false, error: "Database not initialized. Run the SQL migrations in Supabase." };
      }
      return { success: false, error: `Failed to save registration: ${error.message}` };
    }

    const emailSent = await sendConfirmation({
      name: validated.fullName ?? "",
      email: validated.email ?? "",
      code,
      broughtFood,
      foodDescription: validated.foodDescription ?? "",
      donationCents,
      guestCount: guests.length,
    });

    return {
      success: true,
      registrationCode: code,
      checkoutUrl,
      donationCents: donationCents ?? undefined,
      chargedCents: money?.chargedCents,
      netCents: money?.toOrganizationCents,
      broughtFood,
      emailSent,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

async function createCheckout(args: {
  code: string;
  email: string;
  donationCents: number;
  chargedCents: number;
  coversFee: boolean;
}): Promise<{ id: string; url?: string } | undefined> {
  const stripe = getStripe();
  if (!stripe) {
    // The registration is already saved; only the payment cannot proceed.
    console.error("STRIPE_SECRET_KEY is not set; donation recorded as pending but not charged");
    return undefined;
  }

  try {
    const base = siteUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Card only, deliberately. Left unset, Stripe also offers Klarna,
      // Affirm, Cash App and Amazon Pay on this account, and those charge
      // 5.99%-6% + 30c rather than 2.9% + 30c. net_cents is computed from the
      // card rate, so a Klarna payment would overstate what the organization
      // receives by several dollars on a $100 donation — while the checkout
      // page tells the donor they are covering the fee so the organization
      // receives the full amount. Restricting the methods is what makes that
      // sentence true.
      payment_method_types: ["card"],
      customer_email: args.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: args.chargedCents,
            product_data: {
              name: `${EVENT.title} donation`,
              description: args.coversFee
                ? `$${(args.donationCents / 100).toFixed(2)} donation plus ` +
                  `$${((args.chargedCents - args.donationCents) / 100).toFixed(2)} card processing, ` +
                  `which you chose to cover so the organization receives the full amount.`
                : `$${(args.donationCents / 100).toFixed(2)} donation. Card processing is ` +
                  `deducted from this amount.`,
            },
          },
        },
      ],
      metadata: {
        registration_code: args.code,
        donation_cents: String(args.donationCents),
      },
      // Refund events carry the PaymentIntent, not the session, so without
      // this there is nothing to tie a refund back to a registration.
      payment_intent_data: {
        metadata: { registration_code: args.code },
      },
      success_url: `${base}/register/indrajatra?donation=success&code=${encodeURIComponent(args.code)}`,
      cancel_url: `${base}/register/indrajatra?donation=cancelled&code=${encodeURIComponent(args.code)}`,
    });

    return { id: session.id, url: session.url ?? undefined };
  } catch (error) {
    console.error("Could not create Stripe checkout session:", error);
    return undefined;
  }
}

async function sendConfirmation(args: {
  name: string;
  email: string;
  code: string;
  broughtFood: boolean;
  foodDescription: string;
  donationCents: number | null;
  guestCount: number;
}): Promise<boolean> {
  if (!args.email) return false;

  const html = await render(
    RegistrationConfirmationEmail({
      name: args.name,
      registrationCode: args.code,
      broughtFood: args.broughtFood,
      foodDescription: args.foodDescription,
      donationCents: args.donationCents,
      guestCount: args.guestCount,
    }),
  );
  // A plain-text part is not optional: some clients render only text, and its
  // absence costs deliverability with spam filters.
  const text = await render(
    RegistrationConfirmationEmail({
      name: args.name,
      registrationCode: args.code,
      broughtFood: args.broughtFood,
      foodDescription: args.foodDescription,
      donationCents: args.donationCents,
      guestCount: args.guestCount,
    }),
    { plainText: true },
  );

  const result = await sendEmail({
    to: args.email,
    subject: `You're registered - ${EVENT.title}`,
    html,
    text,
  });
  return result.sent;
}

/**
 * Close a checkout session nobody will ever pay.
 *
 * Best effort by design: if this fails the registration has already failed,
 * and the worst case is one orphaned session rather than a lost registrant.
 */
async function expireSession(sessionId: string): Promise<void> {
  const stripe = getStripe();
  if (!stripe) return;
  try {
    await stripe.checkout.sessions.expire(sessionId);
  } catch (error) {
    console.error("Could not expire the orphaned Stripe session:", (error as Error).message);
  }
}
