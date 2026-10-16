"use server";

import { createHash } from "node:crypto";
import { render } from "@react-email/render";
import {
  mhapujaRegistrationSchema,
  MhapujaRegistration,
} from "@/lib/validation/mhapuja-registration";
import { normalizePhone, normalizeEmail } from "@/lib/validation/contact";
import { domainAcceptsMail } from "@/lib/validation/email-domain";
import { supabase } from "@/lib/supabase/client";
import { MhapujaConfirmationEmail } from "@/lib/emails/mhapuja-confirmation";
import { sendEmail } from "@/lib/emails/send";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/legal/org";
import {
  MHAPUJA_ADULT_PRICE_CENTS,
  MHAPUJA_CHILD_PRICE_CENTS,
  MHAPUJA_EVENT,
  MHAPUJA_FEE_INCLUDES,
} from "@/lib/constants/mhapuja";
import { getStripe, siteUrl } from "@/lib/payments/stripe";

/**
 * Mha Puja registration.
 *
 * Mirrors `registerAttendee` for Indra Jatra. The important differences:
 *
 *  - Payment is required, not optional. There is no path that writes a row
 *    without a Stripe session; a config error on Stripe fails the whole
 *    submission rather than saving a stray "pending without session" row.
 *
 *  - The amount is derived from counts and the prices RECORDED on the row,
 *    not from a figure the browser sent. The browser's counts are inputs; the
 *    money is computed here and the webhook later verifies that Stripe
 *    actually charged the same figure.
 */

