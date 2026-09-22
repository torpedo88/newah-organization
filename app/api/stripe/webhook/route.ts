import { NextRequest, NextResponse } from "next/server";
import { getStripe, webhookSecret } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook: the only thing permitted to mark a donation paid.
 *
 * The browser is never trusted for this. A visitor returning to the success
 * page proves nothing about whether money moved, so payment_status is advanced
 * here, against a signature Stripe computed over the raw body.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secret = webhookSecret();
  if (!stripe || !secret) {
    console.error("Stripe webhook called but STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET are not set");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  // Must be the raw body: any reserialization invalidates the signature.
  const payload = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", (error as Error).message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const status =
    event.type === "checkout.session.completed"
      ? "paid"
      : event.type === "checkout.session.expired" ||
          event.type === "checkout.session.async_payment_failed"
        ? "failed"
        : null;

  if (!status) return NextResponse.json({ received: true });

  const session = event.data.object as { id: string };
  const supabase = createAdminClient();
  if (!supabase) {
    // Returning 500 makes Stripe retry, which is what we want: the payment
    // happened and the row must eventually reflect it.
    console.error("Stripe webhook could not reach the database; SUPABASE_SERVICE_ROLE_KEY is not set");
    return NextResponse.json({ error: "database unavailable" }, { status: 500 });
  }

  const { error } = await supabase
    .from("registrations")
    .update({ payment_status: status })
    .eq("stripe_session_id", session.id);

  if (error) {
    console.error("Stripe webhook failed to update registration:", error.message);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
