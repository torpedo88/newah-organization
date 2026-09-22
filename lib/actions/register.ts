"use server";

import { registrationSchema, Registration, filledGuests } from "@/lib/validation/registration";
import { supabase } from "@/lib/supabase/client";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { RegistrationConfirmationEmail } from "@/lib/emails/registration-confirmation";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/lib/legal/org";
import { EVENT } from "@/lib/constants/event";
import { settlement } from "@/lib/payments/fees";
import { getStripe, siteUrl } from "@/lib/payments/stripe";

// Constructed lazily: the Resend SDK throws "Missing API key" from its
// constructor, and at module scope that would take down the whole server
// action — a registration must still be saved when email is unconfigured.
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resendClient ??= new Resend(key);
  return resendClient;
}

/**
 * Who confirmation emails come from.
 *
 * The default is Resend's shared test domain, which only delivers to the
 * account holder's own address — every registrant's confirmation would be
 * rejected. Set RESEND_FROM to an address on a domain verified in Resend
 * before relying on these emails reaching anyone.
 */
function senderAddress(): string {
  return process.env.RESEND_FROM || "Newah Organization <noreply@resend.dev>";
}

function usingTestSender(): boolean {
  return senderAddress().includes("resend.dev");
}

function registrationCode(): string {
  return `NOA-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
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
  error?: string;
};

/**
 * Insert a registration, tolerating a database that has not had the newer
 * migrations applied yet.
 *
 * A missing column makes PostgREST reject the whole insert, which would take
 * registration down completely. Columns added by 0004 and 0005 are therefore
 * dropped and retried rather than losing the registration outright.
 */
async function insertRegistration(row: Record<string, unknown>) {
  const first = await supabase.from("registrations").insert(row).select("id").single();
  if (!first.error) return first;

  const missingColumn =
    first.error.code === "PGRST204" ||
    /consent_\w+|brought_food|food_description|donation_cents|charged_cents|net_cents|covers_fee|adult_guests|payment_status|stripe_session_id/.test(
      first.error.message ?? "",
    );
  if (!missingColumn) return first;

  console.error(
    "registrations is missing newer columns; apply supabase/migrations/0004 and 0005. " +
      "Saving a reduced row for now.",
  );
  const reduced: Record<string, unknown> = {
    registration_code: row.registration_code,
    full_name: row.full_name,
    phone: row.phone,
    email: row.email,
    number_of_guests: row.number_of_guests,
    created_at: row.created_at,
  };
  return supabase.from("registrations").insert(reduced).select("id").single();
}

export async function registerAttendee(input: Registration): Promise<RegisterResult> {
  try {
    const validated = registrationSchema.parse(input);

    const code = registrationCode();
    const broughtFood = validated.broughtFood === true;
    const guests = filledGuests(validated.adultGuests);
    const donationCents =
      validated.donationAmount && validated.donationAmount > 0
        ? Math.round(validated.donationAmount * 100)
        : null;
    // Covering the fee is the donor's choice. Covered, they pay a grossed-up
    // total and the organization receives the whole donation; declined, the
    // processor's cut comes out of the donation instead.
    const coversFee = validated.coversFee === true;
    const money = donationCents ? settlement(donationCents, coversFee) : null;

    const { data, error } = await insertRegistration({
      registration_code: code,
      registration_type: "event",
      full_name: validated.fullName ?? "",
      phone: validated.phone ?? "",
      email: validated.email ?? "",
      // The registrant plus every named adult they are bringing.
      number_of_guests: 1 + guests.length,
      adult_guests: guests,
      brought_food: broughtFood,
      food_description: broughtFood ? (validated.foodDescription ?? "") : null,
      donation_cents: donationCents,
      charged_cents: money?.chargedCents ?? null,
      net_cents: money?.toOrganizationCents ?? null,
      covers_fee: coversFee,
      payment_status: donationCents ? "pending" : "none",
      consent_given: validated.consentGiven === true,
      consent_text: CONSENT_TEXT,
      consent_version: CONSENT_VERSION,
      consent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error:", error);
      if (error.code === "PGRST205") {
        return { success: false, error: "Database not initialized. Run the SQL migrations in Supabase." };
      }
      return { success: false, error: `Failed to save registration: ${error.message}` };
    }

    // A donation means a trip to Stripe. Everything else is done here.
    let checkoutUrl: string | undefined;
    if (donationCents && money) {
      checkoutUrl = await createCheckout({
        rowId: (data as { id: string } | null)?.id,
        code,
        email: validated.email ?? "",
        donationCents,
        chargedCents: money.chargedCents,
        coversFee,
      });
    }

    await sendConfirmation({
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
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

async function createCheckout(args: {
  rowId?: string;
  code: string;
  email: string;
  donationCents: number;
  chargedCents: number;
  coversFee: boolean;
}): Promise<string | undefined> {
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
      success_url: `${base}/register?donation=success&code=${encodeURIComponent(args.code)}`,
      cancel_url: `${base}/register?donation=cancelled&code=${encodeURIComponent(args.code)}`,
    });

    if (session.id && args.rowId) {
      await supabase
        .from("registrations")
        .update({ stripe_session_id: session.id })
        .eq("id", args.rowId);
    }
    return session.url ?? undefined;
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
}) {
  const resend = getResendClient();
  if (!resend) {
    console.error("RESEND_API_KEY is not configured; confirmation email not sent");
    return;
  }
  if (!args.email) return;
  if (usingTestSender()) {
    console.error(
      "Sending from Resend's test domain, which only delivers to the account holder. " +
        "Set RESEND_FROM to an address on a domain verified in Resend, or registrants " +
        "will not receive their confirmation.",
    );
  }

  try {
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
    const response = await resend.emails.send({
      from: senderAddress(),
      to: args.email,
      subject: `You're registered - ${EVENT.title}`,
      html,
    });
    if (response.error) {
      console.error("Resend rejected the email:", response.error.message);
    }
  } catch (error) {
    console.error("Email send error:", error);
  }
}
