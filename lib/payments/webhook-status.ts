import type Stripe from "stripe";

export type PaymentStatus = "none" | "pending" | "paid" | "failed" | "refunded";

/**
 * What a given Stripe event means for our row.
 *
 * `checkout.session.completed` is not by itself proof of payment. For an
 * asynchronous method the session completes while the money is still in
 * flight, arriving with payment_status 'unpaid', and a later
 * async_payment_succeeded or async_payment_failed settles it.
 */
export function intendedStatus(
  eventType: string,
  sessionPaymentStatus?: Stripe.Checkout.Session["payment_status"],
): PaymentStatus | null {
  switch (eventType) {
    case "checkout.session.completed":
      return sessionPaymentStatus === "paid" ? "paid" : "pending";
    case "checkout.session.async_payment_succeeded":
      return "paid";
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired":
      return "failed";
    case "charge.refunded":
      return "refunded";
    default:
      return null;
  }
}

/**
 * Which states this one may replace.
 *
 * Stripe does not guarantee event order and retries for up to three days, so
 * any of these can arrive late. The previous version guarded only paid ->
 * failed, which left paid -> **pending** wide open: a retried
 * completed(unpaid) delivery landing after async_payment_succeeded walked a
 * settled donation back to "awaiting payment", returned 200 so Stripe never
 * retried, and logged nothing. Money in Stripe, "unpaid" on the board.
 *
 * Expressed as the set of predecessors rather than a comparison so it can be
 * applied as one atomic conditional UPDATE — a read-then-write loses to two
 * concurrent deliveries.
 */
export function replaceableFrom(next: PaymentStatus): PaymentStatus[] {
  switch (next) {
    case "paid":
      // Never un-refund; otherwise a payment confirmation always wins.
      return ["none", "pending", "failed"];
    case "refunded":
      return ["paid"];
    case "failed":
      // A failure never overrides money that actually arrived.
      return ["none", "pending"];
    case "pending":
      // Only ever forward from "no payment expected".
      return ["none"];
    default:
      return [];
  }
}