function registrationCode(submissionId?: string): string {
  const year = new Date().getFullYear();
  if (!submissionId) {
    return `MHP-${year}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
  // Same digest-based derivation as the Indra Jatra code, so a resubmit of
  // the same form yields the same registration code and collides on insert
  // instead of creating a second attendee.
  const digest = createHash("sha256").update(submissionId).digest("base64url");
  const suffix = digest.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase();
  return `MHP-${year}-${suffix}`;
}

export type MhapujaRegisterResult = {
  success: boolean;
  registrationCode?: string;
  /** Where the browser is redirected to pay. Always present on success. */
  checkoutUrl?: string;
  chargedCents?: number;
  adultCount?: number;
  childCount?: number;
  alreadyRegistered?: boolean;
  emailSent?: boolean;
  error?: string;
};

export async function registerMhaPuja(
  input: MhapujaRegistration,
): Promise<MhapujaRegisterResult> {
  try {
    const validated = mhapujaRegistrationSchema.parse(input);
    const normalizedEmail = normalizeEmail(validated.email ?? "");

    // Reject the obvious duplicate up front, so the registrant hears about it
    // immediately rather than after a Stripe redirect. The database still
    // enforces uniqueness as a backstop against races.
    const { data: existingEmail } = await supabase
      .from("mhapuja_registrations")
      .select("id", { count: "exact", head: true })
      .eq("email", normalizedEmail);

    if (existingEmail && existingEmail.length > 0) {
      return {
        success: false,
        error: "This email is already registered for Mha Puja. Need to make changes? Contact us.",
      };
    }

    // Last cheap chance to catch a typo in the address — after this, the
    // registrant walks away thinking a confirmation is coming.
    if (!(await domainAcceptsMail(normalizedEmail))) {
      return {
        success: false,
        error: "We could not find that email domain. Please check the address and try again.",
      };
    }

    const adultCount = validated.adultCount ?? 0;
    const childCount = validated.childCount ?? 0;

    // Prices live in the constants file, in cents, and are recorded on the
    // row at insert time so a future price change does not rewrite anyone's
    // receipt. If either tier's price is ever zero it is a config error, not
    // a free tier — reject here before the Stripe session is made.
    const adultPrice = MHAPUJA_ADULT_PRICE_CENTS;
    const childPrice = MHAPUJA_CHILD_PRICE_CENTS;
    if (adultPrice <= 0 || childPrice <= 0) {
      return { success: false, error: "Ticket pricing is misconfigured. Please contact us." };
    }

    const chargedCents = adultCount * adultPrice + childCount * childPrice;
    if (chargedCents <= 0) {
      // At-least-one is enforced in the schema too. The database check also
      // guards it. Belt and braces, because the money is why this flow exists.
      return { success: false, error: "At least one ticket is needed." };
    }

    const code = registrationCode(validated.submissionId);

    // Stripe FIRST. The session id goes onto the row at insert; writing it
    // afterwards would need an UPDATE policy for anon, and anon has none on
    // this table. A session created for an insert that then fails is harmless:
    // it is never handed to anyone and Stripe expires it.
    //
    // A missing Stripe config fails the registration entirely rather than
    // writing a "pending without session" row. For Indra Jatra this trade-off
    // is different (the donation is optional, so the registration can still
    // land); here the whole point of the registration is the ticket.
    const session = await createCheckout({
      code,
      email: validated.email ?? "",
      adultCount,
      childCount,
      adultPrice,
      childPrice,
      chargedCents,
    });
    if (!session?.url) {
      return {
        success: false,
        error:
          "We could not reach the payment provider. Please try again in a moment, " +
          "or contact us if this keeps happening.",
      };
    }

    const normalizedPhone = normalizePhone(validated.phone ?? "");
    const e164Phone = normalizedPhone.length === 10 ? `+1${normalizedPhone}` : normalizedPhone;

    const { error } = await supabase.rpc("create_mhapuja_registration", {
      payload: {
        registration_code: code,
        submission_id: validated.submissionId ?? null,
        full_name: validated.fullName ?? "",
        phone: e164Phone,
        email: normalizedEmail,
        adult_count: adultCount,
        child_count: childCount,
        adult_price_cents: adultPrice,
        child_price_cents: childPrice,
        charged_cents: chargedCents,
        stripe_session_id: session.id,
        payment_status: "pending",
        consent_given: validated.consentGiven === true,
        consent_text: CONSENT_TEXT,
        consent_version: CONSENT_VERSION,
        consent_at: new Date().toISOString(),
      },
    });

    // 23505: unique constraint violation. Either submission_id/registration_code
    // (browser double-submit) or email (race with another submission).
    if (error?.code === "23505") {
      await expireSession(session.id);
      if (error.message?.toLowerCase().includes("email")) {
        return {
          success: false,
          error: "This email is already registered for Mha Puja. Need to make changes? Contact us.",
        };
      }
      return {
        success: true,
        alreadyRegistered: true,
        registrationCode: code,
        chargedCents,
        adultCount,
        childCount,
      };
    }

    if (error) {
      console.error("Supabase error (Mha Puja):", error);
      await expireSession(session.id);
      if (error.code === "PGRST205") {
        return {
          success: false,
          error: "Database not initialized. Run the SQL migrations in Supabase.",
        };
      }
      return { success: false, error: `Failed to save registration: ${error.message}` };
    }

    // Confirmation of registration-received, NOT payment-confirmed. The paid
    // email goes out later from the webhook (next iteration) once Stripe
    // confirms the money moved. For now this is the "we have you, pay here"
    // acknowledgement; the registrant is about to be redirected to Stripe.
    const emailSent = await sendPendingConfirmation({
      name: validated.fullName ?? "",
      email: normalizedEmail,
      code,
      adultCount,
      childCount,
      chargedCents,
    });

    return {
      success: true,
      registrationCode: code,
      checkoutUrl: session.url,
      chargedCents,
      adultCount,
      childCount,
      emailSent,
    };
  } catch (error) {
    console.error("Mha Puja registration error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

async function createCheckout(args: {
  code: string;
  email: string;
  adultCount: number;
  childCount: number;
  adultPrice: number;
  childPrice: number;
  chargedCents: number;
}): Promise<{ id: string; url?: string } | undefined> {
  const stripe = getStripe();
  if (!stripe) {
    console.error("STRIPE_SECRET_KEY is not set; cannot sell Mha Puja tickets");
    return undefined;
  }

  try {
    const base = siteUrl();
    // One line item per non-zero tier. Zero quantities are omitted rather
    // than sent as 0, because Stripe rejects a line item with quantity 0.
    const line_items: Array<{
      quantity: number;
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; description: string };
      };
    }> = [];
    if (args.adultCount > 0) {
      line_items.push({
        quantity: args.adultCount,
        price_data: {
          currency: "usd",
          unit_amount: args.adultPrice,
          product_data: {
            name: `${MHAPUJA_EVENT.name} — adult ticket`,
            description:
              `Entry for one adult (10 and over), ${MHAPUJA_FEE_INCLUDES}. ` +
              `$${(args.adultPrice / 100).toFixed(2)} per ticket.`,
          },
        },
      });
    }
    if (args.childCount > 0) {
      line_items.push({
        quantity: args.childCount,
        price_data: {
          currency: "usd",
          unit_amount: args.childPrice,
          product_data: {
            name: `${MHAPUJA_EVENT.name} — child ticket`,
            description:
              `Entry for one child (under 10), ${MHAPUJA_FEE_INCLUDES}. ` +
              `$${(args.childPrice / 100).toFixed(2)} per ticket.`,
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Card only, same reasoning as the Indra Jatra checkout: unset, Stripe
      // offers Klarna/Affirm/Cash App/Amazon Pay at a different (higher) rate,
      // and this flow quotes a card-rate figure. Restricting the methods is
      // what makes the figure true.
      payment_method_types: ["card"],
      customer_email: args.email || undefined,
      line_items,
      metadata: {
        registration_code: args.code,
        event: "mhapuja",
        charged_cents: String(args.chargedCents),
      },
      // Refund events carry the PaymentIntent, not the session, so without
      // this there is nothing to tie a refund back to a registration.
      payment_intent_data: {
        metadata: { registration_code: args.code, event: "mhapuja" },
      },
      success_url: `${base}/register/mhapuja?ticket=success&code=${encodeURIComponent(args.code)}`,
      cancel_url: `${base}/register/mhapuja?ticket=cancelled&code=${encodeURIComponent(args.code)}`,
    });

    return { id: session.id, url: session.url ?? undefined };
  } catch (error) {
    console.error("Could not create Stripe checkout session for Mha Puja:", error);
    return undefined;
  }
}

async function sendPendingConfirmation(args: {
  name: string;
  email: string;
  code: string;
  adultCount: number;
  childCount: number;
  chargedCents: number;
}): Promise<boolean> {
  if (!args.email) return false;

  const html = await render(
    MhapujaConfirmationEmail({
      name: args.name,
      registrationCode: args.code,
      adultCount: args.adultCount,
      childCount: args.childCount,
      chargedCents: args.chargedCents,
      paid: false,
    }),
  );
  // Spam filters punish HTML-only mail; the plain-text part is not optional.
  const text = await render(
    MhapujaConfirmationEmail({
      name: args.name,
      registrationCode: args.code,
      adultCount: args.adultCount,
      childCount: args.childCount,
      chargedCents: args.chargedCents,
      paid: false,
    }),
    { plainText: true },
  );

  const result = await sendEmail({
    to: args.email,
    subject: `Your Mha Puja registration — ${args.code}`,
    html,
    text,
  });
  return result.sent;
}

/**
 * Close a Stripe session nobody will ever pay.
 *
 * Same best-effort rationale as the Indra Jatra flow: if this fails, the
 * registration has already failed, and the worst case is one orphaned session
 * rather than a lost registrant.
 */
async function expireSession(sessionId: string): Promise<void> {
  const stripe = getStripe();
  if (!stripe) return;
  try {
    await stripe.checkout.sessions.expire(sessionId);
  } catch (error) {
    console.error("Could not expire orphaned Mha Puja session:", (error as Error).message);
  }
}
