import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, webhookSecrets } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { intendedStatus, replaceableFrom } from "@/lib/payments/webhook-status";

/**
 * Which column identifies the registration this event is about.
 *
 * Checkout events carry the session id. A refund carries the PaymentIntent
 * instead, so it is matched on the registration code we attach to the intent
 * at creation time.
 */
function matchFor(event: Stripe.Event): { column: string; value: string } | null {
  const object = event.data.object as unknown as Record<string, unknown>;
  if (event.type.startsWith("checkout.session.")) {
    const id = object.id as string | undefined;
    return id ? { column: "stripe_session_id", value: id } : null;
  }
  const metadata = (object.metadata ?? {}) as Record<string, string>;
  const code = metadata.registration_code;
  return code ? { column: "registration_code", value: code } : null;
}

/**
 * Stripe webhook: the only thing permitted to mark a donation paid.
 *
 * The browser is never trusted for this. A visitor returning to the success
 * page proves nothing about whether money moved, so payment_status is advanced
 * here, against a signature Stripe computed over the raw body.
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const secrets = webhookSecrets();
  if (!stripe || secrets.length === 0) {
    console.error("Stripe webhook called but STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET are not set");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  // Must be the raw body: any reserialization invalidates the signature.
  const payload = await request.text();

  // Tried against each configured secret: during a domain move the same
  // deployment serves two endpoints, each with its own secret, and only one of
  // them will match any given delivery.
  let event: Stripe.Event | null = null;
  let lastError = "";
  for (const secret of secrets) {
    try {
      event = stripe.webhooks.constructEvent(payload, signature, secret);
      break;
    } catch (error) {
      lastError = (error as Error).message;
    }
  }
  if (!event) {
    console.error("Stripe webhook signature verification failed:", lastError);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const object = event.data.object as Stripe.Checkout.Session;
  const status = intendedStatus(event.type, object.payment_status);
  if (!status) return NextResponse.json({ received: true, ignored: event.type });

  const match = matchFor(event);
  if (!match) return NextResponse.json({ received: true, ignored: "nothing to match on" });

  const supabase = createAdminClient();
  if (!supabase) {
    // 500 makes Stripe retry, which is what we want: the payment happened and
    // the row must eventually reflect it.
    console.error("Stripe webhook could not reach the database; SUPABASE_SERVICE_ROLE_KEY is not set");
    return NextResponse.json({ error: "database unavailable" }, { status: 500 });
  }

  // One atomic conditional UPDATE. Reading the current status and then writing
  // it back loses to two concurrent deliveries: both read "pending", and
  // whichever writes last wins regardless of what it means. Encoding the
  // allowed predecessors in the WHERE clause makes the database decide.
  const { data: updated, error } = await supabase
    .from("registrations")
    .update({ payment_status: status })
    .eq(match.column, match.value)
    .in("payment_status", replaceableFrom(status))
    .select("id, charged_cents, payment_status");

  if (error) {
    console.error("Stripe webhook failed to update registration:", error.message);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  if (updated && updated.length > 0) {
    // The amounts should agree. stripe_session_id is unique, so a mismatch
    // means the row was not built from this session — worth saying loudly
    // rather than reconciling silently.
    const charged = updated[0].charged_cents as number | null;
    if (status === "paid" && typeof object.amount_total === "number" && charged !== null) {
      if (object.amount_total !== charged) {
        console.error(
          `Stripe webhook amount mismatch for ${match.value}: Stripe charged ` +
            `${object.amount_total} but the registration records ${charged}.`,
        );
      }
    }
    return NextResponse.json({ received: true, payment_status: status });
  }

  // Nothing was updated. Either this event does not apply to the row's current
  // state — a redelivery, or a late event that must not move it backwards —
  // or no row carries this session at all, which is money we cannot attribute.
  const { data: existing } = await supabase
    .from("registrations")
    .select("id, payment_status")
    .eq(match.column, match.value)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({
      received: true,
      ignored: `${event.type} does not apply to a ${existing[0].payment_status} registration`,
    });
  }

  // Acknowledging this with 200 would lose the payment silently. Failing makes
  // Stripe retry and shows the endpoint as failing in its dashboard.
  console.error(
    `Stripe webhook ${event.type} for ${match.column}=${match.value} matched no registration. ` +
      "The payment is unattributed and needs reconciling by hand.",
  );
  return NextResponse.json({ error: "no matching registration" }, { status: 500 });
}
