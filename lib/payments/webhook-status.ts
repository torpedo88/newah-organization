import type Stripe from "stripe";

export type PaymentStatus = "pending" | "paid" | "failed";

/**
 * What a given Stripe event means for our row.
 *
 * `checkout.session.completed` is not by itself proof of payment. For an
 * asynchronous payment method the session completes while the money is still
 * in flight, arriving with payment_status 'unpaid', and a later
 * async_payment_succeeded or async_payment_failed settles it. Treating every
 * completion as paid would mark those donations paid before they clear — and
 * some would never clear.
 *
 * Returning null means the event says nothing about payment and is ignored.
 */
export function intendedStatus(
  eventType: string,
  sessionPaymentStatus: Stripe.Checkout.Session["payment_status"] | undefined,
): PaymentStatus | null {
  switch (eventType) {
    case "checkout.session.completed":
      return sessionPaymentStatus === "paid" ? "paid" : "pending";
    case "checkout.session.async_payment_succeeded":
      return "paid";
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      return "failed";
    default:
      return null;
  }
}
