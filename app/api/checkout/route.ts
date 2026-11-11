import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { siteUrl } from "@/lib/site";
import { emailProblem, normalizeEmail } from "@/lib/validation/contact";
import { settlement } from "@/lib/payments/fees";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments are not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { donor_name, donor_email, donor_phone, amount, donation_type, anonymous, covers_fee } = body;

    // Whole dollars from $1 to $10,000; anything else is a typo or abuse.
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 1 || amount > 10_000) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    if (typeof donor_email !== "string" || emailProblem(donor_email)) {
      return NextResponse.json({ error: "A valid email is needed for the receipt" }, { status: 400 });
    }

    const donationCents = Math.round(amount * 100);
    const { chargedCents, toOrganizationCents } = settlement(donationCents, covers_fee ?? false);

    // Save donation to database first
    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ error: "Donations are not configured" }, { status: 503 });
    }
    const { data: donation, error: dbError } = await supabase
      .from("donations")
      .insert([
        {
          donor_name: anonymous ? "Anonymous" : donor_name,
          donor_email: normalizeEmail(donor_email),
          donor_phone: donor_phone || null,
          amount: donationCents,
          donation_type,
          payment_status: "pending",
          anonymous,
          covers_fee: covers_fee ?? false,
        },
      ])
      .select()
      .single();

    if (dbError || !donation) {
      return NextResponse.json(
        { error: "Failed to create donation record" },
        { status: 500 }
      );
    }

    // Create Stripe checkout session with correct amount
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to Newah Organization - ${donation_type}`,
              description: covers_fee
                ? `$${(donationCents / 100).toFixed(2)} donation + $${((chargedCents - donationCents) / 100).toFixed(2)} processing fee`
                : `$${(donationCents / 100).toFixed(2)} donation (org receives $${(toOrganizationCents / 100).toFixed(2)} after fees)`,
            },
            unit_amount: chargedCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl()}/donate?success=true`,
      cancel_url: `${siteUrl()}/donate?canceled=true`,
      customer_email: donor_email,
      metadata: {
        donation_id: donation.id.toString(),
        donor_name,
        donation_type,
        covers_fee: covers_fee ? "true" : "false",
      },
    });

    // Store Stripe session ID in database
    await supabase
      .from("donations")
      .update({ stripe_payment_intent_id: session.id })
      .eq("id", donation.id);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
