import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, webhookSecret } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { intendedStatus } from "@/lib/payments/webhook-status";

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", (error as Error).message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const status = intendedStatus(event.type, session.payment_status);
  if (!status) return NextResponse.json({ received: true, ignored: event.type });

  const supabase = createAdminClient();
  if (!supabase) {
    // Returning 500 makes Stripe retry, which is what we want: the payment
    // happened and the row must eventually reflect it.
    console.error("Stripe webhook could not reach the database; SUPABASE_SERVICE_ROLE_KEY is not set");
    return NextResponse.json({ error: "database unavailable" }, { status: 500 });
  }

  const { data: rows, error: readError } = await supabase
    .from("registrations")
    .select("id, payment_status")
    .eq("stripe_session_id", session.id);

  if (readError) {
    console.error("Stripe webhook could not read the registration:", readError.message);
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }

  // A payment we cannot attribute is the worst case here: money has moved and
  // no row records it. Acknowledging that with 200 loses it silently, so fail
  // instead — Stripe retries, and a failing endpoint is visible in its
  // dashboard rather than sitting unnoticed in a log.
  if (!rows || rows.length === 0) {
    console.error(
      `Stripe webhook ${event.type} for session ${session.id} matched no registration. ` +
        "The payment is unattributed and needs reconciling by hand.",
    );
    return NextResponse.json({ error: "no matching registration" }, { status: 500 });
  }

  const current = rows[0].payment_status as string | null;

  // Never walk a paid donation backwards. Stripe can deliver events out of
  // order, and an expiry arriving after a success must not unpay it.
  if (status === "failed" && current === "paid") {
    console.warn(
      `Stripe webhook ${event.type} for session ${session.id} would downgrade a paid ` +
        "registration; ignoring.",
    );
    return NextResponse.json({ received: true, ignored: "already paid" });
  }

  // Redelivery is normal and must be a no-op.
  if (current === status) return NextResponse.json({ received: true, unchanged: true });

  const { error } = await supabase
    .from("registrations")
    .update({ payment_status: status })
    .eq("stripe_session_id", session.id);

  if (error) {
    console.error("Stripe webhook failed to update registration:", error.message);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, payment_status: status });
}
