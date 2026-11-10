import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return new Response("Stripe is not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`, {
      status: 400,
    });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return new Response("Database connection failed", { status: 500 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Update donation status to completed
      if (paymentIntent.id) {
        await supabase
          .from("donations")
          .update({
            payment_status: "completed",
            stripe_payment_intent_id: paymentIntent.id,
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      if (paymentIntent.id) {
        await supabase
          .from("donations")
          .update({
            payment_status: "failed",
          })
          .eq("stripe_payment_intent_id", paymentIntent.id);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;

      if (charge.payment_intent) {
        await supabase
          .from("donations")
          .update({
            payment_status: "pending",
          })
          .eq("stripe_payment_intent_id", charge.payment_intent as string);
      }
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
